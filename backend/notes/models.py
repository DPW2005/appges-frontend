"""
APPGES — Modèles du module notes
Contient : Note, EvaluationUE, Bulletin
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from core.models import Utilisateur, Role, Trimestre
from enseignements.models import UniteEnseignement, Classe


class EvaluationUE(models.Model):
    """Paramètre d'une évaluation pour une UE (CC, Exam, partiel…)."""
    ue          = models.ForeignKey(UniteEnseignement, on_delete=models.CASCADE,
                                    related_name='evaluations', verbose_name=_('UE'))
    libelle     = models.CharField(max_length=100, verbose_name=_('Libellé'),
                                   help_text='Ex: CC1, Partiel, Examen Final')
    poids       = models.DecimalField(max_digits=5, decimal_places=2,
                                      verbose_name=_('Pondération (%)'))
    note_max    = models.DecimalField(max_digits=5, decimal_places=2, default=20,
                                      verbose_name=_('Note maximale'))
    trimestre   = models.CharField(max_length=2, choices=Trimestre.choices,
                                   verbose_name=_('Trimestre'))
    annee       = models.PositiveSmallIntegerField(verbose_name=_('Année'))

    class Meta:
        verbose_name = _('Évaluation UE')
        verbose_name_plural = _('Évaluations UE')
        ordering = ['ue', 'trimestre', 'libelle']

    def __str__(self):
        return f'{self.ue.code} — {self.libelle} ({self.poids}%)'


class Note(models.Model):
    etudiant    = models.ForeignKey(
        Utilisateur, on_delete=models.CASCADE,
        related_name='notes',
        limit_choices_to={'role': Role.ETUDIANT},
        verbose_name=_('Étudiant')
    )
    evaluation  = models.ForeignKey(EvaluationUE, on_delete=models.CASCADE,
                                    related_name='notes', verbose_name=_('Évaluation'))
    valeur      = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name=_('Note obtenue')
    )
    absent      = models.BooleanField(default=False, verbose_name=_('Absent / ABS'))
    observations = models.CharField(max_length=200, blank=True,
                                    verbose_name=_('Observations'))
    saisie_par  = models.ForeignKey(
        Utilisateur, null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='notes_saisies',
        verbose_name=_('Saisie par')
    )
    date_saisie = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de saisie'))
    date_modif  = models.DateTimeField(auto_now=True, verbose_name=_('Dernière modification'))

    class Meta:
        verbose_name = _('Note')
        verbose_name_plural = _('Notes')
        unique_together = [['etudiant', 'evaluation']]
        ordering = ['evaluation__ue', 'etudiant']

    def __str__(self):
        val = 'ABS' if self.absent else str(self.valeur)
        return f'{self.etudiant} | {self.evaluation} | {val}'


class Bulletin(models.Model):
    """Bulletin de notes consolidé par étudiant, trimestre et année."""

    class MentionBulletin(models.TextChoices):
        INSUFFISANT     = 'INSUFFISANT', _('Insuffisant')
        PASSABLE        = 'PASSABLE',    _('Passable')
        ASSEZ_BIEN      = 'ASSEZ_BIEN',  _('Assez Bien')
        BIEN            = 'BIEN',        _('Bien')
        TRES_BIEN       = 'TRES_BIEN',   _('Très Bien')
        EXCELLENT       = 'EXCELLENT',   _('Excellent')

    etudiant        = models.ForeignKey(
        Utilisateur, on_delete=models.CASCADE,
        related_name='bulletins',
        limit_choices_to={'role': Role.ETUDIANT},
        verbose_name=_('Étudiant')
    )
    classe          = models.ForeignKey(Classe, on_delete=models.CASCADE,
                                        related_name='bulletins', verbose_name=_('Classe'))
    trimestre       = models.CharField(max_length=2, choices=Trimestre.choices,
                                       verbose_name=_('Trimestre'))
    annee           = models.PositiveSmallIntegerField(verbose_name=_('Année'))
    moyenne_generale = models.DecimalField(max_digits=5, decimal_places=2,
                                            null=True, blank=True,
                                            verbose_name=_('Moyenne générale'))
    rang            = models.PositiveSmallIntegerField(null=True, blank=True,
                                                       verbose_name=_('Rang'))
    mention         = models.CharField(max_length=20, choices=MentionBulletin.choices,
                                       blank=True, verbose_name=_('Mention'))
    appreciations   = models.TextField(blank=True, verbose_name=_('Appréciations'))
    publie          = models.BooleanField(default=False, verbose_name=_('Publié'))
    date_generation = models.DateTimeField(auto_now=True,
                                           verbose_name=_('Date de génération'))

    class Meta:
        verbose_name = _('Bulletin')
        verbose_name_plural = _('Bulletins')
        unique_together = [['etudiant', 'trimestre', 'annee']]
        ordering = ['-annee', '-trimestre', 'rang']

    def __str__(self):
        return f'Bulletin {self.etudiant} — T{self.trimestre}/{self.annee}'

    def calculer_mention(self):
        m = float(self.moyenne_generale or 0)
        if m < 8:    return 'INSUFFISANT'
        if m < 10:   return 'PASSABLE'
        if m < 12:   return 'ASSEZ_BIEN'
        if m < 14:   return 'BIEN'
        if m < 16:   return 'TRES_BIEN'
        return 'EXCELLENT'
