"""
APPGES — Modèles du module enseignements
Contient : UE, ResponsableUE, Salle, Séance, PlanningSéance
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from core.models import Classe, Filiere, Utilisateur, Role, TypeSeance, Semestre


class UniteEnseignement(models.Model):
    """UE — peut avoir un chargé de cours ET un chargé de TD (extensible TP)."""

    code            = models.CharField(max_length=20, unique=True, verbose_name=_('Code UE'))
    intitule        = models.CharField(max_length=200, verbose_name=_('Intitulé'))
    credits         = models.PositiveSmallIntegerField(default=3, verbose_name=_('Crédits ECTS'))
    volume_cours    = models.DecimalField(max_digits=5, decimal_places=1, default=0,
                                          verbose_name=_('Volume horaire Cours (h)'))
    volume_td       = models.DecimalField(max_digits=5, decimal_places=1, default=0,
                                          verbose_name=_('Volume horaire TD (h)'))
    volume_tp       = models.DecimalField(max_digits=5, decimal_places=1, default=0,
                                          verbose_name=_('Volume horaire TP (h)'))
    coefficient     = models.DecimalField(max_digits=4, decimal_places=2, default=1,
                                          verbose_name=_('Coefficient'))
    semestre        = models.CharField(max_length=2, choices=Semestre.choices,
                                       verbose_name=_('Semestre'))
    filiere         = models.ForeignKey(Filiere, on_delete=models.CASCADE,
                                        related_name='ues', verbose_name=_('Filière'))
    classes         = models.ManyToManyField(Classe, related_name='ues',
                                             verbose_name=_('Classes concernées'))
    description     = models.TextField(blank=True, verbose_name=_('Description'))

    # Responsables pédagogiques
    charge_cours    = models.ForeignKey(
        Utilisateur, null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='ues_cours',
        limit_choices_to={'role': Role.ENSEIGNANT},
        verbose_name=_('Chargé de cours')
    )
    charge_td       = models.ForeignKey(
        Utilisateur, null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='ues_td',
        limit_choices_to={'role': Role.ENSEIGNANT},
        verbose_name=_('Chargé de TD/TP')
    )

    # Pondérations pour le calcul des notes
    poids_cc        = models.DecimalField(max_digits=5, decimal_places=2, default=40,
                                          verbose_name=_('Poids Contrôle Continu (%)'))
    poids_exam      = models.DecimalField(max_digits=5, decimal_places=2, default=60,
                                          verbose_name=_('Poids Examen Final (%)'))

    class Meta:
        verbose_name = _("Unité d'enseignement")
        verbose_name_plural = _("Unités d'enseignement")
        ordering = ['filiere', 'semestre', 'code']

    def __str__(self):
        return f'{self.code} — {self.intitule}'


class Salle(models.Model):
    nom         = models.CharField(max_length=50, unique=True, verbose_name=_('Nom / N°'))
    capacite    = models.PositiveSmallIntegerField(verbose_name=_('Capacité'))
    type_salle  = models.CharField(max_length=20, verbose_name=_('Type'),
                                   choices=[
                                       ('AMPHI', _('Amphithéâtre')),
                                       ('SALLE', _('Salle de cours')),
                                       ('LABO',  _('Laboratoire / Salle TP')),
                                   ])
    batiment    = models.CharField(max_length=50, blank=True, verbose_name=_('Bâtiment'))
    equipements = models.TextField(blank=True, verbose_name=_('Équipements'))

    class Meta:
        verbose_name = _('Salle')
        verbose_name_plural = _('Salles')
        ordering = ['nom']

    def __str__(self):
        return f'{self.nom} (cap. {self.capacite})'


class Seance(models.Model):
    """Représente une séance planifiée ou passée."""

    ue              = models.ForeignKey(UniteEnseignement, on_delete=models.CASCADE,
                                        related_name='seances', verbose_name=_('UE'))
    enseignant      = models.ForeignKey(
        Utilisateur, on_delete=models.CASCADE,
        related_name='seances',
        limit_choices_to={'role': Role.ENSEIGNANT},
        verbose_name=_('Enseignant')
    )
    classe          = models.ForeignKey(Classe, on_delete=models.CASCADE,
                                        related_name='seances', verbose_name=_('Classe'))
    salle           = models.ForeignKey(Salle, null=True, blank=True,
                                        on_delete=models.SET_NULL,
                                        related_name='seances', verbose_name=_('Salle'))
    type_seance     = models.CharField(max_length=10, choices=TypeSeance.choices,
                                       verbose_name=_('Type de séance'))
    date_heure_debut = models.DateTimeField(verbose_name=_('Début'))
    date_heure_fin   = models.DateTimeField(verbose_name=_('Fin'))
    duree_heures     = models.DecimalField(max_digits=4, decimal_places=2,
                                           verbose_name=_('Durée (h)'), editable=False,
                                           default=0)

    # Validation par le gestionnaire
    est_validee     = models.BooleanField(default=False, verbose_name=_('Validée'))
    validee_par     = models.ForeignKey(
        Utilisateur, null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='seances_validees',
        verbose_name=_('Validée par')
    )
    date_validation = models.DateTimeField(null=True, blank=True,
                                           verbose_name=_('Date de validation'))
    observations    = models.TextField(blank=True, verbose_name=_('Observations'))

    class Meta:
        verbose_name = _('Séance')
        verbose_name_plural = _('Séances')
        ordering = ['-date_heure_debut']

    def __str__(self):
        return (f'{self.ue.code} | {self.get_type_seance_display()} | '
                f'{self.date_heure_debut:%d/%m/%Y %H:%M} — {self.enseignant}')

    def save(self, *args, **kwargs):
        if self.date_heure_debut and self.date_heure_fin:
            delta = self.date_heure_fin - self.date_heure_debut
            self.duree_heures = round(delta.total_seconds() / 3600, 2)
        super().save(*args, **kwargs)

    @property
    def montant_brut(self):
        """Montant calculé avant validation de facture."""
        profil = getattr(self.enseignant, 'profil_enseignant', None)
        if not profil:
            return 0
        return float(profil.get_tarif(self.type_seance)) * float(self.duree_heures)
