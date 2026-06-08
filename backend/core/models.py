"""
APPGES — Modèles du module core
Contient : Utilisateur, Filière, Classe, UE, Enseignant, Étudiant, Tarification, 2FA
"""

import uuid
import os
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


# ─────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────

def photo_profil_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'photos/{instance.matricule}.{ext}'


def generer_avatar_svg(initiales: str, couleur: str = '#1a73e8') -> str:
    """Retourne un SVG inline simple pour l'avatar par défaut."""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">'
        f'<circle cx="40" cy="40" r="40" fill="{couleur}"/>'
        f'<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" '
        f'font-size="28" fill="white" font-family="sans-serif">{initiales}</text>'
        f'</svg>'
    )


# ─────────────────────────────────────────────────────────────
# Choix / Enums
# ─────────────────────────────────────────────────────────────

class Role(models.TextChoices):
    SUPER_ADMIN   = 'SUPER_ADMIN',   _('Super Administrateur')
    GESTIONNAIRE  = 'GESTIONNAIRE',  _('Gestionnaire / Scolarité')
    CHEF_FILIERE  = 'CHEF_FILIERE',  _('Chef de Filière')
    ENSEIGNANT    = 'ENSEIGNANT',    _('Enseignant')
    ETUDIANT      = 'ETUDIANT',      _('Étudiant')


class NiveauEnseignant(models.TextChoices):
    DUT        = 'DUT',        _('DUT / BTS')
    LICENCE    = 'LICENCE',    _('Licence')
    MASTER     = 'MASTER',     _('Master')
    DOCTORAT   = 'DOCTORAT',   _('Doctorat')
    PROFESSEUR = 'PROFESSEUR', _('Professeur')


class TypeSeance(models.TextChoices):
    COURS = 'COURS', _('Cours magistral')
    TD    = 'TD',    _('Travaux dirigés')
    TP    = 'TP',    _('Travaux pratiques')


class Semestre(models.TextChoices):
    S1 = 'S1', _('Semestre 1')
    S2 = 'S2', _('Semestre 2')


class Trimestre(models.TextChoices):
    T1 = 'T1', _('Trimestre 1')
    T2 = 'T2', _('Trimestre 2')
    T3 = 'T3', _('Trimestre 3')


# ─────────────────────────────────────────────────────────────
# Manager Utilisateur
# ─────────────────────────────────────────────────────────────

class UtilisateurManager(BaseUserManager):

    def create_user(self, matricule, email, password=None, **extra):
        if not matricule:
            raise ValueError(_('Le matricule est obligatoire.'))
        if not email:
            raise ValueError(_("L'email est obligatoire."))
        email = self.normalize_email(email)
        user = self.model(matricule=matricule, email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, matricule, email, password=None, **extra):
        extra.setdefault('role', Role.SUPER_ADMIN)
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        return self.create_user(matricule, email, password, **extra)


# ─────────────────────────────────────────────────────────────
# Modèle Utilisateur (AUTH_USER_MODEL)
# ─────────────────────────────────────────────────────────────

class Utilisateur(AbstractBaseUser, PermissionsMixin):
    matricule   = models.CharField(max_length=20, unique=True, verbose_name=_('Matricule'))
    email       = models.EmailField(unique=True, verbose_name=_('Email'))
    nom         = models.CharField(max_length=100, verbose_name=_('Nom'))
    prenom      = models.CharField(max_length=100, verbose_name=_('Prénom'))
    role        = models.CharField(max_length=20, choices=Role.choices, default=Role.ETUDIANT)
    photo       = models.ImageField(upload_to=photo_profil_path, null=True, blank=True,
                                    verbose_name=_('Photo de profil'))
    telephone   = models.CharField(max_length=20, blank=True, verbose_name=_('Téléphone'))

    is_active   = models.BooleanField(default=True, verbose_name=_('Actif'))
    is_staff    = models.BooleanField(default=False, verbose_name=_('Staff'))
    is_suspended = models.BooleanField(default=False, verbose_name=_('Suspendu'))
    motif_suspension = models.TextField(blank=True, verbose_name=_('Motif de suspension'))

    # 2FA via email
    otp_secret   = models.CharField(max_length=64, blank=True, verbose_name=_('Secret OTP'))
    otp_code     = models.CharField(max_length=6, blank=True, verbose_name=_('Code OTP'))
    otp_created_at = models.DateTimeField(null=True, blank=True, verbose_name=_('OTP créé le'))
    is_2fa_enabled = models.BooleanField(default=False, verbose_name=_('2FA activée'))

    date_joined = models.DateTimeField(default=timezone.now, verbose_name=_('Date d\'inscription'))
    last_login  = models.DateTimeField(null=True, blank=True, verbose_name=_('Dernière connexion'))

    objects = UtilisateurManager()

    USERNAME_FIELD  = 'matricule'
    REQUIRED_FIELDS = ['email', 'nom', 'prenom']

    class Meta:
        verbose_name = _('Utilisateur')
        verbose_name_plural = _('Utilisateurs')
        ordering = ['nom', 'prenom']

    def __str__(self):
        return f'{self.nom} {self.prenom} ({self.matricule})'

    @property
    def nom_complet(self):
        return f'{self.prenom} {self.nom}'

    @property
    def initiales(self):
        return f'{self.prenom[0]}{self.nom[0]}'.upper() if self.prenom and self.nom else 'XX'

    def get_avatar_svg(self):
        return generer_avatar_svg(self.initiales)

    def est_otp_valide(self, code: str) -> bool:
        from django.conf import settings
        if not self.otp_code or not self.otp_created_at:
            return False
        expiry = getattr(settings, 'OTP_CODE_EXPIRY_MINUTES', 10)
        delta = timezone.now() - self.otp_created_at
        return self.otp_code == code and delta.total_seconds() < expiry * 60


# ─────────────────────────────────────────────────────────────
# Tarification par niveau enseignant (configurable Super Admin)
# ─────────────────────────────────────────────────────────────

class TarifNiveau(models.Model):
    """Prix unitaire par heure de cours/TD/TP selon le niveau de l'enseignant."""
    niveau          = models.CharField(max_length=20, choices=NiveauEnseignant.choices,
                                       unique=True, verbose_name=_('Niveau'))
    tarif_cours     = models.DecimalField(max_digits=10, decimal_places=2,
                                          verbose_name=_('Tarif Cours magistral (FCFA/h)'))
    tarif_td        = models.DecimalField(max_digits=10, decimal_places=2,
                                          verbose_name=_('Tarif TD (FCFA/h)'))
    tarif_tp        = models.DecimalField(max_digits=10, decimal_places=2,
                                          verbose_name=_('Tarif TP (FCFA/h)'))
    date_maj        = models.DateTimeField(auto_now=True, verbose_name=_('Mise à jour'))
    modifie_par     = models.ForeignKey(Utilisateur, null=True, blank=True,
                                        on_delete=models.SET_NULL,
                                        related_name='tarifs_modifies',
                                        verbose_name=_('Modifié par'))

    class Meta:
        verbose_name = _('Tarif par niveau')
        verbose_name_plural = _('Tarifs par niveau')
        ordering = ['niveau']

    def __str__(self):
        return f'{self.get_niveau_display()} — Cours:{self.tarif_cours} / TD:{self.tarif_td} / TP:{self.tarif_tp}'


# ─────────────────────────────────────────────────────────────
# Filière & Classe
# ─────────────────────────────────────────────────────────────

class Filiere(models.Model):
    code        = models.CharField(max_length=10, unique=True, verbose_name=_('Code'))
    libelle     = models.CharField(max_length=100, verbose_name=_('Libellé'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    chef        = models.ForeignKey(
        Utilisateur, null=True, blank=True,
        on_delete=models.SET_NULL,
        limit_choices_to={'role': Role.CHEF_FILIERE},
        related_name='filieres_dirigees',
        verbose_name=_('Chef de filière')
    )
    annee_academique = models.CharField(max_length=9, verbose_name=_('Année académique'),
                                        help_text='Ex: 2025-2026')

    class Meta:
        verbose_name = _('Filière')
        verbose_name_plural = _('Filières')
        ordering = ['code']

    def __str__(self):
        return f'{self.code} — {self.libelle}'


class Classe(models.Model):
    filiere     = models.ForeignKey(Filiere, on_delete=models.CASCADE,
                                    related_name='classes', verbose_name=_('Filière'))
    libelle     = models.CharField(max_length=50, verbose_name=_('Libellé'),
                                   help_text='Ex: L1 Info A')
    niveau      = models.CharField(max_length=20, verbose_name=_('Niveau académique'),
                                   help_text='Ex: L1, L2, M1…')
    semestre    = models.CharField(max_length=2, choices=Semestre.choices,
                                   verbose_name=_('Semestre'))
    effectif_max = models.PositiveSmallIntegerField(default=50,
                                                    verbose_name=_('Effectif maximum'))

    class Meta:
        verbose_name = _('Classe')
        verbose_name_plural = _('Classes')
        ordering = ['filiere', 'libelle']
        unique_together = [['filiere', 'libelle', 'semestre']]

    def __str__(self):
        return f'{self.libelle} ({self.filiere.code})'


# ─────────────────────────────────────────────────────────────
# Profils étendus : Enseignant & Étudiant
# ─────────────────────────────────────────────────────────────

class ProfilEnseignant(models.Model):
    utilisateur     = models.OneToOneField(
        Utilisateur, on_delete=models.CASCADE,
        related_name='profil_enseignant',
        limit_choices_to={'role': Role.ENSEIGNANT},
        verbose_name=_('Utilisateur')
    )
    niveau          = models.CharField(max_length=20, choices=NiveauEnseignant.choices,
                                       verbose_name=_('Niveau / Grade'))
    specialite      = models.CharField(max_length=150, blank=True,
                                       verbose_name=_('Spécialité'))
    diplome         = models.CharField(max_length=200, blank=True,
                                       verbose_name=_('Diplôme le plus élevé'))
    iban            = models.CharField(max_length=34, blank=True,
                                       verbose_name=_('IBAN / Compte bancaire'))
    date_embauche   = models.DateField(null=True, blank=True,
                                       verbose_name=_("Date d'embauche"))

    class Meta:
        verbose_name = _('Profil Enseignant')
        verbose_name_plural = _('Profils Enseignants')

    def __str__(self):
        return f'{self.utilisateur} — {self.get_niveau_display()}'

    def get_tarif(self, type_seance: str):
        """Retourne le tarif horaire selon le niveau et le type de séance."""
        try:
            tarif = TarifNiveau.objects.get(niveau=self.niveau)
            mapping = {
                TypeSeance.COURS: tarif.tarif_cours,
                TypeSeance.TD:    tarif.tarif_td,
                TypeSeance.TP:    tarif.tarif_tp,
            }
            return mapping.get(type_seance, tarif.tarif_cours)
        except TarifNiveau.DoesNotExist:
            return 0


class ProfilEtudiant(models.Model):
    utilisateur     = models.OneToOneField(
        Utilisateur, on_delete=models.CASCADE,
        related_name='profil_etudiant',
        limit_choices_to={'role': Role.ETUDIANT},
        verbose_name=_('Utilisateur')
    )
    classe          = models.ForeignKey(Classe, on_delete=models.SET_NULL,
                                        null=True, blank=True,
                                        related_name='etudiants',
                                        verbose_name=_('Classe'))
    date_naissance  = models.DateField(null=True, blank=True,
                                       verbose_name=_('Date de naissance'))
    lieu_naissance  = models.CharField(max_length=100, blank=True,
                                       verbose_name=_('Lieu de naissance'))
    redoublant      = models.BooleanField(default=False, verbose_name=_('Redoublant'))

    class Meta:
        verbose_name = _('Profil Étudiant')
        verbose_name_plural = _('Profils Étudiants')

    def __str__(self):
        return f'{self.utilisateur} — {self.classe}'


# ─────────────────────────────────────────────────────────────
# Journal des actions système
# ─────────────────────────────────────────────────────────────

class JournalAction(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, null=True, on_delete=models.SET_NULL,
                                    related_name='actions', verbose_name=_('Utilisateur'))
    action      = models.CharField(max_length=255, verbose_name=_('Action'))
    details     = models.TextField(blank=True, verbose_name=_('Détails'))
    adresse_ip  = models.GenericIPAddressField(null=True, blank=True,
                                               verbose_name=_('Adresse IP'))
    horodatage  = models.DateTimeField(auto_now_add=True, verbose_name=_('Horodatage'))

    class Meta:
        verbose_name = _("Journal d'action")
        verbose_name_plural = _("Journal des actions")
        ordering = ['-horodatage']

    def __str__(self):
        return f'[{self.horodatage:%Y-%m-%d %H:%M}] {self.utilisateur} — {self.action}'
