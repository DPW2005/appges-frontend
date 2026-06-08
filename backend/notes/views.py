from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiTypes
from django.db.models import Sum, F, ExpressionWrapper, DecimalField

from notes.models import EvaluationUE, Note, Bulletin
from notes.serializers import EvaluationUESerializer, NoteSerializer, BulletinSerializer
from core.permissions import EstGestionnaire, EstEnseignant

try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except ImportError:
    WEASYPRINT_AVAILABLE = False


class EvaluationUEViewSet(viewsets.ModelViewSet):
    queryset = EvaluationUE.objects.all()
    serializer_class = EvaluationUESerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['ue', 'trimestre', 'annee']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EstGestionnaire()]
        return super().get_permissions()


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['etudiant', 'evaluation', 'absent']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EstEnseignant()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(saisie_par=self.request.user)

    def perform_update(self, serializer):
        serializer.save(saisie_par=self.request.user)


class BulletinViewSet(viewsets.ModelViewSet):
    queryset = Bulletin.objects.all()
    serializer_class = BulletinSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['etudiant', 'classe', 'trimestre', 'annee', 'publie']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'calculer']:
            return [EstGestionnaire()]
        return super().get_permissions()

    @extend_schema(
        request=None,
        responses={200: BulletinSerializer},
        summary="Calculer la moyenne et le rang",
        description="Recalcule la moyenne générale, la mention et le rang pour un bulletin donné à partir des notes saisies."
    )
    @action(detail=True, methods=['post'])
    def calculer(self, request, pk=None):
        bulletin = self.get_object()
        notes = Note.objects.filter(
            etudiant=bulletin.etudiant,
            evaluation__trimestre=bulletin.trimestre,
            evaluation__annee=bulletin.annee,
            absent=False
        )

        somme_notes = 0
        somme_coeffs = 0
        
        # Ce calcul basique suppose que le poids de l'évaluation est un % ou un coef.
        # Pour faire simple : somme(note * poids / note_max) / somme(poids)
        for note in notes:
            eval_poids = float(note.evaluation.poids)
            note_max = float(note.evaluation.note_max)
            valeur = float(note.valeur)
            
            somme_notes += (valeur / note_max) * 20.0 * eval_poids
            somme_coeffs += eval_poids
            
        if somme_coeffs > 0:
            bulletin.moyenne_generale = round(somme_notes / somme_coeffs, 2)
            bulletin.mention = bulletin.calculer_mention()
        else:
            bulletin.moyenne_generale = 0
            bulletin.mention = ''

        bulletin.save()
        
        # Mise à jour des rangs pour toute la classe
        bulletins_classe = Bulletin.objects.filter(
            classe=bulletin.classe,
            trimestre=bulletin.trimestre,
            annee=bulletin.annee
        ).order_by('-moyenne_generale')
        
        rang = 1
        for b in bulletins_classe:
            b.rang = rang
            b.save(update_fields=['rang'])
            rang += 1
            
        bulletin.refresh_from_db()
        return Response(self.get_serializer(bulletin).data)

    @extend_schema(
        responses={200: OpenApiTypes.BINARY},
        summary="Générer le PDF d'un bulletin",
        description="Retourne le fichier PDF du bulletin individuel utilisant WeasyPrint."
    )
    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        bulletin = self.get_object()
        
        html_string = f"""
        <html>
            <head><style>body {{ font-family: sans-serif; }}</style></head>
            <body>
                <h1>Bulletin {bulletin.trimestre}/{bulletin.annee}</h1>
                <p>Étudiant : {bulletin.etudiant.nom_complet}</p>
                <p>Classe : {bulletin.classe.libelle}</p>
                <p>Moyenne Générale : {bulletin.moyenne_generale} / 20</p>
                <p>Mention : {bulletin.get_mention_display()}</p>
                <p>Rang : {bulletin.rang}</p>
            </body>
        </html>
        """
        
        if WEASYPRINT_AVAILABLE:
            pdf_file = HTML(string=html_string).write_pdf()
            response = HttpResponse(pdf_file, content_type='application/pdf')
            response['Content-Disposition'] = f'inline; filename="bulletin_{bulletin.etudiant.matricule}.pdf"'
            return response
        else:
            return Response({'detail': 'WeasyPrint n\'est pas installé ou configuré correctement.'}, status=status.HTTP_501_NOT_IMPLEMENTED)
