import logging
import random
from django.utils import timezone
from django.core.mail import send_mail
from rest_framework import viewsets, status, generics, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter, OpenApiTypes

from core.models import Utilisateur, Filiere, Classe, TarifNiveau, JournalAction, Role
from core.serializers import (
    UtilisateurSerializer, FiliereSerializer, ClasseSerializer, 
    TarifNiveauSerializer, LoginSerializer, VerifyOTPSerializer
)
from core.permissions import EstSuperAdmin, EstGestionnaire

logger = logging.getLogger(__name__)

# --- Helpers ---
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh['role'] = user.role
    refresh['matricule'] = user.matricule
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def send_otp_email(user):
    otp = str(random.randint(100000, 999999))
    user.otp_code = otp
    user.otp_created_at = timezone.now()
    user.save(update_fields=['otp_code', 'otp_created_at'])

    send_mail(
        subject="Votre code de vérification APPGES",
        message=f"Bonjour {user.prenom},\n\nVotre code de vérification est : {otp}\nCe code est valide pour une courte durée.\n\nCordialement,\nL'équipe APPGES",
        from_email=None, # Will use DEFAULT_FROM_EMAIL
        recipient_list=[user.email],
        fail_silently=False,
    )
    logger.info(f"OTP envoyé pour l'utilisateur {user.matricule}")


# --- Authentication Views ---
class LoginView(views.APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=LoginSerializer,
        responses={
            200: OpenApiTypes.OBJECT,
            401: OpenApiResponse(description="Identifiants incorrects ou compte suspendu.")
        },
        summary="Connexion et gestion de la 2FA",
        description="Authentifie l'utilisateur via matricule et mot de passe. Si la 2FA est activée pour l'utilisateur, envoie un code OTP par email et demande une vérification."
    )
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        if user.is_2fa_enabled:
            send_otp_email(user)
            return Response({
                'requires_2fa': True,
                'matricule': user.matricule,
                'message': 'Un code de vérification a été envoyé à votre adresse email.'
            }, status=status.HTTP_200_OK)

        tokens = get_tokens_for_user(user)
        return Response(tokens, status=status.HTTP_200_OK)


class VerifyOTPView(views.APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=VerifyOTPSerializer,
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiResponse(description="Code OTP invalide ou expiré.")
        },
        summary="Validation de l'OTP 2FA",
        description="Valide le code OTP envoyé par email et retourne les tokens JWT finaux si le code est correct."
    )
    def post(self, request, *args, **kwargs):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Clear OTP after successful validation
        user.otp_code = ''
        user.save(update_fields=['otp_code'])

        tokens = get_tokens_for_user(user)
        return Response(tokens, status=status.HTTP_200_OK)


# --- ViewSets ---

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAuthenticated] # Ajuster avec des classes custom si besoin
    filterset_fields = ['role', 'is_active', 'is_suspended']
    search_fields = ['nom', 'prenom', 'matricule', 'email']
    ordering_fields = ['nom', 'date_joined']

    def get_permissions(self):
        if self.action in ['create', 'destroy', 'suspendre']:
            return [EstGestionnaire()]
        return super().get_permissions()

    @extend_schema(
        request=None,
        responses={200: UtilisateurSerializer},
        summary="Suspendre un utilisateur",
        description="Suspend l'accès d'un utilisateur au système. Requiert les droits de Gestionnaire ou Super Admin."
    )
    @action(detail=True, methods=['post'])
    def suspendre(self, request, pk=None):
        utilisateur = self.get_object()
        if not utilisateur.is_suspended:
            utilisateur.is_suspended = True
            motif = request.data.get('motif', 'Non spécifié')
            utilisateur.motif_suspension = motif
            utilisateur.save()
            
            JournalAction.objects.create(
                utilisateur=request.user,
                action=f"Suspension de l'utilisateur {utilisateur.matricule}",
                details=f"Motif: {motif}"
            )
            logger.info(f"Utilisateur {utilisateur.matricule} suspendu par {request.user.matricule}")
            return Response({'status': 'Utilisateur suspendu'}, status=status.HTTP_200_OK)
        return Response({'status': 'Utilisateur déjà suspendu'}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=OpenApiTypes.BINARY, # Fichier binaire pour la photo
        responses={200: UtilisateurSerializer},
        summary="Mettre à jour la photo de profil",
        description="Permet à l'utilisateur de modifier sa propre photo de profil."
    )
    @action(detail=True, methods=['patch'], parser_classes=[MultiPartParser, FormParser])
    def photo(self, request, pk=None):
        utilisateur = self.get_object()
        # Seul l'utilisateur concerné ou un admin peut modifier la photo
        if request.user != utilisateur and request.user.role not in [Role.SUPER_ADMIN, Role.GESTIONNAIRE]:
            return Response({'detail': 'Permission refusée.'}, status=status.HTTP_403_FORBIDDEN)
            
        if 'photo' not in request.data:
            return Response({'detail': 'Aucun fichier fourni.'}, status=status.HTTP_400_BAD_REQUEST)
            
        utilisateur.photo = request.data['photo']
        utilisateur.save()
        serializer = self.get_serializer(utilisateur)
        return Response(serializer.data)


class TarifNiveauViewSet(viewsets.ModelViewSet):
    queryset = TarifNiveau.objects.all()
    serializer_class = TarifNiveauSerializer
    
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [EstSuperAdmin()]
        return [IsAuthenticated()] # Tout utilisateur authentifié peut lire les tarifs

    def perform_create(self, serializer):
        serializer.save(modifie_par=self.request.user)
        JournalAction.objects.create(
            utilisateur=self.request.user,
            action="Création d'un tarif de niveau",
            details=f"Niveau: {serializer.validated_data.get('niveau')}"
        )

    def perform_update(self, serializer):
        serializer.save(modifie_par=self.request.user)
        JournalAction.objects.create(
            utilisateur=self.request.user,
            action="Mise à jour d'un tarif de niveau",
            details=f"Niveau: {serializer.instance.niveau}"
        )


class FiliereViewSet(viewsets.ModelViewSet):
    queryset = Filiere.objects.all()
    serializer_class = FiliereSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['code', 'libelle']


class ClasseViewSet(viewsets.ModelViewSet):
    queryset = Classe.objects.all()
    serializer_class = ClasseSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['filiere', 'semestre', 'niveau']
    search_fields = ['libelle']
