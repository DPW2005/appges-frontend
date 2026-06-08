from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    UtilisateurViewSet, TarifNiveauViewSet, 
    FiliereViewSet, ClasseViewSet,
    LoginView, VerifyOTPView
)

router = DefaultRouter()
router.register(r'utilisateurs', UtilisateurViewSet, basename='utilisateur')
router.register(r'tarifs', TarifNiveauViewSet, basename='tarif')
router.register(r'filieres', FiliereViewSet, basename='filiere')
router.register(r'classes', ClasseViewSet, basename='classe')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='auth-verify-otp'),
    path('', include(router.urls)),
]
