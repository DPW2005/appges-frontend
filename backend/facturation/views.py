import uuid
from django.db import transaction
from django.http import HttpResponse
from django.template.loader import render_to_string
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes

from facturation.models import Facture, LigneFacture
from facturation.serializers import FactureSerializer
from enseignements.models import Seance
from core.permissions import EstGestionnaire, EstSuperAdmin
from core.models import JournalAction, Utilisateur

try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except ImportError:
    WEASYPRINT_AVAILABLE = False


class FactureViewSet(viewsets.ModelViewSet):
    queryset = Facture.objects.all()
    serializer_class = FactureSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['enseignant', 'trimestre', 'annee', 'statut']
    search_fields = ['reference']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'generer_facture']:
            return [EstGestionnaire()]
        return super().get_permissions()

    @extend_schema(
        request=OpenApiTypes.OBJECT,
        parameters=[
            OpenApiParameter('enseignant_id', OpenApiTypes.INT, description="ID de l'enseignant", required=True),
            OpenApiParameter('trimestre', OpenApiTypes.STR, description="Trimestre (T1, T2, T3)", required=True),
            OpenApiParameter('annee', OpenApiTypes.INT, description="Année", required=True),
        ],
        responses={201: FactureSerializer, 400: OpenApiTypes.OBJECT},
        summary="Générer une facture pour un enseignant",
        description="Crée une facture regroupant toutes les séances validées et non facturées pour un enseignant donné sur la période."
    )
    @action(detail=False, methods=['post'])
    def generer_facture(self, request):
        enseignant_id = request.data.get('enseignant_id')
        trimestre = request.data.get('trimestre')
        annee = request.data.get('annee')

        if not all([enseignant_id, trimestre, annee]):
            return Response({'detail': 'enseignant_id, trimestre et annee sont requis.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            enseignant = Utilisateur.objects.get(pk=enseignant_id)
        except Utilisateur.DoesNotExist:
            return Response({'detail': 'Enseignant non trouvé.'}, status=status.HTTP_404_NOT_FOUND)

        if Facture.objects.filter(enseignant=enseignant, trimestre=trimestre, annee=annee).exists():
            return Response({'detail': 'Une facture existe déjà pour cet enseignant pour ce trimestre/année.'}, status=status.HTTP_400_BAD_REQUEST)

        # Récupérer les séances validées, non facturées de cet enseignant
        seances = Seance.objects.filter(
            enseignant=enseignant,
            est_validee=True,
            lignes_facture__isnull=True
        )

        if not seances.exists():
            return Response({'detail': 'Aucune séance validée non facturée trouvée pour cet enseignant.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            reference = f"FAC-{annee}-{trimestre}-{str(uuid.uuid4())[:6].upper()}"
            facture = Facture.objects.create(
                reference=reference,
                enseignant=enseignant,
                trimestre=trimestre,
                annee=annee,
                generee_par=request.user,
                statut=Facture.StatutFacture.BROUILLON
            )

            for seance in seances:
                LigneFacture.objects.create(
                    facture=facture,
                    seance=seance,
                    description=f"Séance {seance.ue.code} du {seance.date_heure_debut.strftime('%d/%m/%Y')}",
                    type_seance=seance.type_seance,
                    duree_heures=seance.duree_heures,
                    tarif_horaire=seance.montant_brut / float(seance.duree_heures) if seance.duree_heures else 0,
                    montant=seance.montant_brut
                )
            
            facture.calculer_total()

            JournalAction.objects.create(
                utilisateur=request.user,
                action=f"Génération facture {facture.reference}",
                details=f"Montant: {facture.montant_total} FCFA"
            )

        serializer = self.get_serializer(facture)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        responses={200: OpenApiTypes.BINARY},
        summary="Générer le PDF d'une facture",
        description="Retourne le fichier PDF de la facture utilisant WeasyPrint."
    )
    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        facture = self.get_object()
        
        # Le template sera créé en phase 6, on génère un HTML basique en attendant si non existant
        html_string = f"""
        <html>
            <head><style>body {{ font-family: sans-serif; }}</style></head>
            <body>
                <h1>Facture {facture.reference}</h1>
                <p>Enseignant : {facture.enseignant.nom_complet}</p>
                <p>Montant total : {facture.montant_total} FCFA</p>
                <p>Statut : {facture.get_statut_display()}</p>
            </body>
        </html>
        """
        
        if WEASYPRINT_AVAILABLE:
            pdf_file = HTML(string=html_string).write_pdf()
            response = HttpResponse(pdf_file, content_type='application/pdf')
            response['Content-Disposition'] = f'inline; filename="facture_{facture.reference}.pdf"'
            return response
        else:
            return Response({'detail': 'WeasyPrint n\'est pas installé ou configuré correctement.'}, status=status.HTTP_501_NOT_IMPLEMENTED)
