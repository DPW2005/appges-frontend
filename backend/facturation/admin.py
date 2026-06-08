from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Facture, LigneFacture


class LigneFactureInline(admin.TabularInline):
    model = LigneFacture
    extra = 0
    readonly_fields = ('montant',)
    fields = ('description', 'type_seance', 'duree_heures', 'tarif_horaire', 'montant', 'seance')


@admin.register(Facture)
class FactureAdmin(admin.ModelAdmin):
    list_display  = ('reference', 'enseignant', 'trimestre', 'annee',
                      'montant_total', 'statut', 'date_emission')
    list_filter   = ('statut', 'trimestre', 'annee')
    search_fields = ('reference', 'enseignant__nom', 'enseignant__matricule')
    readonly_fields = ('date_emission', 'generee_par', 'montant_total')
    inlines       = [LigneFactureInline]

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.generee_par = request.user
        super().save_model(request, obj, form, change)
