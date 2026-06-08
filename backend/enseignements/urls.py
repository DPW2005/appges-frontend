from django.urls import path, include
from rest_framework.routers import DefaultRouter
from enseignements.views import (
    UniteEnseignementViewSet, SalleViewSet, SeanceViewSet, PlanningView
)

router = DefaultRouter()
router.register(r'ues', UniteEnseignementViewSet, basename='ue')
router.register(r'salles', SalleViewSet, basename='salle')
router.register(r'seances', SeanceViewSet, basename='seance')

urlpatterns = [
    path('planning/', PlanningView.as_view(), name='planning'),
    path('', include(router.urls)),
]
