"""
APPGES — Configuration de l'interface d'administration Django
Module : core
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import (
    Utilisateur, TarifNiveau, Filiere, Classe,
    ProfilEnseignant, ProfilEtudiant, JournalAction
)


# ─────────────────────────────────────────────────────────────
# Inlines
# ─────────────────────────────────────────────────────────────

class ProfilEnseignantInline(admin.StackedInline):
    model = ProfilEnseignant
    can_delete = False
    verbose_name_plural = _('Profil Enseignant')
    extra = 0
    fields = ('niveau', 'specialite', 'diplome', 'iban', 'date_embauche')


class ProfilEtudiantInline(admin.StackedInline):
    model = ProfilEtudiant
    can_delete = False
    verbose_name_plural = _('Profil Étudiant')
    extra = 0
    fields = ('classe', 'date_naissance', 'lieu_naissance', 'redoublant')


# ─────────────────────────────────────────────────────────────
# Utilisateur
# ─────────────────────────────────────────────────────────────

@admin.register(Utilisateur)
class UtilisateurAdmin(UserAdmin):
    model = Utilisateur
    list_display  = ('matricule', 'nom_complet', 'email', 'role_badge',
                      'is_active', 'is_suspended', 'is_2fa_enabled', 'apercu_photo')
    list_filter   = ('role', 'is_active', 'is_suspended', 'is_2fa_enabled')
    search_fields = ('matricule', 'nom', 'prenom', 'email')
    ordering      = ('nom', 'prenom')
    readonly_fields = ('date_joined', 'last_login', 'apercu_photo')

    fieldsets = (
        (_('Identifiants'), {
            'fields': ('matricule', 'email', 'password')
        }),
        (_('Informations personnelles'), {
            'fields': ('nom', 'prenom', 'telephone', 'photo', 'apercu_photo')
        }),
        (_('Rôle & Statut'), {
            'fields': ('role', 'is_active', 'is_suspended', 'motif_suspension')
        }),
        (_('2FA'), {
            'fields': ('is_2fa_enabled',),
            'classes': ('collapse',),
        }),
        (_('Permissions'), {
            'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',),
        }),
        (_('Dates importantes'), {
            'fields': ('date_joined', 'last_login'),
            'classes': ('collapse',),
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('matricule', 'email', 'nom', 'prenom',
                       'role', 'password1', 'password2'),
        }),
    )

    def get_inlines(self, request, obj=None):
        if obj is None:
            return []
        from core.models import Role
        if obj.role == Role.ENSEIGNANT:
            return [ProfilEnseignantInline]
        if obj.role == Role.ETUDIANT:
            return [ProfilEtudiantInline]
        return []

    def role_badge(self, obj):
        colors = {
            'SUPER_ADMIN': '#dc2626',
            'GESTIONNAIRE': '#7c3aed',
            'CHEF_FILIERE': '#0284c7',
            'ENSEIGNANT': '#059669',
            'ETUDIANT': '#d97706',
        }
        color = colors.get(obj.role, '#6b7280')
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;'
            'border-radius:9999px;font-size:11px;font-weight:600;">{}</span>',
            color, obj.get_role_display()
        )
    role_badge.short_description = _('Rôle')

    def apercu_photo(self, obj):
        if obj.photo:
            return format_html('<img src="{}" width="60" height="60" '
                               'style="border-radius:50%;object-fit:cover;" />', obj.photo.url)
        return format_html(
            '<div style="width:60px;height:60px;border-radius:50%;'
            'background:#1a73e8;display:flex;align-items:center;'
            'justify-content:center;color:white;font-weight:bold;">{}</div>',
            obj.initiales
        )
    apercu_photo.short_description = _('Avatar')


# ─────────────────────────────────────────────────────────────
# TarifNiveau (Super Admin uniquement)
# ─────────────────────────────────────────────────────────────

@admin.register(TarifNiveau)
class TarifNiveauAdmin(admin.ModelAdmin):
    list_display  = ('get_niveau_display', 'tarif_cours', 'tarif_td', 'tarif_tp', 'date_maj')
    readonly_fields = ('date_maj', 'modifie_par')
    ordering = ('niveau',)

    def save_model(self, request, obj, form, change):
        obj.modifie_par = request.user
        super().save_model(request, obj, form, change)

    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser


# ─────────────────────────────────────────────────────────────
# Filière & Classe
# ─────────────────────────────────────────────────────────────

class ClasseInline(admin.TabularInline):
    model = Classe
    extra = 1
    fields = ('libelle', 'niveau', 'semestre', 'effectif_max')


@admin.register(Filiere)
class FiliereAdmin(admin.ModelAdmin):
    list_display  = ('code', 'libelle', 'chef', 'annee_academique')
    list_filter   = ('annee_academique',)
    search_fields = ('code', 'libelle')
    inlines       = [ClasseInline]


@admin.register(Classe)
class ClasseAdmin(admin.ModelAdmin):
    list_display  = ('libelle', 'filiere', 'niveau', 'semestre', 'effectif_max')
    list_filter   = ('filiere', 'semestre', 'niveau')
    search_fields = ('libelle', 'filiere__code')


# ─────────────────────────────────────────────────────────────
# Journal des actions
# ─────────────────────────────────────────────────────────────

@admin.register(JournalAction)
class JournalActionAdmin(admin.ModelAdmin):
    list_display  = ('horodatage', 'utilisateur', 'action', 'adresse_ip')
    list_filter   = ('horodatage',)
    search_fields = ('action', 'utilisateur__matricule', 'utilisateur__nom')
    readonly_fields = ('utilisateur', 'action', 'details', 'adresse_ip', 'horodatage')
    ordering      = ('-horodatage',)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
