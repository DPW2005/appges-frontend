from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from core.models import Utilisateur, Role, TarifNiveau, NiveauEnseignant

class TarifNiveauPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.super_admin = Utilisateur.objects.create_superuser('SADM', 'sadm@appges.com', 'pass')
        self.gestionnaire = Utilisateur.objects.create_user('GEST', 'gest@appges.com', 'pass', role=Role.GESTIONNAIRE)
        self.enseignant = Utilisateur.objects.create_user('ENS', 'ens@appges.com', 'pass', role=Role.ENSEIGNANT)
        
        self.tarif = TarifNiveau.objects.create(niveau=NiveauEnseignant.LICENCE, tarif_cours=5000, tarif_td=4000, tarif_tp=3500)

    def test_superadmin_can_update_tarif(self):
        self.client.force_authenticate(user=self.super_admin)
        response = self.client.patch(f'/api/core/tarifs/{self.tarif.id}/', {'tarif_cours': 6000})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_gestionnaire_cannot_update_tarif(self):
        self.client.force_authenticate(user=self.gestionnaire)
        response = self.client.patch(f'/api/core/tarifs/{self.tarif.id}/', {'tarif_cours': 6000})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_enseignant_can_read_tarifs(self):
        self.client.force_authenticate(user=self.enseignant)
        response = self.client.get('/api/core/tarifs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
