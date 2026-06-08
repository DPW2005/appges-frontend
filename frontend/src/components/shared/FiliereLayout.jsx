import { useState } from 'react'
import {
    Search, Eye, Edit2, Plus, Trash2, X, Check,
    GraduationCap, Users, BookOpen, ChevronDown,
    ChevronRight, User, Hash
} from 'lucide-react'

// ── Données mock ─────────────────────────────────────────────

const CHEFS_MOCK = [
    'Dr. Paul Mbarga',
    'Mme Nadine Essama',
    'Dr. Jules Minkang',
    'Dr. Hélène Owona',
    'M. Bertrand Foe',
]

const FILIERES_INITIAL = [
    {
        id: 1,
        nom: 'Informatique',
        code: 'INFO',
        chefDept: 'Dr. Paul Mbarga',
        statut: 'active',
        nbEtudiants: 87,
        niveaux: ['L1', 'L2', 'L3'],
        ues: {
            L1: {
                S1: [
                    { code: 'INFO101', intitule: 'Introduction à la prog.', coeff: 3, heures: 45 },
                    { code: 'INFO102', intitule: 'Mathématiques L1', coeff: 3, heures: 45 },
                    { code: 'INFO103', intitule: 'Anglais technique', coeff: 1, heures: 20 },
                    { code: 'INFO104', intitule: 'Logique & algorithmique', coeff: 2, heures: 30 },
                ],
                S2: [
                    { code: 'INFO105', intitule: 'Structures de données', coeff: 3, heures: 45 },
                    { code: 'INFO106', intitule: 'Systèmes informatiques', coeff: 2, heures: 30 },
                    { code: 'INFO107', intitule: 'Expression écrite', coeff: 1, heures: 20 },
                ],
            },
            L2: {
                S1: [
                    { code: 'INFO301', intitule: 'Algorithmique avancée', coeff: 3, heures: 45 },
                    { code: 'INFO302', intitule: 'Bases de données', coeff: 2, heures: 30 },
                    { code: 'INFO303', intitule: "Systèmes d'exploitation", coeff: 2, heures: 30 },
                    { code: 'INFO304', intitule: 'Mathématiques L2', coeff: 3, heures: 45 },
                    { code: 'INFO305', intitule: 'Anglais technique', coeff: 1, heures: 20 },
                ],
                S2: [
                    { code: 'INFO306', intitule: 'Réseaux informatiques', coeff: 2, heures: 30 },
                    { code: 'INFO307', intitule: 'Programmation web', coeff: 2, heures: 30 },
                    { code: 'INFO308', intitule: 'Projet tutoré S2', coeff: 4, heures: 60 },
                ],
            },
            L3: {
                S1: [
                    { code: 'INFO401', intitule: 'Réseaux avancés', coeff: 3, heures: 45 },
                    { code: 'INFO402', intitule: 'Sécurité informatique', coeff: 2, heures: 30 },
                    { code: 'INFO403', intitule: 'Génie logiciel', coeff: 3, heures: 45 },
                ],
                S2: [
                    { code: 'INFO404', intitule: 'Projet tutoré', coeff: 6, heures: 90 },
                    { code: 'INFO405', intitule: 'Stage professionnel', coeff: 4, heures: 60 },
                ],
            },
        },
    },
    {
        id: 2,
        nom: 'Gestion',
        code: 'GEST',
        chefDept: 'Mme Nadine Essama',
        statut: 'active',
        nbEtudiants: 74,
        niveaux: ['L1', 'L2', 'L3'],
        ues: {
            L1: {
                S1: [
                    { code: 'GEST101', intitule: 'Introduction à la gestion', coeff: 3, heures: 45 },
                    { code: 'GEST102', intitule: 'Mathématiques financières', coeff: 2, heures: 30 },
                    { code: 'GEST103', intitule: 'Anglais des affaires', coeff: 1, heures: 20 },
                ],
                S2: [
                    { code: 'GEST104', intitule: 'Comptabilité de base', coeff: 3, heures: 45 },
                    { code: 'GEST105', intitule: 'Droit civil', coeff: 2, heures: 30 },
                ],
            },
            L2: {
                S1: [
                    { code: 'GEST201', intitule: 'Comptabilité générale', coeff: 3, heures: 45 },
                    { code: 'GEST202', intitule: "Économie d'entreprise", coeff: 2, heures: 30 },
                ],
                S2: [
                    { code: 'GEST203', intitule: 'Marketing fondamental', coeff: 2, heures: 30 },
                    { code: 'GEST204', intitule: 'Gestion de projet', coeff: 3, heures: 45 },
                ],
            },
            L3: {
                S1: [
                    { code: 'GEST301', intitule: "Finance d'entreprise", coeff: 3, heures: 45 },
                    { code: 'GEST302', intitule: "Stratégie d'entreprise", coeff: 3, heures: 45 },
                ],
                S2: [
                    { code: 'GEST303', intitule: 'Mémoire professionnel', coeff: 6, heures: 90 },
                ],
            },
        },
    },
    {
        id: 3,
        nom: 'Comptabilité',
        code: 'COMPT',
        chefDept: 'Dr. Jules Minkang',
        statut: 'active',
        nbEtudiants: 53,
        niveaux: ['L1', 'L2', 'L3'],
        ues: {
            L1: {
                S1: [
                    { code: 'COMPT101', intitule: 'Fiscalité de base', coeff: 2, heures: 30 },
                    { code: 'COMPT102', intitule: 'Comptabilité générale L1', coeff: 3, heures: 45 },
                ],
                S2: [
                    { code: 'COMPT103', intitule: 'Droit fiscal', coeff: 2, heures: 30 },
                    { code: 'COMPT104', intitule: 'Informatique de gestion', coeff: 2, heures: 30 },
                ],
            },
            L2: {
                S1: [
                    { code: 'COMPT201', intitule: 'Droit des affaires', coeff: 2, heures: 30 },
                    { code: 'COMPT202', intitule: 'Comptabilité analytique', coeff: 3, heures: 45 },
                ],
                S2: [
                    { code: 'COMPT203', intitule: 'Audit comptable', coeff: 3, heures: 45 },
                    { code: 'COMPT204', intitule: 'Fiscalité avancée', coeff: 2, heures: 30 },
                ],
            },
            L3: {
                S1: [
                    { code: 'COMPT301', intitule: 'Consolidation des comptes', coeff: 4, heures: 60 },
                    { code: 'COMPT302', intitule: 'Contrôle de gestion', coeff: 3, heures: 45 },
                ],
                S2: [
                    { code: 'COMPT303', intitule: 'Mémoire professionnel', coeff: 6, heures: 90 },
                ],
            },
        },
    },
]

const NIVEAUX_DISPO = ['L1', 'L2', 'L3', 'M1', 'M2']
const SEMESTRES = ['S1', 'S2']
const PAGE_SIZE = 8

// ── Helpers ──────────────────────────────────────────────────

function totalUEs(filiere) {
    return Object.values(filiere.ues).reduce((sum, niv) =>
        sum + Object.values(niv).reduce((s, sem) => s + sem.length, 0), 0)
}

function totalHeures(filiere) {
    return Object.values(filiere.ues).reduce((sum, niv) =>
        sum + Object.values(niv).reduce((s, sem) =>
            s + sem.reduce((h, ue) => h + ue.heures, 0), 0), 0)
}

// ── Modal Détails ────────────────────────────────────────────

function ModalDetail({ filiere, onClose }) {
    const [niveauOuvert, setNiveauOuvert] = useState(filiere.niveaux[0])
    const [semestre, setSemestre] = useState('S1')

    const ues = filiere.ues[niveauOuvert]?.[semestre] ?? []

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${filiere.statut === 'active' ? 'bg-emerald-100' : 'bg-slate-100'
                            }`}>
                            <GraduationCap className={`h-5 w-5 ${filiere.statut === 'active' ? 'text-emerald-600' : 'text-slate-400'
                                }`} />
                        </div>
                        <div>
                            <p className="text-base font-bold text-slate-800">{filiere.nom}</p>
                            <p className="text-xs text-slate-400 font-mono">{filiere.code}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Infos générales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 shrink-0">
                    {[
                        { icon: User, label: 'Chef de Département', value: filiere.chefDept },
                        { icon: GraduationCap, label: 'Étudiants', value: filiere.nbEtudiants },
                        { icon: BookOpen, label: 'Total UEs', value: totalUEs(filiere) },
                        { icon: Hash, label: 'Volume horaire', value: `${totalHeures(filiere)}h` },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                                <Icon className="h-3.5 w-3.5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">{label}</p>
                                <p className="text-sm font-semibold text-slate-800">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Niveaux + UEs */}
                <div className="flex flex-col flex-1 overflow-hidden">

                    {/* Tabs niveaux */}
                    <div className="flex gap-1 px-6 pt-4 pb-2 shrink-0 flex-wrap">
                        {filiere.niveaux.map(n => (
                            <button
                                key={n}
                                onClick={() => setNiveauOuvert(n)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${niveauOuvert === n
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {n}
                            </button>
                        ))}
                        {/* Tabs semestres */}
                        <div className="ml-auto flex gap-1 bg-slate-100 p-0.5 rounded-lg">
                            {SEMESTRES.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSemestre(s)}
                                    className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${semestre === s
                                            ? 'bg-white text-slate-800 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table UEs */}
                    <div className="overflow-y-auto flex-1 px-6 pb-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                    <th className="text-left px-4 py-2 font-semibold">Code</th>
                                    <th className="text-left px-4 py-2 font-semibold">Intitulé</th>
                                    <th className="text-center px-4 py-2 font-semibold">Coeff.</th>
                                    <th className="text-center px-4 py-2 font-semibold">Heures</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {ues.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-slate-400 text-sm">
                                            Aucune UE pour ce niveau / semestre
                                        </td>
                                    </tr>
                                ) : ues.map(ue => (
                                    <tr key={ue.code} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-2.5">
                                            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                                {ue.code}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 font-medium text-slate-800">{ue.intitule}</td>
                                        <td className="px-4 py-2.5 text-center text-slate-600">{ue.coeff}</td>
                                        <td className="px-4 py-2.5 text-center">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                                                {ue.heures}h
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 shrink-0">
                    <button onClick={onClose}
                        className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 transition-colors">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Modal Édition ────────────────────────────────────────────

function ModalEdit({ filiere = null, onSave, onClose }) {
    const isNew = filiere === null

    const [form, setForm] = useState(filiere ?? {
        nom: '', code: '', chefDept: CHEFS_MOCK[0],
        statut: 'active', nbEtudiants: 0,
        niveaux: ['L1'], ues: { L1: { S1: [], S2: [] } },
    })

    const [niveauActif, setNiveauActif] = useState(form.niveaux[0] ?? 'L1')
    const [semestreActif, setSemestreActif] = useState('S1')

    // Nouvelle UE vide
    const [nouvelleUE, setNouvelleUE] = useState({ code: '', intitule: '', coeff: 2, heures: 30 })
    const [ajoutUEVisible, setAjoutUEVisible] = useState(false)

    function toggleNiveau(n) {
        if (form.niveaux.includes(n)) {
            if (form.niveaux.length === 1) return // au moins 1 niveau
            const newNiveaux = form.niveaux.filter(x => x !== n)
            const newUes = { ...form.ues }
            delete newUes[n]
            setForm({ ...form, niveaux: newNiveaux, ues: newUes })
            if (niveauActif === n) setNiveauActif(newNiveaux[0])
        } else {
            const newNiveaux = [...form.niveaux, n].sort()
            const newUes = { ...form.ues, [n]: { S1: [], S2: [] } }
            setForm({ ...form, niveaux: newNiveaux, ues: newUes })
            setNiveauActif(n)
        }
    }

    function ajouterUE() {
        if (!nouvelleUE.code.trim() || !nouvelleUE.intitule.trim()) return
        const path = [niveauActif, semestreActif]
        const current = form.ues[path[0]]?.[path[1]] ?? []
        const newUes = {
            ...form.ues,
            [path[0]]: {
                ...(form.ues[path[0]] ?? {}),
                [path[1]]: [...current, { ...nouvelleUE }],
            },
        }
        setForm({ ...form, ues: newUes })
        setNouvelleUE({ code: '', intitule: '', coeff: 2, heures: 30 })
        setAjoutUEVisible(false)
    }

    function supprimerUE(idx) {
        const current = form.ues[niveauActif]?.[semestreActif] ?? []
        const newList = current.filter((_, i) => i !== idx)
        setForm({
            ...form,
            ues: {
                ...form.ues,
                [niveauActif]: {
                    ...(form.ues[niveauActif] ?? {}),
                    [semestreActif]: newList,
                },
            },
        })
    }

    function modifierUE(idx, field, val) {
        const current = [...(form.ues[niveauActif]?.[semestreActif] ?? [])]
        current[idx] = { ...current[idx], [field]: field === 'coeff' || field === 'heures' ? Number(val) : val }
        setForm({
            ...form,
            ues: {
                ...form.ues,
                [niveauActif]: {
                    ...(form.ues[niveauActif] ?? {}),
                    [semestreActif]: current,
                },
            },
        })
    }

    const uesActuelles = form.ues[niveauActif]?.[semestreActif] ?? []

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <h2 className="text-base font-semibold text-slate-800">
                        {isNew ? 'Nouvelle filière' : `Modifier — ${filiere.nom}`}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6 space-y-6">

                    {/* Infos générales */}
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Informations générales
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Nom de la filière</label>
                                <input
                                    value={form.nom}
                                    onChange={e => setForm({ ...form, nom: e.target.value })}
                                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Code</label>
                                <input
                                    value={form.code}
                                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Chef de Département</label>
                                <select
                                    value={form.chefDept}
                                    onChange={e => setForm({ ...form, chefDept: e.target.value })}
                                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400"
                                >
                                    {CHEFS_MOCK.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Statut</label>
                                <select
                                    value={form.statut}
                                    onChange={e => setForm({ ...form, statut: e.target.value })}
                                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Niveaux */}
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Niveaux
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {NIVEAUX_DISPO.map(n => (
                                <button
                                    key={n}
                                    onClick={() => toggleNiveau(n)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${form.niveaux.includes(n)
                                            ? 'bg-slate-800 text-white border-slate-800'
                                            : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* UEs par niveau */}
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Unités d'enseignement
                        </p>

                        {/* Tabs niveau */}
                        <div className="flex gap-1 mb-3 flex-wrap">
                            {form.niveaux.map(n => (
                                <button
                                    key={n}
                                    onClick={() => { setNiveauActif(n); setAjoutUEVisible(false) }}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${niveauActif === n
                                            ? 'bg-slate-800 text-white'
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                            {/* Tabs semestre */}
                            <div className="ml-auto flex gap-1 bg-slate-100 p-0.5 rounded-lg">
                                {SEMESTRES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => { setSemestreActif(s); setAjoutUEVisible(false) }}
                                        className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${semestreActif === s
                                                ? 'bg-white text-slate-800 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Liste UEs éditables */}
                        <div className="space-y-2 mb-3">
                            {uesActuelles.length === 0 && !ajoutUEVisible && (
                                <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg">
                                    Aucune UE — cliquez sur Ajouter
                                </p>
                            )}
                            {uesActuelles.map((ue, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                                    <input
                                        value={ue.code}
                                        onChange={e => modifierUE(idx, 'code', e.target.value)}
                                        placeholder="Code"
                                        className="w-24 text-xs font-mono text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-violet-400"
                                    />
                                    <input
                                        value={ue.intitule}
                                        onChange={e => modifierUE(idx, 'intitule', e.target.value)}
                                        placeholder="Intitulé"
                                        className="flex-1 text-sm text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-violet-400"
                                    />
                                    <input
                                        type="number" min={1} max={10}
                                        value={ue.coeff}
                                        onChange={e => modifierUE(idx, 'coeff', e.target.value)}
                                        className="w-14 text-sm text-center text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-violet-400"
                                        title="Coefficient"
                                    />
                                    <input
                                        type="number" min={10}
                                        value={ue.heures}
                                        onChange={e => modifierUE(idx, 'heures', e.target.value)}
                                        className="w-16 text-sm text-center text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-violet-400"
                                        title="Heures"
                                    />
                                    <span className="text-xs text-slate-400 shrink-0">h</span>
                                    <button
                                        onClick={() => supprimerUE(idx)}
                                        className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Formulaire ajout inline */}
                        {ajoutUEVisible && (
                            <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 mb-3">
                                <input
                                    value={nouvelleUE.code}
                                    onChange={e => setNouvelleUE({ ...nouvelleUE, code: e.target.value })}
                                    placeholder="Code"
                                    className="w-24 text-xs font-mono text-slate-700 bg-white border border-violet-200 rounded px-2 py-1 focus:outline-none focus:border-violet-400"
                                />
                                <input
                                    value={nouvelleUE.intitule}
                                    onChange={e => setNouvelleUE({ ...nouvelleUE, intitule: e.target.value })}
                                    placeholder="Intitulé de l'UE"
                                    className="flex-1 text-sm text-slate-800 bg-white border border-violet-200 rounded px-2 py-1 focus:outline-none focus:border-violet-400"
                                />
                                <input
                                    type="number" min={1} max={10}
                                    value={nouvelleUE.coeff}
                                    onChange={e => setNouvelleUE({ ...nouvelleUE, coeff: Number(e.target.value) })}
                                    className="w-14 text-sm text-center text-slate-800 bg-white border border-violet-200 rounded px-2 py-1 focus:outline-none focus:border-violet-400"
                                    title="Coefficient"
                                />
                                <input
                                    type="number" min={10}
                                    value={nouvelleUE.heures}
                                    onChange={e => setNouvelleUE({ ...nouvelleUE, heures: Number(e.target.value) })}
                                    className="w-16 text-sm text-center text-slate-800 bg-white border border-violet-200 rounded px-2 py-1 focus:outline-none focus:border-violet-400"
                                    title="Heures"
                                />
                                <span className="text-xs text-slate-400 shrink-0">h</span>
                                <button
                                    onClick={ajouterUE}
                                    className="p-1 text-violet-600 hover:bg-violet-100 rounded transition-colors"
                                >
                                    <Check className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setAjoutUEVisible(false)}
                                    className="p-1 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setAjoutUEVisible(true)}
                            className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter une UE
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-6 py-4 border-t border-slate-100 shrink-0">
                    <button
                        onClick={() => onSave(form)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                    >
                        <Check className="h-4 w-4" />
                        {isNew ? 'Créer la filière' : 'Enregistrer'}
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

export default function FiliereLayout({ config }) {
    const { peutEditer = false, accent = {} } = config

    const [filieres, setFilieres] = useState(FILIERES_INITIAL)
    const [search, setSearch] = useState('')
    const [filtreStatut, setFiltreStatut] = useState('Tous')
    const [page, setPage] = useState(1)
    const [modalDetail, setModalDetail] = useState(null)
    const [modalEdit, setModalEdit] = useState(null) // null | 'new' | filiere obj
    const [confirmSuppr, setConfirmSuppr] = useState(null)

    const filtered = filieres.filter(f => {
        const matchSearch = f.nom.toLowerCase().includes(search.toLowerCase()) ||
            f.code.toLowerCase().includes(search.toLowerCase())
        const matchStatut = filtreStatut === 'Tous' || f.statut === filtreStatut
        return matchSearch && matchStatut
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    function handleSave(form) {
        if (modalEdit === 'new') {
            setFilieres(f => [...f, { ...form, id: Date.now() }])
        } else {
            setFilieres(f => f.map(x => x.id === form.id ? form : x))
        }
        setModalEdit(null)
    }

    function handleSupprimer(id) {
        setFilieres(f => f.filter(x => x.id !== id))
        setConfirmSuppr(null)
    }

    return (
        <div className="p-6 space-y-5">

            {/* En-tête */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Filières</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Gestion des filières, niveaux et unités d'enseignement
                    </p>
                </div>
                {peutEditer && (
                    <button
                        onClick={() => setModalEdit('new')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors shadow-sm ${accent.btn ?? 'bg-violet-600 hover:bg-violet-700'
                            }`}
                    >
                        <Plus className="h-4 w-4" />
                        Nouvelle filière
                    </button>
                )}
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Rechercher par nom ou code…"
                        className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-slate-400"
                    />
                </div>
                <select
                    value={filtreStatut}
                    onChange={e => { setFiltreStatut(e.target.value); setPage(1) }}
                    className="text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
                >
                    {['Tous', 'active', 'inactive'].map(s => <option key={s}>{s}</option>)}
                </select>
            </div>

            {/* Compteur */}
            <p className="text-xs text-slate-400">
                {filtered.length} filière{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
            </p>

            {/* Tableau */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <th className="text-left px-5 py-3 font-semibold">Filière</th>
                                <th className="text-left px-4 py-3 font-semibold">Chef de Département</th>
                                <th className="text-center px-4 py-3 font-semibold">Niveaux</th>
                                <th className="text-center px-4 py-3 font-semibold">Étudiants</th>
                                <th className="text-center px-4 py-3 font-semibold">Total UEs</th>
                                <th className="text-center px-4 py-3 font-semibold">Volume horaire</th>
                                <th className="text-center px-4 py-3 font-semibold">Statut</th>
                                <th className="text-center px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                                        Aucune filière trouvée
                                    </td>
                                </tr>
                            ) : paginated.map(f => (
                                <tr key={f.id} className="hover:bg-slate-50 transition-colors">

                                    <td className="px-5 py-3">
                                        <p className="font-semibold text-slate-800">{f.nom}</p>
                                        <span className="font-mono text-xs text-slate-400">{f.code}</span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                <User className="h-3 w-3 text-slate-400" />
                                            </div>
                                            <span className="text-sm text-slate-600">{f.chefDept}</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1 flex-wrap">
                                            {f.niveaux.map(n => (
                                                <span key={n} className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                                    {n}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                                            {f.nbEtudiants}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">
                                            {totalUEs(f)} UEs
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                                            {totalHeures(f)}h
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.statut === 'active'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {f.statut}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => setModalDetail(f)}
                                                title="Voir détail"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {peutEditer && (
                                                <>
                                                    <button
                                                        onClick={() => setModalEdit(f)}
                                                        title="Modifier"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmSuppr(f)}
                                                        title="Supprimer"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
                <ModalDetail filiere={modalDetail} onClose={() => setModalDetail(null)} />
            )}

            {modalEdit && (
                <ModalEdit
                    filiere={modalEdit === 'new' ? null : modalEdit}
                    onSave={handleSave}
                    onClose={() => setModalEdit(null)}
                />
            )}

            {confirmSuppr && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                                <Trash2 className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Supprimer la filière ?</p>
                                <p className="text-xs text-slate-500 mt-0.5">{confirmSuppr.nom}</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">
                            Toutes les UEs associées seront supprimées. Cette action est irréversible.
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => handleSupprimer(confirmSuppr.id)}
                                className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors">
                                Supprimer
                            </button>
                            <button onClick={() => setConfirmSuppr(null)}
                                className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 transition-colors">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}