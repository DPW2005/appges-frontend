# APPGES — Application de Gestion des Enseignements
## Backend Django · DRF · Python

---

## 📋 Prérequis

- Python 3.10+
- Git

---

## 🚀 Installation & Démarrage (dev)

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd appges
```

### 2. Créer l'environnement virtuel
```bash
python3 -m venv venv
```

### 3. Activer le venv
```bash
# Linux / macOS
source venv/bin/activate

# Windows (PowerShell)
venv\Scripts\Activate.ps1

# Windows (cmd)
venv\Scripts\activate.bat
```

> Tu devrais voir `(venv)` apparaître dans ton terminal.

### 4. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 5. Configurer l'environnement
```bash
cp .env.example .env
# Édite .env avec tes propres valeurs
```

### 6. Appliquer les migrations
```bash
python manage.py migrate
```

### 7. Créer un super-administrateur
```bash
python manage.py createsuperuser
# Renseigne : matricule, email, mot de passe
```

### 8. Lancer le serveur de développement
```bash
python manage.py runserver
```

→ Backend : http://localhost:8000
→ Admin Django : http://localhost:8000/admin/
→ Swagger API : http://localhost:8000/api/docs/

---

## 🗂️ Structure du projet

```
appges/
├── config/              # Configuration Django (settings, urls, wsgi)
├── core/                # Modèle Utilisateur, Filière, Classe, Tarifs, 2FA, Logs
├── enseignements/       # UE, Séances, Salles, Planning
├── facturation/         # Factures, Lignes de facture
├── notes/               # Notes, Évaluations, Bulletins
├── media/               # Uploads (photos, avatars)
├── logs/                # Journaux horodatés
├── venv/                # Environnement virtuel (non versionné)
├── .env                 # Variables d'environnement (non versionné)
├── .env.example         # Template .env à copier
├── requirements.txt     # Dépendances (versions minimales)
└── requirements_lock.txt # Versions figées (pip freeze)
```

---

## 👥 Rôles utilisateurs

| Rôle | Accès |
|------|-------|
| `SUPER_ADMIN` | Tout + gestion des tarifs + journaux |
| `GESTIONNAIRE` | CRUD complet, validation séances, factures, bulletins |
| `CHEF_FILIERE` | Lecture filière + saisie notes en cas d'absence enseignant |
| `ENSEIGNANT` | Planning, saisie notes de ses UE |
| `ETUDIANT` | Lecture seule (notes, bulletin, profil) |

---

## 🔐 Authentification

- **JWT** via `djangorestframework-simplejwt`
- **2FA par email** : code OTP à 6 chiffres, valable 10 min
- **RBAC** : chaque endpoint vérifie le rôle via permissions DRF

### Endpoints JWT
```
POST /api/token/          → Obtenir access + refresh token
POST /api/token/refresh/  → Rafraîchir le token
```

---

## 📊 Modèle de données — Résumé

### core
- `Utilisateur` — Auth custom (matricule + email + password)
- `TarifNiveau` — Prix/heure par niveau enseignant (configurable super admin)
- `Filiere` — Filières avec chef de filière
- `Classe` — Classes rattachées à une filière
- `ProfilEnseignant` — Niveau, spécialité, IBAN
- `ProfilEtudiant` — Classe, date naissance, redoublant
- `JournalAction` — Audit trail horodaté

### enseignements
- `UniteEnseignement` — Code, volume horaire, chargé de cours + chargé de TD
- `Salle` — Salles avec type et capacité
- `Seance` — Séances planifiées/validées, montant calculé automatiquement

### facturation
- `Facture` — Facture trimestrielle par enseignant
- `LigneFacture` — Détail séance par séance

### notes
- `EvaluationUE` — CC, partiel, examen avec pondération
- `Note` — Note individuelle par étudiant et évaluation
- `Bulletin` — Moyenne générale, rang, mention, publication

---

## 📧 2FA — Fonctionnement

1. L'utilisateur active la 2FA dans son profil
2. À chaque connexion, un code OTP à 6 chiffres est envoyé à son email
3. Le code expire après 10 minutes (`OTP_CODE_EXPIRY_MINUTES` dans settings)
4. L'email est envoyé en HTML (compatible MJML compilé) avec fallback texte brut

> **Note** : L'intégration MJML/Nodemailer est à réaliser côté Node.js pour le microservice email, ou via un template HTML dans `templates/emails/`.

---

## 🌍 Internationalisation

- Langue par défaut : **Français**
- Fuseau horaire : `Africa/Douala`
- Prêt pour i18n (`gettext_lazy` sur tous les libellés)

---

## 🔄 Passage en production (PostgreSQL)

Dans `.env`, remplacer :
```
DATABASE_URL=postgres://user:password@localhost:5432/appges_db
```

Puis dans `settings.py`, remplacer le bloc `DATABASES` par :
```python
import dj_database_url
DATABASES = {'default': dj_database_url.config(default=config('DATABASE_URL'))}
```

Installer : `pip install dj-database-url psycopg2-binary`

---

## 🧪 Tests

```bash
python manage.py test
```

---

*Document généré — APPGES v1.0 — Juin 2026*
