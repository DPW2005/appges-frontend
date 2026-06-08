import { useState } from 'react'
import {
    Search, Eye, FileText, ChevronLeft, ChevronRight,
    X, Check, Settings, User, GraduationCap, Clock,
    BookOpen, AlertCircle
} from 'lucide-react'

// ── Données mock ─────────────────────────────────────────────

const TARIFS_DEFAUT = {
    Licence: 2000,
    Master: 2500,
    Doctorat: 3500,
    Professeur: 5000,
}

const ENSEIGNANTS_MOCK = [
    {
        id: 1,
        nom: 'Dr. Paul Mbarga',
        grade: 'Doctorat',
        filiere: 'Informatique',
        ues: [
            { code: 'INFO301', intitule: 'Algorithmique avancée', heures: 45 },
            { code: 'INFO402', intitule: 'Projet tutoré', heures: 50 },
        ],
    },
    {
        id: 2,
        nom: 'Mme Claire Ateba',
        grade: 'Master',
        filiere: 'Informatique',
        ues: [
            { code: 'INFO101', intitule: 'Introduction à la prog.', heures: 45 },
            { code: 'INFO102', intitule: 'Mathématiques L1', heures: 45 },
        ],
    },
    {
        id: 3,
        nom: 'M. Serge Nkomo',
        grade: 'Licence',
        filiere: 'Informatique',
        ues: [
            { code: 'INFO302', intitule: 'Bases de données', heures: 30 },
        ],
    },
    {
        id: 4,
        nom: 'Dr. Hélène Owona',
        grade: 'Doctorat',
        filiere: 'Informatique',
        ues: [
            { code: 'INFO401', intitule: 'Réseaux informatiques', heures: 30 },
        ],
    },
    {
        id: 5,
        nom: 'Dr. René Ondoa',
        grade: 'Doctorat',
        filiere: 'Informatique',
        ues: [
            { code: 'INFO303', intitule: "Systèmes d'exploitation", heures: 30 },
        ],
    },
    {
        id: 6,
        nom: 'Mme Sophie Biya',
        grade: 'Master',
        filiere: 'Informatique',
        ues: [
            { code: 'INFO103', intitule: 'Anglais technique', heures: 20 },
        ],
    },
    {
        id: 7,
        nom: 'M. Bertrand Foe',
        grade: 'Master',
        filiere: 'Gestion',
        ues: [
            { code: 'GEST201', intitule: 'Comptabilité générale', heures: 45 },
        ],
    },
    {
        id: 8,
        nom: 'Mme Nadine Essama',
        grade: 'Professeur',
        filiere: 'Gestion',
        ues: [
            { code: 'GEST301', intitule: "Finance d'entreprise", heures: 45 },
        ],
    },
    {
        id: 9,
        nom: 'Dr. Jules Minkang',
        grade: 'Doctorat',
        filiere: 'Comptabilité',
        ues: [
            { code: 'COMPT201', intitule: 'Droit des affaires', heures: 30 },
        ],
    },
    {
        id: 10,
        nom: 'M. Alain Nguema',
        grade: 'Licence',
        filiere: 'Comptabilité',
        ues: [
            { code: 'COMPT101', intitule: 'Fiscalité de base', heures: 30 },
        ],
    },
]

const FILIERES = ['Toutes', 'Informatique', 'Gestion', 'Comptabilité']
const GRADES = ['Tous', 'Licence', 'Master', 'Doctorat', 'Professeur']
const SEMESTRES = ['S1', 'S2']
const STATUTS = ['Tous', 'en attente', 'générée']
const PAGE_SIZE = 7

const formatFCFA = (n) =>
    new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

// ── Badge grade ──────────────────────────────────────────────

const gradeStyle = {
    Licence: 'bg-slate-100 text-slate-600',
    Master: 'bg-blue-100 text-blue-700',
    Doctorat: 'bg-violet-100 text-violet-700',
    Professeur: 'bg-amber-100 text-amber-700',
}

// ── Modal Détails ────────────────────────────────────────────

function ModalDetail({ enseignant, tarifs, onClose }) {
    const prixH = tarifs[enseignant.grade]
    const totalHeures = enseignant.ues.reduce((s, u) => s + u.heures, 0)
    const totalMontant = totalHeures * prixH

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                            <User className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">{enseignant.nom}</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${gradeStyle[enseignant.grade]}`}>
                                {enseignant.grade}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tarif */}
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <p className="text-sm text-slate-600">
                        Prix horaire :
                        <span className="font-bold text-slate-800 ml-1">{formatFCFA(prixH)}/h</span>
                    </p>
                </div>

                {/* Tableau des UEs */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <th className="text-left px-6 py-3 font-semibold">Unité d'enseignement</th>
                                <th className="text-center px-4 py-3 font-semibold">Heures</th>
                                <th className="text-right px-6 py-3 font-semibold">Montant</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {enseignant.ues.map((ue) => (
                                <tr key={ue.code} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3">
                                        <p className="font-medium text-slate-800">{ue.intitule}</p>
                                        <p className="text-xs text-slate-400 font-mono">{ue.code}</p>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                            {ue.heures}h
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right font-medium text-slate-700">
                                        {formatFCFA(ue.heures * prixH)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-slate-200 bg-slate-50">
                                <td className="px-6 py-3 text-sm font-bold text-slate-800">TOTAL</td>
                                <td className="px-4 py-3 text-center">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                        {totalHeures}h
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-right text-sm font-bold text-slate-800">
                                    {formatFCFA(totalMontant)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="px-6 py-4">
                    <button onClick={onClose}
                        className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 transition-colors">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Modal Tarifs (Super Admin uniquement) ────────────────────

function ModalTarifs({ tarifs, onSave, onClose }) {
    const [form, setForm] = useState({ ...tarifs })

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-slate-400" />
                        <h2 className="text-base font-semibold text-slate-800">Grille tarifaire</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-500">
                        Définissez le prix horaire par grade. Ces tarifs s'appliquent à tous les enseignants.
                    </p>
                    {Object.keys(form).map((grade) => (
                        <div key={grade} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 w-32">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${gradeStyle[grade]}`}>
                                    {grade}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    type="number"
                                    min={0}
                                    step={100}
                                    value={form[grade]}
                                    onChange={e => setForm({ ...form, [grade]: Number(e.target.value) })}
                                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 text-right focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                                />
                                <span className="text-xs text-slate-400 shrink-0">FCFA/h</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 px-6 pb-5">
                    <button
                        onClick={() => onSave(form)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                    >
                        <Check className="h-4 w-4" /> Enregistrer
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

// ── Composant principal ──────────────────────────────────────

export default function FacturesLayout({ config }) {
    const {
        peutModifierTarifs = false,
        accent = {},
    } = config

    const [tarifs, setTarifs] = useState(TARIFS_DEFAUT)
    const [semestre, setSemestre] = useState('S1')
    const [search, setSearch] = useState('')
    const [filtreFiliere, setFiltreFiliere] = useState('Toutes')
    const [filtreGrade, setFiltreGrade] = useState('Tous')
    const [filtreStatut, setFiltreStatut] = useState('Tous')
    const [page, setPage] = useState(1)
    const [statuts, setStatuts] = useState(
        () => Object.fromEntries(ENSEIGNANTS_MOCK.map(e => [e.id, 'en attente']))
    )
    const [modalDetail, setModalDetail] = useState(null)
    const [modalTarifs, setModalTarifs] = useState(false)

    // Filtrage
    const filtered = ENSEIGNANTS_MOCK.filter(e => {
        const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase())
        const matchFiliere = filtreFiliere === 'Toutes' || e.filiere === filtreFiliere
        const matchGrade = filtreGrade === 'Tous' || e.grade === filtreGrade
        const matchStatut = filtreStatut === 'Tous' || statuts[e.id] === filtreStatut
        return matchSearch && matchFiliere && matchGrade && matchStatut
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    function totalHeures(e) { return e.ues.reduce((s, u) => s + u.heures, 0) }
    function montantTotal(e) { return totalHeures(e) * tarifs[e.grade] }

    function handleGenerer(id) {
        setStatuts(s => ({ ...s, [id]: 'générée' }))
    }

    return (
        <div className="p-6 space-y-5">

            {/* En-tête */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Factures enseignants</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Honoraires calculés sur la base des séances validées
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {peutModifierTarifs && (
                        <button
                            onClick={() => setModalTarifs(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors shadow-sm"
                        >
                            <Settings className="h-4 w-4 text-slate-400" />
                            Grille tarifaire
                        </button>
                    )}
                </div>
            </div>

            {/* Résumé tarifaire */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(tarifs).map(([grade, prix]) => (
                    <div key={grade} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${gradeStyle[grade]} border-current/20 bg-opacity-50`}>
                        <span>{grade}</span>
                        <span className="font-bold">{formatFCFA(prix)}/h</span>
                    </div>
                ))}
            </div>

            {/* Sélecteur semestre */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
                {SEMESTRES.map(s => (
                    <button
                        key={s}
                        onClick={() => { setSemestre(s); setPage(1) }}
                        className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all ${semestre === s
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Rechercher un enseignant…"
                        className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-slate-400"
                    />
                </div>
                <select value={filtreFiliere} onChange={e => { setFiltreFiliere(e.target.value); setPage(1) }}
                    className="text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                    {FILIERES.map(f => <option key={f}>{f}</option>)}
                </select>
                <select value={filtreGrade} onChange={e => { setFiltreGrade(e.target.value); setPage(1) }}
                    className="text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                </select>
                <select value={filtreStatut} onChange={e => { setFiltreStatut(e.target.value); setPage(1) }}
                    className="text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                    {STATUTS.map(s => <option key={s}>{s}</option>)}
                </select>
            </div>

            {/* Compteur */}
            <p className="text-xs text-slate-400">
                {filtered.length} enseignant{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
            </p>

            {/* Tableau */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <th className="text-left px-5 py-3 font-semibold">Enseignant</th>
                                <th className="text-center px-4 py-3 font-semibold">Grade</th>
                                <th className="text-left px-4 py-3 font-semibold">Filière</th>
                                <th className="text-center px-4 py-3 font-semibold">UEs</th>
                                <th className="text-center px-4 py-3 font-semibold">Heures validées</th>
                                <th className="text-center px-4 py-3 font-semibold">Prix/h</th>
                                <th className="text-right px-5 py-3 font-semibold">Montant total</th>
                                <th className="text-center px-4 py-3 font-semibold">Statut</th>
                                <th className="text-center px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                                        Aucun enseignant trouvé
                                    </td>
                                </tr>
                            ) : paginated.map(e => (
                                <tr key={e.id} className="hover:bg-slate-50 transition-colors">

                                    {/* Nom */}
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-slate-800">{e.nom}</p>
                                        <p className="text-xs text-slate-400">{e.filiere}</p>
                                    </td>

                                    {/* Grade */}
                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${gradeStyle[e.grade]}`}>
                                            {e.grade}
                                        </span>
                                    </td>

                                    {/* Filière */}
                                    <td className="px-4 py-3 text-slate-600 text-sm">{e.filiere}</td>

                                    {/* Nb UEs */}
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                            {e.ues.length}
                                        </span>
                                    </td>

                                    {/* Heures */}
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                                            {totalHeures(e)}h
                                        </span>
                                    </td>

                                    {/* Prix/h */}
                                    <td className="px-4 py-3 text-center text-sm text-slate-600">
                                        {formatFCFA(tarifs[e.grade])}
                                    </td>

                                    {/* Montant */}
                                    <td className="px-5 py-3 text-right font-bold text-slate-800">
                                        {formatFCFA(montantTotal(e))}
                                    </td>

                                    {/* Statut */}
                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statuts[e.id] === 'générée'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {statuts[e.id]}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => setModalDetail(e)}
                                                title="Voir le détail"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {statuts[e.id] === 'en attente' && (
                                                <button
                                                    onClick={() => handleGenerer(e.id)}
                                                    title="Générer la facture"
                                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-xs font-medium transition-colors ${accent.btn ?? 'bg-emerald-600 hover:bg-emerald-700'
                                                        }`}
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    Générer
                                                </button>
                                            )}
                                            {statuts[e.id] === 'générée' && (
                                                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium px-2">
                                                    <Check className="h-3.5 w-3.5" />
                                                    Générée
                                                </span>
                                            )}
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
                        <p className="text-xs text-slate-400">Page {page} sur {totalPages}</p>
                        <div className="flex gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {modalDetail && (
                <ModalDetail
                    enseignant={modalDetail}
                    tarifs={tarifs}
                    onClose={() => setModalDetail(null)}
                />
            )}
            {modalTarifs && (
                <ModalTarifs
                    tarifs={tarifs}
                    onSave={(t) => { setTarifs(t); setModalTarifs(false) }}
                    onClose={() => setModalTarifs(false)}
                />
            )}

        </div>
    )
}