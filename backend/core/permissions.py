from rest_framework.permissions import BasePermission
from core.models import Role

class EstSuperAdmin(BasePermission):
    """Accès réservé aux Super Administrateurs uniquement."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == Role.SUPER_ADMIN)


class EstGestionnaire(BasePermission):
    """Accès autorisé aux Gestionnaires et Super Administrateurs."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [Role.GESTIONNAIRE, Role.SUPER_ADMIN])


class EstChefFiliere(BasePermission):
    """Accès autorisé aux Chefs de filière (et rôles supérieurs)."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [Role.CHEF_FILIERE, Role.GESTIONNAIRE, Role.SUPER_ADMIN])


class EstEnseignant(BasePermission):
    """Accès autorisé aux Enseignants (et rôles supérieurs)."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [Role.ENSEIGNANT, Role.CHEF_FILIERE, Role.GESTIONNAIRE, Role.SUPER_ADMIN])


class EstEtudiant(BasePermission):
    """Accès de base pour un étudiant authentifié (et rôles supérieurs)."""
    def has_permission(self, request, view):
        # Puisque tout le monde au-dessus d'étudiant a ce droit, il s'agit juste d'être authentifié
        return bool(request.user and request.user.is_authenticated)
