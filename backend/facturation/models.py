"""
APPGES — Modèles du module facturation
Contient : Facture, LigneFacture
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from core.models import Utilisateur, Role, Trimestre
from enseignements.models import Seance


class Facture(models.Model):

    class StatutFacture(models.TextChoices):
        BROUILLON   = 'BROUILLON',  _('Brouillon')
        EMISE       = 'EMISE',      _('Émise')
        PAYEE       = 'PAYEE',      _('Payée')
        ANNULEE     = 'ANNULEE',    _('Annulée')

    reference       = models.CharField(max_length=30, unique=True,
                                       verbose_name=_('Référence'))
    enseignant      = models.ForeignKey(
        Utilisateur, on_delete=models.CASCADE,
        related_name='factures',
        limit_choices_to={'role': Role.ENSEIGNANT},
        verbose_name=_('Enseignant')
    )
    trimestre       = models.CharField(max_length=2, choices=Trimestre.choices,
                                       verbose_name=_('Trimestre'))
    annee           = models.PositiveSmallIntegerField(verbose_name=_('Année'))
    date_emission   = models.DateField(auto_now_add=True, verbose_name=_("Date d'émission"))
    date_paiement   = models.DateField(null=True, blank=True,
                                       verbose_name=_('Date de paiement'))
    statut          = models.CharField(max_length=12, choices=StatutFacture.choices,
                                       default=StatutFacture.BROUILLON,
                                       verbose_name=_('Statut'))
    montant_total   = models.DecimalField(max_digits=12, decimal_places=2, default=0,
                                          verbose_name=_('Montant total (FCFA)'))
    observations    = models.TextField(blank=True, verbose_name=_('Observations'))
    generee_par     = models.ForeignKey(
        Utilisateur, null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='factures_generees',
        verbose_name=_('Générée par')
    )

    class Meta:
        verbose_name = _('Facture')
        verbose_name_plural = _('Factures')
        ordering = ['-annee', '-trimestre', 'enseignant']
        unique_together = [['enseignant', 'trimestre', 'annee']]

    def __str__(self):
        return f'{self.reference} — {self.enseignant} ({self.trimestre}/{self.annee})'

    def calculer_total(self):
        total = sum(l.montant for l in self.lignes.all())
        self.montant_total = total
        self.save(update_fields=['montant_total'])
        return total


class LigneFacture(models.Model):
    facture         = models.ForeignKey(Facture, on_delete=models.CASCADE,
                                        related_name='lignes', verbose_name=_('Facture'))
    seance          = models.ForeignKey(Seance, null=True, blank=True,
                                        on_delete=models.SET_NULL,
                                        related_name='lignes_facture',
                                        verbose_name=_('Séance'))
    description     = models.CharField(max_length=255, verbose_name=_('Description'))
    type_seance     = models.CharField(max_length=10, verbose_name=_('Type'))
    duree_heures    = models.DecimalField(max_digits=5, decimal_places=2,
                                          verbose_name=_('Heures'))
    tarif_horaire   = models.DecimalField(max_digits=10, decimal_places=2,
                                          verbose_name=_('Tarif/h (FCFA)'))
    montant         = models.DecimalField(max_digits=12, decimal_places=2,
                                          verbose_name=_('Montant (FCFA)'))

    class Meta:
        verbose_name = _('Ligne de facture')
        verbose_name_plural = _('Lignes de facture')

    def __str__(self):
        return f'{self.description} — {self.montant} FCFA'

    def save(self, *args, **kwargs):
        self.montant = self.duree_heures * self.tarif_horaire
        super().save(*args, **kwargs)
