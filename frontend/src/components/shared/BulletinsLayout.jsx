import { useState } from 'react'
import {
    Search, Eye, FileText, ChevronLeft, ChevronRight,
    X, Check, Edit2, GraduationCap, BookOpen, Award
} from 'lucide-react'

// ── Données mock ─────────────────────────────────────────────

const ANNEES = ['2025/2026', '2024/2025']
const FILIERES = ['Informatique', 'Gestion', 'Comptabilité']
const NIVEAUX = ['L1', 'L2', 'L3']
const SEMESTRES = ['S1', 'S2']
const PAGE_SIZE = 8

const UES_PAR_FILIERE = {
    Informatique: {
        L1: {
            S1: [
                { code: 'INFO101', intitule: 'Introduction à la prog.', coeff: 3 },
                { code: 'INFO102', intitule: 'Mathématiques L1', coeff: 3 },
                { code: 'INFO103', intitule: 'Anglais technique', coeff: 1 },
                { code: 'INFO104', intitule: 'Logique & algorithmique', coeff: 2 },
            ],
            S2: [
                { code: 'INFO105', intitule: 'Structures de données', coeff: 3 },
                { code: 'INFO106', intitule: 'Systèmes informatiques', coeff: 2 },
                { code: 'INFO107', intitule: 'Expression écrite', coeff: 1 },
            ],
        },
        L2: {
            S1: [
                { code: 'INFO301', intitule: 'Algorithmique avancée', coeff: 3 },
                { code: 'INFO302', intitule: 'Bases de données', coeff: 2 },
                { code: 'INFO303', intitule: "Systèmes d'exploitation", coeff: 2 },
                { code: 'INFO304', intitule: 'Mathématiques L2', coeff: 3 },
                { code: 'INFO305', intitule: 'Anglais technique', coeff: 1 },
            ],
            S2: [
                { code: 'INFO306', intitule: 'Réseaux informatiques', coeff: 2 },
                { code: 'INFO307', intitule: 'Programmation web', coeff: 2 },
                { code: 'INFO308', intitule: 'Projet tutoré S2', coeff: 4 },
            ],
        },
        L3: {
            S1: [
                { code: 'INFO401', intitule: 'Réseaux avancés', coeff: 3 },
                { code: 'INFO402', intitule: 'Sécurité informatique', coeff: 2 },
                { code: 'INFO403', intitule: 'Génie logiciel', coeff: 3 },
            ],
            S2: [
                { code: 'INFO404', intitule: 'Projet tutoré', coeff: 6 },
                { code: 'INFO405', intitule: 'Stage professionnel', coeff: 4 },
            ],
        },
    },
    Gestion: {
        L1: {
            S1: [
                { code: 'GEST101', intitule: 'Introduction à la gestion', coeff: 3 },
                { code: 'GEST102', intitule: 'Mathématiques financières', coeff: 2 },
                { code: 'GEST103', intitule: 'Anglais des affaires', coeff: 1 },
            ],
            S2: [
                { code: 'GEST104', intitule: 'Comptabilité de base', coeff: 3 },
                { code: 'GEST105', intitule: 'Droit civil', coeff: 2 },
            ],
        },
        L2: {
            S1: [
                { code: 'GEST201', intitule: 'Comptabilité générale', coeff: 3 },
                { code: 'GEST202', intitule: 'Économie d\'entreprise', coeff: 2 },
            ],
            S2: [
                { code: 'GEST203', intitule: 'Marketing fondamental', coeff: 2 },
                { code: 'GEST204', intitule: 'Gestion de projet', coeff: 3 },
            ],
        },
        L3: {
            S1: [
                { code: 'GEST301', intitule: "Finance d'entreprise", coeff: 3 },
                { code: 'GEST302', intitule: 'Stratégie d\'entreprise', coeff: 3 },
            ],
            S2: [
                { code: 'GEST303', intitule: 'Mémoire professionnel', coeff: 6 },
            ],
        },
    },
    Comptabilité: {
        L1: {
            S1: [
                { code: 'COMPT101', intitule: 'Fiscalité de base', coeff: 2 },
                { code: 'COMPT102', intitule: 'Comptabilité générale L1', coeff: 3 },
            ],
            S2: [
                { code: 'COMPT103', intitule: 'Droit fiscal', coeff: 2 },
                { code: 'COMPT104', intitule: 'Informatique de gestion', coeff: 2 },
            ],
        },
        L2: {
            S1: [
                { code: 'COMPT201', intitule: 'Droit des affaires', coeff: 2 },
                { code: 'COMPT202', intitule: 'Comptabilité analytique', coeff: 3 },
            ],
            S2: [
                { code: 'COMPT203', intitule: 'Audit comptable', coeff: 3 },
                { code: 'COMPT204', intitule: 'Fiscalité avancée', coeff: 2 },
            ],
        },
        L3: {
            S1: [
                { code: 'COMPT301', intitule: 'Consolidation des comptes', coeff: 4 },
                { code: 'COMPT302', intitule: 'Contrôle de gestion', coeff: 3 },
            ],
            S2: [
                { code: 'COMPT303', intitule: 'Mémoire professionnel', coeff: 6 },
            ],
        },
    },
}

// Génère des notes aléatoires reproductibles par seed
function noteAlea(seed) {
    const x = Math.sin(seed) * 10000
    const val = (x - Math.floor(x)) * 12 + 6 // entre 6 et 18
    return Math.round(val * 2) / 2 // arrondi à 0.5
}

function genererEtudiants() {
    const etudiants = []
    let id = 1
    const prenomsM = ['Jean-Pierre', 'Serge', 'Paul', 'Alain', 'René', 'Jules', 'Bertrand', 'Martin']
    const prenomsF = ['Marie', 'Claire', 'Hélène', 'Sophie', 'Nadine', 'Alice', 'Amélie', 'Lucie']
    const noms = ['Nkomo', 'Mbarga', 'Ateba', 'Owona', 'Foe', 'Essama', 'Ondoa', 'Nguema', 'Minkang', 'Biya']

    FILIERES.forEach((filiere) => {
        NIVEAUX.forEach((niveau) => {
            const nbEtu = 6 + (id % 3) // 6 à 8 étudiants par groupe
            for (let i = 0; i < nbEtu; i++) {
                const isFemme = (id + i) % 2 === 0
                const prenom = isFemme
                    ? prenomsF[(id + i) % prenomsF.length]
                    : prenomsM[(id + i) % prenomsM.length]
                const nom = noms[(id + i) % noms.length]
                const matricule = `${filiere.substring(0, 3).toUpperCase()}-${niveau}-${String(id).padStart(3, '0')}`

                // Générer les notes pour chaque semestre
                const notesBySemestre = {}
                SEMESTRES.forEach(sem => {
                    const ues = UES_PAR_FILIERE[filiere]?.[niveau]?.[sem] ?? []
                    notesBySemestre[sem] = ues.map((ue, j) => ({
                        ...ue,
                        note: j === ues.length - 1 && niveau === 'L3'
                            ? null // dernière UE L3 pas encore notée
                            : noteAlea(id * 13 + j * 7 + sem.charCodeAt(0)),
                    }))
                })

                etudiants.push({
                    id,
                    nom: `${prenom} ${nom}`,
                    matricule,
                    filiere,
                    niveau,
                    notes: notesBySemestre,
                    statuts: { S1: 'en attente', S2: 'en attente' },
                })
                id++
            }
        })
    })
    return etudiants
}

const ETUDIANTS_INITIAL = genererEtudiants()

// ── Helpers ──────────────────────────────────────────────────

function calculerMoyenne(notes) {
    const notees = notes.filter(u => u.note !== null)
    if (notees.length === 0) return null
    const sumPoints = notees.reduce((s, u) => s + u.note * u.coeff, 0)
    const sumCoeffs = notees.reduce((s, u) => s + u.coeff, 0)
    return sumCoeffs === 0 ? null : Math.round((sumPoints / sumCoeffs) * 100) / 100
}

function getMention(moy) {
    if (moy === null) return { label: '—', color: 'bg-slate-100 text-slate-400' }
    if (moy >= 16) return { label: 'Très Bien', color: 'bg-violet-100 text-violet-700' }
    if (moy >= 14) return { label: 'Bien', color: 'bg-blue-100 text-blue-700' }
    if (moy >= 12) return { label: 'Assez Bien', color: 'bg-emerald-100 text-emerald-700' }
    if (moy >= 10) return { label: 'Passable', color: 'bg-amber-100 text-amber-700' }
    return { label: 'Insuffisant', color: 'bg-rose-100 text-rose-700' }
}

function getResultat(moy) {
    if (moy === null) return { label: 'En cours', color: 'bg-slate-100 text-slate-500' }
    if (moy >= 10) return { label: 'Admis', color: 'bg-emerald-100 text-emerald-700' }
    return { label: 'Ajourné', color: 'bg-rose-100 text-rose-700' }
}

// ── Modal Bulletin ───────────────────────────────────────────

function ModalBulletin({ etudiant, semestre, annee, onClose }) {
    const notes = etudiant.notes[semestre] ?? []
    const moyenne = calculerMoyenne(notes)
    const mention = getMention(moyenne)
    const resultat = getResultat(moyenne)
    const sumCoeffs = notes.reduce((s, u) => s + u.coeff, 0)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                            <GraduationCap className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">{etudiant.nom}</p>
                            <p className="text-xs text-slate-400">
                                {etudiant.matricule} · {etudiant.filiere} {etudiant.niveau} · {semestre} · {annee}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Résumé */}
                <div className="flex items-center gap-6 px-6 py-3 bg-slate-50 border-b border-slate-100 shrink-0 flex-wrap">
                    <div>
                        <p className="text-xs text-slate-400">Moyenne générale</p>
                        <p className={`text-lg font-bold ${moyenne !== null ? (moyenne >= 10 ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-400'}`}>
                            {moyenne !== null ? moyenne.toFixed(2) + ' / 20' : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Mention</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mention.color}`}>
                            {mention.label}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Résultat</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${resultat.color}`}>
                            {resultat.label}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Total crédits</p>
                        <p className="text-sm font-bold text-slate-700">{sumCoeffs} ECTS</p>
                    </div>
                </div>

                {/* Tableau des notes */}
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0">
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <th className="text-left px-6 py-3 font-semibold">Unité d'enseignement</th>
                                <th className="text-center px-4 py-3 font-semibold">Coeff.</th>
                                <th className="text-center px-4 py-3 font-semibold">Note /20</th>
                                <th className="text-center px-4 py-3 font-semibold">Points</th>
                                <th className="text-center px-4 py-3 font-semibold">Résultat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {notes.map((ue) => {
                                const r = getResultat(ue.note)
                                return (
                                    <tr key={ue.code} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3">
                                            <p className="font-medium text-slate-800">{ue.intitule}</p>
                                            <p className="text-xs text-slate-400 font-mono">{ue.code}</p>
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-600">{ue.coeff}</td>
                                        <td className="px-4 py-3 text-center">
                                            {ue.note !== null ? (
                                                <span className={`font-bold ${ue.note >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {ue.note.toFixed(1)}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-600">
                                            {ue.note !== null
                                                ? (ue.note * ue.coeff).toFixed(1)
                                                : '—'
                                            }
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {ue.note !== null && (
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.color}`}>
                                                    {r.label}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-slate-200 bg-slate-50">
                                <td className="px-6 py-3 text-sm font-bold text-slate-800">TOTAL</td>
                                <td className="px-4 py-3 text-center font-bold text-slate-700">{sumCoeffs}</td>
                                <td className="px-4 py-3 text-center font-bold text-slate-800">
                                    {moyenne !== null ? moyenne.toFixed(2) : '—'}
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-slate-700">
                                    {notes.filter(u => u.note !== null)
                                        .reduce((s, u) => s + u.note * u.coeff, 0).toFixed(1)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${resultat.color}`}>
                                        {resultat.label}
                                    </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
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

// ── Modal Édition des notes (Super Admin) ────────────────────

function ModalEditNotes({ etudiant, semestre, onSave, onClose }) {
    const [form, setForm] = useState(
        etudiant.notes[semestre].map(u => ({ ...u }))
    )

    function setNote(idx, val) {
        const parsed = val === '' ? null : Math.min(20, Math.max(0, parseFloat(val) || 0))
        setForm(f => f.map((u, i) => i === idx ? { ...u, note: parsed } : u))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">

                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <div>
                        <h2 className="text-base font-semibold text-slate-800">Modifier les notes</h2>
                        <p className="text-xs text-slate-400 mt-0.5">{etudiant.nom} · {semestre}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6 space-y-3">
                    {form.map((ue, idx) => (
                        <div key={ue.code} className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800">{ue.intitule}</p>
                                <p className="text-xs text-slate-400 font-mono">{ue.code} · Coeff. {ue.coeff}</p>
                            </div>
                            <input
                                type="number"
                                min={0}
                                max={20}
                                step={0.5}
                                placeholder="—"
                                value={ue.note ?? ''}
                                onChange={e => setNote(idx, e.target.value)}
                                className="w-24 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 text-center focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                            />
                            <span className="text-xs text-slate-400 w-8">/ 20</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 px-6 py-4 border-t border-slate-100 shrink-0">
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

export default function BulletinsLayout({ config }) {
    const { peutEditerNotes = false, accent = {} } = config

    const [etudiants, setEtudiants] = useState(ETUDIANTS_INITIAL)

    // Filtres
    const [annee, setAnnee] = useState('2025/2026')
    const [filiere, setFiliere] = useState('Informatique')
    const [niveau, setNiveau] = useState('L2')
    const [semestre, setSemestre] = useState('S1')
    const [search, setSearch] = useState('')
    const [filtreResultat, setFiltreResultat] = useState('Tous')
    const [page, setPage] = useState(1)

    // Modals
    const [modalBulletin, setModalBulletin] = useState(null)
    const [modalEditNotes, setModalEditNotes] = useState(null)

    // Filtrage
    const filtered = etudiants.filter(e => {
        const moy = calculerMoyenne(e.notes[semestre] ?? [])
        const res = getResultat(moy).label
        const matchGroupe = e.filiere === filiere && e.niveau === niveau
        const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase()) ||
            e.matricule.toLowerCase().includes(search.toLowerCase())
        const matchResultat = filtreResultat === 'Tous' || res === filtreResultat
        return matchGroupe && matchSearch && matchResultat
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    // Stats du groupe
    const moyennes = filtered.map(e => calculerMoyenne(e.notes[semestre] ?? [])).filter(m => m !== null)
    const moyennePromo = moyennes.length
        ? (moyennes.reduce((s, m) => s + m, 0) / moyennes.length).toFixed(2)
        : '—'
    const nbAdmis = filtered.filter(e => (calculerMoyenne(e.notes[semestre] ?? []) ?? 0) >= 10).length
    const nbAjournes = filtered.filter(e => {
        const m = calculerMoyenne(e.notes[semestre] ?? [])
        return m !== null && m < 10
    }).length

    function handleSaveNotes(etudiantId, newNotes) {
        setEtudiants(es => es.map(e =>
            e.id === etudiantId
                ? { ...e, notes: { ...e.notes, [semestre]: newNotes } }
                : e
        ))
        setModalEditNotes(null)
    }

    function handleGenerer(etudiantId) {
        setEtudiants(es => es.map(e =>
            e.id === etudiantId
                ? { ...e, statuts: { ...e.statuts, [semestre]: 'généré' } }
                : e
        ))
    }

    function handleGenererTous() {
        const ids = new Set(filtered.map(e => e.id))
        setEtudiants(es => es.map(e =>
            ids.has(e.id)
                ? { ...e, statuts: { ...e.statuts, [semestre]: 'généré' } }
                : e
        ))
    }

    const nbEnAttente = filtered.filter(e => e.statuts[semestre] === 'en attente').length

    return (
        <div className="p-6 space-y-5">

            {/* En-tête */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Bulletins de notes</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {filiere} · {niveau} · {semestre} · {annee}
                    </p>
                </div>
                {nbEnAttente > 0 && (
                    <button
                        onClick={handleGenererTous}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors shadow-sm ${accent.btn ?? 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        <FileText className="h-4 w-4" />
                        Générer tous ({nbEnAttente})
                    </button>
                )}
            </div>

            {/* Sélecteurs groupe */}
            <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">Année</label>
                    <select value={annee} onChange={e => { setAnnee(e.target.value); setPage(1) }}
                        className="text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400">
                        {ANNEES.map(a => <option key={a}>{a}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">Filière</label>
                    <select value={filiere} onChange={e => { setFiliere(e.target.value); setPage(1) }}
                        className="text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400">
                        {FILIERES.map(f => <option key={f}>{f}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">Niveau</label>
                    <select value={niveau} onChange={e => { setNiveau(e.target.value); setPage(1) }}
                        className="text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400">
                        {NIVEAUX.map(n => <option key={n}>{n}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">Semestre</label>
                    <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
                        {SEMESTRES.map(s => (
                            <button key={s} onClick={() => { setSemestre(s); setPage(1) }}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${semestre === s
                                        ? 'bg-white text-slate-800 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats du groupe */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Étudiants', value: filtered.length, color: 'text-slate-800', bg: 'bg-slate-50', border: 'border-slate-200' },
                    { label: 'Moyenne promo', value: moyennePromo, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
                    { label: 'Admis', value: nbAdmis, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                    { label: 'Ajournés', value: nbAjournes, color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
                ].map(({ label, value, color, bg, border }) => (
                    <div key={label} className={`rounded-xl border ${border} ${bg} px-4 py-3 flex items-center justify-between`}>
                        <p className="text-xs text-slate-500">{label}</p>
                        <p className={`text-xl font-bold ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Rechercher par nom ou matricule…"
                        className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-slate-400"
                    />
                </div>
                <select value={filtreResultat} onChange={e => { setFiltreResultat(e.target.value); setPage(1) }}
                    className="text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                    {['Tous', 'Admis', 'Ajourné', 'En cours'].map(r => <option key={r}>{r}</option>)}
                </select>
            </div>

            {/* Compteur */}
            <p className="text-xs text-slate-400">
                {filtered.length} étudiant{filtered.length > 1 ? 's' : ''} · {nbEnAttente} bulletin{nbEnAttente > 1 ? 's' : ''} en attente
            </p>

            {/* Tableau */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <th className="text-left px-5 py-3 font-semibold">Étudiant</th>
                                <th className="text-left px-4 py-3 font-semibold">Matricule</th>
                                <th className="text-center px-4 py-3 font-semibold">Moyenne</th>
                                <th className="text-center px-4 py-3 font-semibold">Mention</th>
                                <th className="text-center px-4 py-3 font-semibold">Résultat</th>
                                <th className="text-center px-4 py-3 font-semibold">Bulletin</th>
                                <th className="text-center px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                                        Aucun étudiant trouvé
                                    </td>
                                </tr>
                            ) : paginated.map(e => {
                                const notes = e.notes[semestre] ?? []
                                const moy = calculerMoyenne(notes)
                                const mention = getMention(moy)
                                const resultat = getResultat(moy)

                                return (
                                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">

                                        {/* Nom */}
                                        <td className="px-5 py-3">
                                            <p className="font-medium text-slate-800">{e.nom}</p>
                                        </td>

                                        {/* Matricule */}
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                {e.matricule}
                                            </span>
                                        </td>

                                        {/* Moyenne */}
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-bold text-sm ${moy === null ? 'text-slate-400' :
                                                    moy >= 10 ? 'text-emerald-600' : 'text-rose-600'
                                                }`}>
                                                {moy !== null ? moy.toFixed(2) : '—'}
                                            </span>
                                        </td>

                                        {/* Mention */}
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mention.color}`}>
                                                {mention.label}
                                            </span>
                                        </td>

                                        {/* Résultat */}
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${resultat.color}`}>
                                                {resultat.label}
                                            </span>
                                        </td>

                                        {/* Statut bulletin */}
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${e.statuts[semestre] === 'généré'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {e.statuts[semestre]}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => setModalBulletin(e)}
                                                    title="Voir le bulletin"
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>

                                                {peutEditerNotes && (
                                                    <button
                                                        onClick={() => setModalEditNotes(e)}
                                                        title="Modifier les notes"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {e.statuts[semestre] === 'en attente' && (
                                                    <button
                                                        onClick={() => handleGenerer(e.id)}
                                                        title="Générer le bulletin"
                                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-xs font-medium transition-colors ${accent.btn ?? 'bg-emerald-600 hover:bg-emerald-700'
                                                            }`}
                                                    >
                                                        <FileText className="h-3.5 w-3.5" />
                                                        Générer
                                                    </button>
                                                )}

                                                {e.statuts[semestre] === 'généré' && (
                                                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium px-2">
                                                        <Check className="h-3.5 w-3.5" />
                                                        Généré
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                    </tr>
                                )
                            })}
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
            {modalBulletin && (
                <ModalBulletin
                    etudiant={modalBulletin}
                    semestre={semestre}
                    annee={annee}
                    onClose={() => setModalBulletin(null)}
                />
            )}
            {modalEditNotes && (
                <ModalEditNotes
                    etudiant={modalEditNotes}
                    semestre={semestre}
                    onSave={(notes) => handleSaveNotes(modalEditNotes.id, notes)}
                    onClose={() => setModalEditNotes(null)}
                />
            )}

        </div>
    )
}