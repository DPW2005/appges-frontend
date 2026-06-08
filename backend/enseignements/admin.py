from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import UniteEnseignement, Salle, Seance


@admin.register(UniteEnseignement)
class UEAdmin(admin.ModelAdmin):
    list_display  = ('code', 'intitule', 'filiere', 'semestre', 'credits',
                      'charge_cours', 'charge_td', 'coefficient')
    list_filter   = ('filiere', 'semestre')
    search_fields = ('code', 'intitule')
    filter_horizontal = ('classes',)
    fieldsets = (
        (_('Identification'), {'fields': ('code', 'intitule', 'filiere', 'semestre',
                                           'credits', 'coefficient', 'description')}),
        (_('Volumes horaires'), {'fields': ('volume_cours', 'volume_td', 'volume_tp')}),
        (_('Responsables'), {'fields': ('charge_cours', 'charge_td')}),
        (_('Pondérations notes'), {'fields': ('poids_cc', 'poids_exam')}),
        (_('Classes'), {'fields': ('classes',)}),
    )


@admin.register(Salle)
class SalleAdmin(admin.ModelAdmin):
    list_display  = ('nom', 'type_salle', 'capacite', 'batiment')
    list_filter   = ('type_salle', 'batiment')
    search_fields = ('nom',)


@admin.register(Seance)
class SeanceAdmin(admin.ModelAdmin):
    list_display  = ('ue', 'type_seance', 'enseignant', 'classe', 'salle',
                      'date_heure_debut', 'duree_heures', 'est_validee')
    list_filter   = ('est_validee', 'type_seance', 'ue__filiere')
    search_fields = ('ue__code', 'enseignant__nom', 'classe__libelle')
    readonly_fields = ('duree_heures',)
    date_hierarchy = 'date_heure_debut'

    actions = ['valider_seances']

    def valider_seances(self, request, queryset):
        from django.utils import timezone
        queryset.update(est_validee=True, validee_par=request.user,
                        date_validation=timezone.now())
        self.message_user(request, f'{queryset.count()} séance(s) validée(s).')
    valider_seances.short_description = _('Valider les séances sélectionnées')
