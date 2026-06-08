# 🤖 Script de Brief — Pour assistant IA développeur APPGES

> Fournis ce document à tout assistant IA pour lui donner le contexte complet du projet.
> Il devra lire ce fichier EN PREMIER avant d'écrire la moindre ligne de code.

---

## Contexte du projet

Tu travailles sur **APPGES** (Application de Gestion des Enseignements), un ERP scolaire pour un institut de formation de taille intermédiaire basé au Cameroun.

**Stack technique :**
- Backend : Python 3.12, Django 5+, Django REST Framework, JWT (simplejwt)
- Frontend : React + TailwindCSS (projet séparé)
- BDD dev : SQLite → BDD prod : PostgreSQL
- Génération PDF : côté serveur (reportlab ou weasyprint)
- Email/2FA : SMTP (configurable), templates HTML

---

## Structure existante (NE PAS RECRÉER)

Le projet est déjà initialisé avec la structure suivante :
```
config/          → settings.py, urls.py
core/            → models.py, admin.py  [Utilisateur, Filière, Classe, Tarifs, Journal]
enseignements/   → models.py, admin.py  [UE, Salle, Séance]
facturation/     → models.py, admin.py  [Facture, LigneFacture]
notes/           → models.py, admin.py  [EvaluationUE, Note, Bulletin]
```

Les migrations initiales ont été appliquées. Le superuser `SADM001` existe.

---

## Modèles clés à connaître

### Utilisateur (AUTH_USER_MODEL = 'core.Utilisateur')
- Authentification par `matricule` (pas username)
- Champs : `matricule`, `email`, `nom`, `prenom`, `role`, `photo`, `telephone`
- 2FA email : `is_2fa_enabled`, `otp_code`, `otp_created_at`
- Photo profil uploadable → sinon avatar SVG généré automatiquement via `get_avatar_svg()`
- Rôles : `SUPER_ADMIN`, `GESTIONNAIRE`, `CHEF_FILIERE`, `ENSEIGNANT`, `ETUDIANT`

### TarifNiveau
- Prix horaire configurable par le Super Admin uniquement
- Par niveau (`DUT`, `LICENCE`, `MASTER`, `DOCTORAT`, `PROFESSEUR`)
- Trois colonnes : `tarif_cours`, `tarif_td`, `tarif_tp`

### UniteEnseignement (UE)
- Deux responsables distincts : `charge_cours` et `charge_td` (deux FK vers Utilisateur)
- Volumes horaires séparés : `volume_cours`, `volume_td`, `volume_tp`
- Pondérations notes : `poids_cc`, `poids_exam`

### Seance
- `montant_brut` est une property calculée (non stockée) : `duree_heures × tarif du niveau`
- `duree_heures` est auto-calculé dans `save()` depuis début/fin
- La validation se fait par le gestionnaire (`est_validee`, `validee_par`, `date_validation`)

---

## Règles absolues à respecter

1. **Jamais de `username`** — l'auth se fait par `matricule`
2. **RBAC strict** — chaque vue DRF doit avoir une permission class adaptée au rôle
3. **Tarifs = Super Admin only** — `TarifNiveauAdmin` a `has_change_permission` limité
4. **Journaliser** les actions sensibles dans `JournalAction` (suspension, validation, génération facture)
5. **Double validation des données** — côté serializer DRF ET côté front React
6. **2FA** — si `is_2fa_enabled=True`, bloquer le JWT final tant que l'OTP email n'est pas validé
7. **Photo profil** — si `photo` est null, utiliser `get_avatar_svg()` (retourne un SVG inline)
8. **Conflits de salle/enseignant** — détecter les chevauchements dans la création de séance

---

## Tâches encore à réaliser (dans l'ordre de priorité)

### Phase 1 — API REST (core)
- [ ] `core/serializers.py` — Serializers pour Utilisateur, Filière, Classe, TarifNiveau
- [ ] `core/views.py` — ViewSets avec permissions RBAC
- [ ] `core/urls.py` — Router DRF
- [ ] `core/permissions.py` — Classes de permission par rôle
- [ ] Endpoint 2FA : `POST /api/auth/login/` → si 2FA active, retourner un token partiel
- [ ] Endpoint 2FA : `POST /api/auth/verify-otp/` → valider le code, retourner le JWT final
- [ ] Endpoint photo profil : `PATCH /api/utilisateurs/{id}/photo/`

### Phase 2 — API REST (enseignements)
- [ ] `enseignements/serializers.py`
- [ ] `enseignements/views.py` — Détection des conflits dans CreateSeance
- [ ] `enseignements/urls.py`
- [ ] Endpoint planning : `GET /api/enseignements/planning/?classe=X&semaine=YYYY-WW`

### Phase 3 — API REST (facturation)
- [ ] `facturation/serializers.py`
- [ ] `facturation/views.py` — Action `generer_facture` qui agrège les séances validées
- [ ] `facturation/urls.py`
- [ ] Génération PDF facture : `GET /api/facturation/{id}/pdf/`

### Phase 4 — API REST (notes)
- [ ] `notes/serializers.py`
- [ ] `notes/views.py` — Calcul automatique moyenne + rang + mention dans `save()`
- [ ] `notes/urls.py`
- [ ] Génération PDF bulletin : `GET /api/notes/bulletins/{id}/pdf/`

### Phase 5 — Seeders & Tests
- [ ] `core/management/commands/seed_demo.py` — Données cohérentes (filières, classes, enseignants, étudiants)
- [ ] Tests unitaires modèles
- [ ] Tests d'intégration endpoints
- [ ] Tests end-to-end scénarios clés

### Phase 6 — PDF & Email
- [ ] Template email HTML 2FA (compatible MJML compilé + fallback texte)
- [ ] Template PDF facture (PDFKit ou WeasyPrint)
- [ ] Template PDF bulletin individuel
- [ ] Template PDF PV de délibération (par filière)

---

## Conventions de code

- **Langue des commentaires** : Français
- **Langue du code** : Anglais (noms de variables, fonctions)
- **Serializers** : toujours utiliser `read_only_fields` pour les champs calculés
- **Permissions** : créer une permission class par rôle dans `core/permissions.py`
- **Logging** : utiliser `import logging; logger = logging.getLogger(__name__)` dans chaque view
- **Tests** : nommer les méthodes `test_<role>_can/cannot_<action>()`

---

## Exemple de permission class à utiliser

```python
# core/permissions.py
from rest_framework.permissions import BasePermission
from core.models import Role

class EstGestionnaire(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            Role.GESTIONNAIRE, Role.SUPER_ADMIN
        ]

class EstSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == Role.SUPER_ADMIN
```

---

## Variables d'environnement disponibles

Voir `.env.example` — les clés importantes :
- `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`
- `DATABASE_URL` (SQLite en dev, PostgreSQL en prod)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`
- `OTP_CODE_EXPIRY_MINUTES` (défaut : 10)

---

*Brief généré — APPGES v1.0 — Juin 2026*
