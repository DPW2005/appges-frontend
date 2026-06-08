from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import EvaluationUE, Note, Bulletin


class NoteInline(admin.TabularInline):
    model = Note
    extra = 0
    fields = ('etudiant', 'valeur', 'absent', 'observations')
    readonly_fields = ('date_saisie',)


@admin.register(EvaluationUE)
class EvaluationUEAdmin(admin.ModelAdmin):
    list_display  = ('ue', 'libelle', 'poids', 'note_max', 'trimestre', 'annee')
    list_filter   = ('trimestre', 'annee', 'ue__filiere')
    search_fields = ('libelle', 'ue__code')
    inlines       = [NoteInline]


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display  = ('etudiant', 'evaluation', 'valeur', 'absent', 'saisie_par', 'date_saisie')
    list_filter   = ('evaluation__trimestre', 'evaluation__annee', 'absent')
    search_fields = ('etudiant__nom', 'etudiant__matricule', 'evaluation__ue__code')
    readonly_fields = ('date_saisie', 'date_modif', 'saisie_par')

    def save_model(self, request, obj, form, change):
        obj.saisie_par = request.user
        super().save_model(request, obj, form, change)


@admin.register(Bulletin)
class BulletinAdmin(admin.ModelAdmin):
    list_display  = ('etudiant', 'classe', 'trimestre', 'annee',
                      'moyenne_generale', 'rang', 'mention', 'publie')
    list_filter   = ('trimestre', 'annee', 'publie', 'mention')
    search_fields = ('etudiant__nom', 'etudiant__matricule')
    actions       = ['publier_bulletins']

    def publier_bulletins(self, request, queryset):
        queryset.update(publie=True)
        self.message_user(request, f'{queryset.count()} bulletin(s) publié(s).')
    publier_bulletins.short_description = _('Publier les bulletins sélectionnés')
