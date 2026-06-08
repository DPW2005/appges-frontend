from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import Utilisateur, Role, Filiere, Classe, TarifNiveau, NiveauEnseignant, Semestre
from enseignements.models import UniteEnseignement, Salle

class Command(BaseCommand):
    help = 'Peuple la base de données avec des données de démonstration'

    def handle(self, *args, **kwargs):
        self.stdout.write('Création des données de démo...')

        # Tarifs
        t1, _ = TarifNiveau.objects.get_or_create(niveau=NiveauEnseignant.LICENCE, defaults={'tarif_cours': 5000, 'tarif_td': 3500, 'tarif_tp': 3000})
        t2, _ = TarifNiveau.objects.get_or_create(niveau=NiveauEnseignant.DOCTORAT, defaults={'tarif_cours': 7000, 'tarif_td': 5000, 'tarif_tp': 4000})

        # Utilisateurs
        admin, _ = Utilisateur.objects.get_or_create(
            matricule='SADM002', defaults={'email': 'admin@appges.com', 'nom': 'Admin', 'prenom': 'Super', 'role': Role.SUPER_ADMIN}
        )
        if _: admin.set_password('password123'); admin.save()

        gest, _ = Utilisateur.objects.get_or_create(
            matricule='GEST001', defaults={'email': 'gest@appges.com', 'nom': 'Gest', 'prenom': 'Scolarite', 'role': Role.GESTIONNAIRE}
        )
        if _: gest.set_password('password123'); gest.save()

        ens, _ = Utilisateur.objects.get_or_create(
            matricule='ENS001', defaults={'email': 'ens@appges.com', 'nom': 'Dupont', 'prenom': 'Jean', 'role': Role.ENSEIGNANT}
        )
        if _: ens.set_password('password123'); ens.save()

        etu, _ = Utilisateur.objects.get_or_create(
            matricule='ETU001', defaults={'email': 'etu@appges.com', 'nom': 'Martin', 'prenom': 'Paul', 'role': Role.ETUDIANT}
        )
        if _: etu.set_password('password123'); etu.save()

        # Filière & Classe
        filiere, _ = Filiere.objects.get_or_create(code='INFO', defaults={'libelle': 'Informatique', 'annee_academique': '2025-2026'})
        classe, _ = Classe.objects.get_or_create(filiere=filiere, libelle='L1 Info A', defaults={'niveau': 'L1', 'semestre': Semestre.S1})

        # Salle
        salle, _ = Salle.objects.get_or_create(nom='A101', defaults={'capacite': 50, 'type_salle': 'SALLE'})

        # UE
        ue, _ = UniteEnseignement.objects.get_or_create(
            code='INF101', defaults={
                'intitule': 'Algorithmique 1', 'credits': 4, 'semestre': Semestre.S1,
                'filiere': filiere, 'charge_cours': ens
            }
        )
        ue.classes.add(classe)

        self.stdout.write(self.style.SUCCESS('Données de démo générées avec succès !'))
