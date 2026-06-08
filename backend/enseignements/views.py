from datetime import datetime, timedelta
from rest_framework import viewsets, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes

from enseignements.models import UniteEnseignement, Salle, Seance
from enseignements.serializers import UniteEnseignementSerializer, SalleSerializer, SeanceSerializer
from core.permissions import EstGestionnaire, EstSuperAdmin
from core.models import Role, JournalAction


class UniteEnseignementViewSet(viewsets.ModelViewSet):
    queryset = UniteEnseignement.objects.all()
    serializer_class = UniteEnseignementSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['code', 'intitule']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EstGestionnaire()]
        return super().get_permissions()


class SalleViewSet(viewsets.ModelViewSet):
    queryset = Salle.objects.all()
    serializer_class = SalleSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['nom', 'batiment']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EstGestionnaire()]
        return super().get_permissions()


class SeanceViewSet(viewsets.ModelViewSet):
    queryset = Seance.objects.all()
    serializer_class = SeanceSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['ue', 'enseignant', 'classe', 'salle', 'est_validee', 'type_seance']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'valider']:
            return [EstGestionnaire()]
        return super().get_permissions()

    @extend_schema(
        request=None,
        responses={200: SeanceSerializer},
        summary="Valider une séance",
        description="Permet au gestionnaire de valider une séance. Cette action est irréversible et permet par la suite de générer la facturation associée."
    )
    @action(detail=True, methods=['post'])
    def valider(self, request, pk=None):
        seance = self.get_object()
        if seance.est_validee:
            return Response({'detail': 'Cette séance est déjà validée.'}, status=status.HTTP_400_BAD_REQUEST)
        
        seance.est_validee = True
        seance.validee_par = request.user
        seance.date_validation = timezone.now()
        seance.save(update_fields=['est_validee', 'validee_par', 'date_validation'])

        JournalAction.objects.create(
            utilisateur=request.user,
            action=f"Validation de la séance {seance.id}",
            details=f"UE: {seance.ue.code}, Enseignant: {seance.enseignant.matricule}"
        )

        serializer = self.get_serializer(seance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PlanningView(views.APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter('classe', OpenApiTypes.INT, description='ID de la classe', required=False),
            OpenApiParameter('enseignant', OpenApiTypes.INT, description="ID de l'enseignant", required=False),
            OpenApiParameter('semaine', OpenApiTypes.STR, description='Semaine au format YYYY-WW (ex: 2026-23)', required=True),
        ],
        responses={200: SeanceSerializer(many=True)},
        summary="Consulter le planning",
        description="Retourne les séances planifiées pour une classe ou un enseignant sur une semaine donnée."
    )
    def get(self, request, *args, **kwargs):
        semaine_str = request.query_params.get('semaine')
        classe_id = request.query_params.get('classe')
        enseignant_id = request.query_params.get('enseignant')

        if not semaine_str:
            return Response({'detail': 'Le paramètre "semaine" est requis (YYYY-WW).'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Parse YYYY-WW to get start of the week (Monday)
            year, week = map(int, semaine_str.split('-'))
            # Format %G-%V-1 gives the Monday of the ISO week
            start_date = datetime.strptime(f'{year}-W{week}-1', "%G-W%V-%w").date()
            start_datetime = timezone.make_aware(datetime.combine(start_date, datetime.min.time()))
            end_datetime = start_datetime + timedelta(days=7)
        except ValueError:
            return Response({'detail': 'Format de semaine invalide. Utilisez YYYY-WW.'}, status=status.HTTP_400_BAD_REQUEST)

        queryset = Seance.objects.filter(
            date_heure_debut__gte=start_datetime,
            date_heure_debut__lt=end_datetime
        )

        if classe_id:
            queryset = queryset.filter(classe_id=classe_id)
        elif enseignant_id:
            queryset = queryset.filter(enseignant_id=enseignant_id)
        else:
            # Si ni classe ni enseignant n'est spécifié, et qu'on n'est pas admin/gestionnaire,
            # on limite aux séances de l'utilisateur (si étudiant ou enseignant).
            user = request.user
            if user.role == Role.ETUDIANT and hasattr(user, 'profil_etudiant') and user.profil_etudiant.classe:
                queryset = queryset.filter(classe=user.profil_etudiant.classe)
            elif user.role == Role.ENSEIGNANT:
                queryset = queryset.filter(enseignant=user)

        serializer = SeanceSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
