import { useState, useMemo } from 'react'
import {
    Search, UserPlus, RefreshCw, Users,
    Edit2, Trash2, ToggleRight, X, Check
} from 'lucide-react'

// ─── Données & constantes ────────────────────────────────────────────────────

const ROLES_LIST = ['Super Admin', 'Gestionnaire', 'Chef Département', 'Enseignant', 'Étudiant']
const FILIERES = ['Informatique', 'Gestion', 'Comptabilité']
const NIVEAUX = ['L1', 'L2', 'L3']
const STATUTS = ['actif', 'inactif', 'suspendu']

const ROLE_STYLES = {
    'Super Admin': 'bg-violet-100 text-violet-800',
    'Gestionnaire': 'bg-emerald-100 text-emerald-800',
    'Chef Département': 'bg-sky-100 text-sky-800',
    'Enseignant': 'bg-amber-100 text-amber-800',
    'Étudiant': 'bg-pink-100 text-pink-800',
}
const ROLE_TAB_ACTIVE = {
    'Super Admin': 'bg-violet-700 text-white border-violet-700',
    'Gestionnaire': 'bg-emerald-700 text-white border-emerald-700',
    'Chef Département': 'bg-sky-700 text-white border-sky-700',
    'Enseignant': 'bg-amber-600 text-white border-amber-600',
    'Étudiant': 'bg-pink-700 text-white border-pink-700',
}
const STATUT_STYLES = {
    'actif': 'bg-emerald-100 text-emerald-800',
    'inactif': 'bg-slate-100 text-slate-500',
    'suspendu': 'bg-rose-100 text-rose-800',
}
const AVATAR_PALETTES = [
    ['bg-violet-100', 'text-violet-800'],
    ['bg-emerald-100', 'text-emerald-800'],
    ['bg-sky-100', 'text-sky-800'],
    ['bg-amber-100', 'text-amber-800'],
    ['bg-pink-100', 'text-pink-800'],
]

const STATUT_NEXT = { actif: 'inactif', inactif: 'actif', suspendu: 'actif' }

function pad(n) { return String(n).padStart(2, '0') }
function todayISO() {
    const d = new Date()
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const USERS_MOCK = [
    { id: 1, nom: 'Amadou Bello', email: 'a.bello@univ.cm', role: 'Super Admin', filiere: '—', niveau: '—', statut: 'actif', dateCreation: '2023-09-01' },
    { id: 2, nom: 'Fatou Diallo', email: 'f.diallo@univ.cm', role: 'Super Admin', filiere: '—', niveau: '—', statut: 'actif', dateCreation: '2023-09-01' },
    { id: 3, nom: 'Claire Ateba', email: 'c.ateba@univ.cm', role: 'Gestionnaire', filiere: '—', niveau: '—', statut: 'actif', dateCreation: '2023-09-05' },
    { id: 4, nom: 'Paul Mbarga', email: 'p.mbarga@univ.cm', role: 'Gestionnaire', filiere: '—', niveau: '—', statut: 'actif', dateCreation: '2023-09-05' },
    { id: 5, nom: 'Boris Tchamba', email: 'b.tchamba@univ.cm', role: 'Gestionnaire', filiere: '—', niveau: '—', statut: 'inactif', dateCreation: '2023-09-10' },
    { id: 6, nom: 'Hélène Owona', email: 'h.owona@univ.cm', role: 'Chef Département', filiere: 'Informatique', niveau: '—', statut: 'actif', dateCreation: '2023-09-03' },
    { id: 7, nom: 'Jules Minkang', email: 'j.minkang@univ.cm', role: 'Chef Département', filiere: 'Gestion', niveau: '—', statut: 'actif', dateCreation: '2023-09-03' },
    { id: 8, nom: 'René Ondoa', email: 'r.ondoa@univ.cm', role: 'Enseignant', filiere: 'Informatique', niveau: '—', statut: 'actif', dateCreation: '2023-09-08' },
    { id: 9, nom: 'Serge Nkomo', email: 's.nkomo@univ.cm', role: 'Enseignant', filiere: 'Gestion', niveau: '—', statut: 'actif', dateCreation: '2023-09-08' },
    { id: 10, nom: 'Sophie Biya', email: 's.biya@univ.cm', role: 'Enseignant', filiere: 'Informatique', niveau: '—', statut: 'actif', dateCreation: '2023-09-09' },
    { id: 11, nom: 'Nadine Essama', email: 'n.essama@univ.cm', role: 'Enseignant', filiere: 'Comptabilité', niveau: '—', statut: 'suspendu', dateCreation: '2023-09-09' },
    { id: 12, nom: 'Jean-Pierre Nkomo', email: 'jp.nkomo@etu.univ.cm', role: 'Étudiant', filiere: 'Informatique', niveau: 'L2', statut: 'actif', dateCreation: '2023-10-01' },
    { id: 13, nom: 'Marie Ateba', email: 'm.ateba@etu.univ.cm', role: 'Étudiant', filiere: 'Informatique', niveau: 'L1', statut: 'actif', dateCreation: '2023-10-01' },
    { id: 14, nom: 'Sandrine Foe', email: 's.foe@etu.univ.cm', role: 'Étudiant', filiere: 'Gestion', niveau: 'L2', statut: 'actif', dateCreation: '2023-10-02' },
    { id: 15, nom: 'Hervé Minkang', email: 'h.minkang@etu.univ.cm', role: 'Étudiant', filiere: 'Informatique', niveau: 'L3', statut: 'actif', dateCreation: '2023-10-02' },
    { id: 16, nom: 'Carine Mballa', email: 'c.mballa@etu.univ.cm', role: 'Étudiant', filiere: 'Comptabilité', niveau: 'L1', statut: 'actif', dateCreation: '2023-10-03' },
    { id: 17, nom: 'Alain Biya', email: 'a.biya@etu.univ.cm', role: 'Étudiant', filiere: 'Informatique', niveau: 'L1', statut: 'inactif', dateCreation: '2023-10-03' },
    { id: 18, nom: 'Boris Nguema', email: 'b.nguema@etu.univ.cm', role: 'Étudiant', filiere: 'Gestion', niveau: 'L2', statut: 'actif', dateCreation: '2023-10-04' },
    { id: 19, nom: 'Nadège Essama', email: 'nd.essama@etu.univ.cm', role: 'Étudiant', filiere: 'Comptabilité', niveau: 'L2', statut: 'actif', dateCreation: '2023-10-04' },
    { id: 20, nom: 'Patrick Owona', email: 'p.owona@etu.univ.cm', role: 'Étudiant', filiere: 'Informatique', niveau: 'L3', statut: 'suspendu', dateCreation: '2023-10-05' },
]

const PER_PAGE = 12

// ─── Sous-composants ─────────────────────────────────────────────────────────

function Avatar({ nom }) {
    const [bg, text] = AVATAR_PALETTES[nom.charCodeAt(0) % AVATAR_PALETTES.length]
    const initials = nom.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    return (
        <div className={`h-8 w-8 rounded-full ${bg} ${text} flex items-center justify-center text-xs font-semibold shrink-0 select-none`}>
            {initials}
        </div>
    )
}

function StatCard({ value, label }) {
    return (
        <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-2xl font-semibold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
        </div>
    )
}

function ModalForm({ user = null, onClose, onSave }) {
    const init = user ?? {
        nom: '', email: '', role: 'Étudiant', statut: 'actif', filiere: '—', niveau: '—'
    }
    const [form, setForm] = useState(init)
    const f = (k, v) => setForm(s => ({ ...s, [k]: v }))

    const selectCls = 'w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400'
    const inputCls = 'w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-800">
                        {user ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
                    </h2>
                    <button onClick={onClose}><X className="h-5 w-5 text-slate-400" /></button>
                </div>
                <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Nom complet</label>
                        <input value={form.nom} onChange={e => f('nom', e.target.value)}
                            placeholder="Prénom Nom" className={inputCls} />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Email</label>
                        <input type="email" value={form.email} onChange={e => f('email', e.target.value)}
                            placeholder="prenom.nom@univ.cm" className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-slate-500 block mb-1">Rôle</label>
                            <select value={form.role} onChange={e => f('role', e.target.value)} className={selectCls}>
                                {ROLES_LIST.map(r => <option key={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 block mb-1">Statut</label>
                            <select value={form.statut} onChange={e => f('statut', e.target.value)} className={selectCls}>
                                {STATUTS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-slate-500 block mb-1">Filière</label>
                            <select value={form.filiere} onChange={e => f('filiere', e.target.value)} className={selectCls}>
                                <option>—</option>
                                {FILIERES.map(f => <option key={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 block mb-1">Niveau</label>
                            <select value={form.niveau} onChange={e => f('niveau', e.target.value)} className={selectCls}>
                                <option>—</option>
                                {NIVEAUX.map(n => <option key={n}>{n}</option>)}
                            </select>
                        </div>
                    </div>
                    {!user && (
                        <div>
                            <label className="text-xs font-medium text-slate-500 block mb-1">Mot de passe temporaire</label>
                            <input type="password" placeholder="••••••••" className={inputCls} />
                        </div>
                    )}
                </div>
                <div className="flex gap-2 px-6 pb-5 pt-2">
                    <button onClick={() => onSave(form)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
                        <Check className="h-4 w-4" /> {user ? 'Enregistrer' : 'Créer'}
                    </button>
                    <button onClick={onClose}
                        className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 transition-colors">
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    )
}

function ModalConfirm({ user, onConfirm, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                        <Trash2 className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Supprimer cet utilisateur ?</p>
                        <p className="text-xs text-slate-500 mt-0.5">{user.nom} · {user.role}</p>
                    </div>
                </div>
                <p className="text-xs text-slate-500">
                    Cette action est irréversible. Toutes les données associées seront perdues.
                </p>
                <div className="flex gap-2">
                    <button onClick={onConfirm}
                        className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors">
                        Supprimer
                    </button>
                    <button onClick={onClose}
                        className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 transition-colors">
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function SuperAdminUtilisateurs() {
    const [users, setUsers] = useState(USERS_MOCK)
    const [search, setSearch] = useState('')
    const [activeRole, setActiveRole] = useState('')
    const [filterStat, setFilterStat] = useState('')
    const [filterFil, setFilterFil] = useState('')
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState(null)  // { type:'add'|'edit'|'confirm', data? }
    const [nextId, setNextId] = useState(100)

    const filtered = useMemo(() => {
        return users.filter(u => {
            if (activeRole && u.role !== activeRole) return false
            if (filterStat && u.statut !== filterStat) return false
            if (filterFil && u.filiere !== filterFil) return false
            if (search && !u.nom.toLowerCase().includes(search.toLowerCase())
                && !u.email.toLowerCase().includes(search.toLowerCase())) return false
            return true
        })
    }, [users, activeRole, filterStat, filterFil, search])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    function reset() {
        setSearch(''); setActiveRole(''); setFilterStat(''); setFilterFil(''); setPage(1)
    }

    function handleSave(form) {
        if (modal.type === 'add') {
            setUsers(l => [...l, { ...form, id: nextId, dateCreation: todayISO() }])
            setNextId(n => n + 1)
        } else {
            setUsers(l => l.map(u => u.id === modal.data.id ? { ...u, ...form } : u))
        }
        setModal(null)
    }

    function handleDelete(id) {
        setUsers(l => l.filter(u => u.id !== id))
        setModal(null)
    }

    function toggleStatut(id) {
        setUsers(l => l.map(u =>
            u.id !== id ? u : { ...u, statut: STATUT_NEXT[u.statut] || 'actif' }
        ))
    }

    // Stats
    const counts = ROLES_LIST.reduce((acc, r) => {
        acc[r] = users.filter(u => u.role === r).length; return acc
    }, {})

    const selectCls = 'text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400'

    return (
        <div className="p-6 space-y-5">

            {/* En-tête */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Users className="h-6 w-6 text-violet-500" /> Utilisateurs
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Gestion de tous les comptes de la plateforme</p>
                </div>
                <button onClick={() => setModal({ type: 'add' })}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
                    <UserPlus className="h-4 w-4" /> Ajouter
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                <StatCard value={users.length} label="Total" />
                <StatCard value={counts['Super Admin'] + counts['Gestionnaire']} label="Admins" />
                <StatCard value={counts['Chef Département']} label="Chefs dept." />
                <StatCard value={counts['Enseignant']} label="Enseignants" />
                <StatCard value={counts['Étudiant']} label="Étudiants" />
            </div>

            {/* Onglets rôles */}
            <div className="flex flex-wrap gap-2">
                {[{ key: '', label: 'Tous' }, ...ROLES_LIST.map(r => ({ key: r, label: r }))].map(({ key, label }) => (
                    <button key={key}
                        onClick={() => { setActiveRole(key); setPage(1) }}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeRole === key
                                ? (key ? ROLE_TAB_ACTIVE[key] : 'bg-slate-700 text-white border-slate-700')
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Rechercher par nom, email…"
                        className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400 placeholder:text-slate-400"
                    />
                </div>
                <select value={filterStat} onChange={e => { setFilterStat(e.target.value); setPage(1) }} className={selectCls}>
                    <option value="">Tous les statuts</option>
                    {STATUTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={filterFil} onChange={e => { setFilterFil(e.target.value); setPage(1) }} className={selectCls}>
                    <option value="">Toutes les filières</option>
                    {FILIERES.map(f => <option key={f}>{f}</option>)}
                </select>
                <button onClick={reset}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-500 text-sm hover:bg-slate-50 transition-colors">
                    <RefreshCw className="h-3.5 w-3.5" /> Réinitialiser
                </button>
            </div>

            {/* Compteur */}
            <p className="text-xs text-slate-400">
                {filtered.length} utilisateur{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
            </p>

            {/* Tableau */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <th className="px-5 py-3 w-10"></th>
                                <th className="text-left px-4 py-3 font-semibold">Nom / Email</th>
                                <th className="text-left px-4 py-3 font-semibold w-36">Rôle</th>
                                <th className="text-left px-4 py-3 font-semibold w-40">Filière / Niveau</th>
                                <th className="text-center px-4 py-3 font-semibold w-24">Statut</th>
                                <th className="text-center px-4 py-3 font-semibold w-28">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                                        Aucun utilisateur trouvé
                                    </td>
                                </tr>
                            ) : paginated.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3 w-10">
                                        <Avatar nom={u.nom} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-slate-800">{u.nom}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_STYLES[u.role] || 'bg-slate-100 text-slate-600'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {u.filiere !== '—'
                                            ? `${u.filiere}${u.niveau !== '—' ? ' · ' + u.niveau : ''}`
                                            : <span className="text-slate-300">—</span>
                                        }
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUT_STYLES[u.statut] || ''}`}>
                                            {u.statut}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => setModal({ type: 'edit', data: u })}
                                                title="Modifier"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => toggleStatut(u.id)}
                                                title={`Passer à : ${STATUT_NEXT[u.statut]}`}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                                                <ToggleRight className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => setModal({ type: 'confirm', data: u })}
                                                title="Supprimer"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                        <p className="text-xs text-slate-400">Page {page} sur {totalPages} · {filtered.length} utilisateurs</p>
                        <div className="flex gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors">
                                ‹
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                                return (
                                    <button key={p} onClick={() => setPage(p)}
                                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${page === p ? 'bg-violet-600 text-white' : 'text-slate-500 hover:bg-slate-100'
                                            }`}>
                                        {p}
                                    </button>
                                )
                            })}
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors">
                                ›
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {(modal?.type === 'add' || modal?.type === 'edit') && (
                <ModalForm
                    user={modal.type === 'edit' ? modal.data : null}
                    onClose={() => setModal(null)}
                    onSave={handleSave}
                />
            )}
            {modal?.type === 'confirm' && (
                <ModalConfirm
                    user={modal.data}
                    onConfirm={() => handleDelete(modal.data.id)}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    )
}