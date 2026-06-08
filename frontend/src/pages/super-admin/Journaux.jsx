import { useState, useMemo } from 'react'
import {
    Search, Download, RefreshCw, History,
    ChevronLeft, ChevronRight, X
} from 'lucide-react'

// ─── Données mock ────────────────────────────────────────────────────────────

const USERS = [
    { nom: 'Amadou Bello', role: 'Super Admin' },
    { nom: 'Claire Ateba', role: 'Gestionnaire' },
    { nom: 'Paul Mbarga', role: 'Gestionnaire' },
    { nom: 'Hélène Owona', role: 'Chef Département' },
    { nom: 'René Ondoa', role: 'Enseignant' },
    { nom: 'Serge Nkomo', role: 'Enseignant' },
    { nom: 'Jean-Pierre Nkomo', role: 'Étudiant' },
    { nom: 'Marie Ateba', role: 'Étudiant' },
    { nom: 'Sandrine Foe', role: 'Étudiant' },
]

const ACTIONS_MAP = {
    'Connexion': ['Connexion au système', 'Ouverture de session', 'Reconnexion après expiration'],
    'Création': ['Création UE INFO301', 'Création créneau Lundi P1', 'Ajout enseignant', 'Création utilisateur'],
    'Modification': ['Modification note J. Nkomo', 'Mise à jour planning S2', 'Modification UE GEST201', 'Changement salle Amphi A'],
    'Suppression': ['Suppression créneau Mercredi P3', 'Suppression UE COMPT301', 'Suppression compte inactif'],
    'Consultation': ['Consultation journal', 'Consultation notes L2', 'Consultation planning', 'Consultation liste UE'],
    'Export': ['Export CSV notes S1', 'Export planning semestre', 'Export liste étudiants'],
    'Saisie de notes': ['Saisie note INFO301 — 15.5/20', 'Saisie note INFO302 — 12.0/20', 'Saisie partielle UE GEST201', 'Validation notes L3'],
}

const MODULE_MAP = {
    'Connexion': 'Authentification', 'Création': 'UE / Cours',
    'Modification': 'Notes', 'Suppression': 'UE / Cours',
    'Consultation': 'Journal', 'Export': 'Journal', 'Saisie de notes': 'Notes',
}

const MODULES = ['Authentification', 'UE / Cours', 'Notes', 'Planning', 'Utilisateurs', 'Journal']
const NATURES = Object.keys(ACTIONS_MAP)
const ROLES = ['Super Admin', 'Gestionnaire', 'Chef Département', 'Enseignant', 'Étudiant']

const BADGE_STYLES = {
    'Connexion': 'bg-sky-100 text-sky-800',
    'Création': 'bg-emerald-100 text-emerald-800',
    'Modification': 'bg-amber-100 text-amber-800',
    'Suppression': 'bg-rose-100 text-rose-800',
    'Consultation': 'bg-violet-100 text-violet-800',
    'Export': 'bg-slate-100 text-slate-600',
    'Saisie de notes': 'bg-cyan-100 text-cyan-800',
}

const AVATAR_PALETTES = [
    ['bg-sky-100', 'text-sky-800'],
    ['bg-emerald-100', 'text-emerald-800'],
    ['bg-violet-100', 'text-violet-800'],
    ['bg-amber-100', 'text-amber-800'],
    ['bg-rose-100', 'text-rose-800'],
    ['bg-cyan-100', 'text-cyan-800'],
]

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function pad(n) { return String(n).padStart(2, '0') }

function fmtDate(d) {
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}
function fmtTime(d) {
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
function isoDate(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function generateLogs() {
    const now = new Date()
    return Array.from({ length: 120 }, (_, i) => {
        const u = rnd(USERS)
        const nature = rnd(NATURES)
        const action = rnd(ACTIONS_MAP[nature])
        const dt = new Date(now - Math.random() * 30 * 24 * 3600 * 1000)
        return {
            id: i + 1,
            date: fmtDate(dt), time: fmtTime(dt), isoDate: isoDate(dt),
            nom: u.nom, role: u.role, nature, action,
            module: MODULE_MAP[nature] || rnd(MODULES),
            ip: `192.168.${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 200) + 10}`,
            userAgent: 'Chrome 124 / Windows 11',
            dt,
        }
    }).sort((a, b) => b.dt - a.dt)
}

const LOGS_MOCK = generateLogs()
const PER_PAGE = 15

// ─── Sous-composants ─────────────────────────────────────────────────────────

function Avatar({ nom }) {
    const palette = AVATAR_PALETTES[nom.charCodeAt(0) % AVATAR_PALETTES.length]
    const initials = nom.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    return (
        <div className={`h-7 w-7 rounded-full ${palette[0]} ${palette[1]} flex items-center justify-center text-xs font-semibold shrink-0 select-none`}>
            {initials}
        </div>
    )
}

function Badge({ nature }) {
    return (
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${BADGE_STYLES[nature] || 'bg-slate-100 text-slate-600'}`}>
            {nature}
        </span>
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

function DetailPanel({ log, onClose }) {
    if (!log) return null
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mt-4">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-800">Détail de l'entrée #{log.id}</p>
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <X className="h-4 w-4" />
                </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                    ['Utilisateur', log.nom],
                    ['Rôle', log.role],
                    ['Date', log.date],
                    ['Heure', log.time],
                    ['Module', log.module],
                    ['Adresse IP', log.ip],
                    ['Nature', null],
                    ['Action', log.action],
                ].map(([label, val]) => (
                    <div key={label}>
                        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                        {label === 'Nature'
                            ? <Badge nature={log.nature} />
                            : <p className="text-sm font-medium text-slate-800">{val}</p>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function SuperAdminJournaux() {
    const [search, setSearch] = useState('')
    const [filterRole, setFilterRole] = useState('')
    const [filterNature, setFilterNature] = useState('')
    const [filterModule, setFilterModule] = useState('')
    const [dateDebut, setDateDebut] = useState('')
    const [dateFin, setDateFin] = useState('')
    const [page, setPage] = useState(1)
    const [selected, setSelected] = useState(null)

    const filtered = useMemo(() => {
        return LOGS_MOCK.filter(l => {
            if (search && !l.nom.toLowerCase().includes(search.toLowerCase())
                && !l.action.toLowerCase().includes(search.toLowerCase())) return false
            if (filterRole && l.role !== filterRole) return false
            if (filterNature && l.nature !== filterNature) return false
            if (filterModule && l.module !== filterModule) return false
            if (dateDebut && l.isoDate < dateDebut) return false
            if (dateFin && l.isoDate > dateFin) return false
            return true
        })
    }, [search, filterRole, filterNature, filterModule, dateDebut, dateFin])

    const todayStr = isoDate(new Date())
    const todayCount = filtered.filter(l => l.isoDate === todayStr).length
    const persons = new Set(filtered.map(l => l.nom)).size
    const topNature = Object.entries(
        filtered.reduce((acc, l) => { acc[l.nature] = (acc[l.nature] || 0) + 1; return acc }, {})
    ).sort((a, b) => b[1] - a[1])[0]

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    function reset() {
        setSearch(''); setFilterRole(''); setFilterNature('')
        setFilterModule(''); setDateDebut(''); setDateFin('')
        setPage(1); setSelected(null)
    }

    function exportCSV() {
        const header = 'Date,Heure,Nom,Rôle,Nature,Module,Action,IP'
        const rows = filtered.map(l =>
            `${l.date},${l.time},"${l.nom}",${l.role},${l.nature},${l.module},"${l.action}",${l.ip}`
        )
        const csv = [header, ...rows].join('\n')
        const a = document.createElement('a')
        a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
        a.download = 'journal_activite.csv'
        a.click()
    }

    const selectCls = 'text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400'
    const inputCls = 'text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400'

    return (
        <div className="p-6 space-y-5">

            {/* En-tête */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <History className="h-6 w-6 text-indigo-500" /> Journal d'activité
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Toutes les actions enregistrées dans le système</p>
                </div>
                <button onClick={exportCSV}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
                    <Download className="h-4 w-4" /> Exporter CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard value={filtered.length} label="Entrées filtrées" />
                <StatCard value={todayCount} label="Aujourd'hui" />
                <StatCard value={persons} label="Utilisateurs actifs" />
                <StatCard value={topNature ? topNature[0] : '—'} label="Action dominante" />
            </div>

            {/* Filtres ligne 1 */}
            <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Rechercher par nom, action…"
                        className={`w-full pl-9 pr-4 py-2 ${inputCls}`}
                    />
                </div>
                <select value={filterRole} onChange={e => { setFilterRole(e.target.value); setPage(1) }} className={selectCls}>
                    <option value="">Tous les rôles</option>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
                <select value={filterNature} onChange={e => { setFilterNature(e.target.value); setPage(1) }} className={selectCls}>
                    <option value="">Toutes les natures</option>
                    {NATURES.map(n => <option key={n}>{n}</option>)}
                </select>
                <select value={filterModule} onChange={e => { setFilterModule(e.target.value); setPage(1) }} className={selectCls}>
                    <option value="">Tous les modules</option>
                    {MODULES.map(m => <option key={m}>{m}</option>)}
                </select>
            </div>

            {/* Filtres ligne 2 — dates */}
            <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-slate-500">Du</label>
                    <input type="date" value={dateDebut}
                        onChange={e => { setDateDebut(e.target.value); setPage(1) }}
                        className={inputCls} />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-slate-500">Au</label>
                    <input type="date" value={dateFin}
                        onChange={e => { setDateFin(e.target.value); setPage(1) }}
                        className={inputCls} />
                </div>
                <button onClick={reset}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-500 text-sm hover:bg-slate-50 transition-colors">
                    <RefreshCw className="h-3.5 w-3.5" /> Réinitialiser
                </button>
            </div>

            {/* Compteur */}
            <p className="text-xs text-slate-400">
                {filtered.length} entrée{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
            </p>

            {/* Tableau */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <th className="text-left px-5 py-3 font-semibold w-36">Date / Heure</th>
                                <th className="text-left px-4 py-3 font-semibold">Personne</th>
                                <th className="text-left px-4 py-3 font-semibold w-36">Nature</th>
                                <th className="text-left px-4 py-3 font-semibold">Détail de la requête</th>
                                <th className="text-center px-4 py-3 font-semibold w-28">Module</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-slate-400 text-sm">
                                        Aucune entrée trouvée
                                    </td>
                                </tr>
                            ) : paginated.map(l => (
                                <tr key={l.id}
                                    onClick={() => setSelected(s => s?.id === l.id ? null : l)}
                                    className={`cursor-pointer transition-colors ${selected?.id === l.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-slate-700 tabular-nums">{l.date}</p>
                                        <p className="text-xs text-slate-400 tabular-nums mt-0.5">{l.time}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Avatar nom={l.nom} />
                                            <div>
                                                <p className="font-medium text-slate-800">{l.nom}</p>
                                                <p className="text-xs text-slate-400">{l.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><Badge nature={l.nature} /></td>
                                    <td className="px-4 py-3 text-slate-600 text-xs leading-relaxed">{l.action}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">
                                            {l.module}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                        <p className="text-xs text-slate-400">
                            Page {page} sur {totalPages} · {filtered.length} entrées
                        </p>
                        <div className="flex gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                                return (
                                    <button key={p} onClick={() => setPage(p)}
                                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${page === p
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-slate-500 hover:bg-slate-100'
                                            }`}>
                                        {p}
                                    </button>
                                )
                            })}
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Panneau détail */}
            {selected && <DetailPanel log={selected} onClose={() => setSelected(null)} />}

        </div>
    )
}