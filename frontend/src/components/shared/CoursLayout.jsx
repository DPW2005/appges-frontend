import { useState } from 'react'
import {
    Search, Plus, Eye, Edit2, Trash2,
    ChevronLeft, ChevronRight, X, Check,
    BookOpen, Users, Hash, Clock, GraduationCap, User
} from 'lucide-react'

const COURS_MOCK = [
    { id: 1, code: 'INFO301', intitule: 'Algorithmique avancée', filiere: 'Informatique', niveau: 'L2', credits: 3, heures: 45, enseignant: 'Dr. Paul Mbarga', semestre: 'S1', statut: 'actif' },
    { id: 2, code: 'INFO101', intitule: 'Introduction à la prog.', filiere: 'Informatique', niveau: 'L1', credits: 3, heures: 45, enseignant: 'Mme Claire Ateba', semestre: 'S1', statut: 'actif' },
    { id: 3, code: 'INFO302', intitule: 'Bases de données', filiere: 'Informatique', niveau: 'L2', credits: 2, heures: 30, enseignant: 'M. Serge Nkomo', semestre: 'S2', statut: 'actif' },
    { id: 4, code: 'INFO401', intitule: 'Réseaux informatiques', filiere: 'Informatique', niveau: 'L3', credits: 2, heures: 30, enseignant: 'Dr. Hélène Owona', semestre: 'S1', statut: 'actif' },
    { id: 5, code: 'INFO102', intitule: 'Mathématiques L1', filiere: 'Informatique', niveau: 'L1', credits: 3, heures: 45, enseignant: 'Mme Claire Ateba', semestre: 'S1', statut: 'actif' },
    { id: 6, code: 'INFO402', intitule: 'Projet tutoré', filiere: 'Informatique', niveau: 'L3', credits: 4, heures: 60, enseignant: 'Dr. Paul Mbarga', semestre: 'S2', statut: 'actif' },
    { id: 7, code: 'INFO303', intitule: 'Systèmes d\'exploitation', filiere: 'Informatique', niveau: 'L2', credits: 2, heures: 30, enseignant: 'Dr. René Ondoa', semestre: 'S2', statut: 'actif' },
    { id: 8, code: 'INFO103', intitule: 'Anglais technique', filiere: 'Informatique', niveau: 'L1', credits: 1, heures: 20, enseignant: 'Mme Sophie Biya', semestre: 'S2', statut: 'actif' },
    { id: 9, code: 'GEST201', intitule: 'Comptabilité générale', filiere: 'Gestion', niveau: 'L1', credits: 3, heures: 45, enseignant: 'M. Bertrand Foe', semestre: 'S1', statut: 'actif' },
    { id: 10, code: 'GEST301', intitule: 'Finance d\'entreprise', filiere: 'Gestion', niveau: 'L2', credits: 3, heures: 45, enseignant: 'Mme Nadine Essama', semestre: 'S1', statut: 'inactif' },
    { id: 11, code: 'COMPT201', intitule: 'Droit des affaires', filiere: 'Comptabilité', niveau: 'L2', credits: 2, heures: 30, enseignant: 'Dr. Jules Minkang', semestre: 'S2', statut: 'actif' },
    { id: 12, code: 'COMPT101', intitule: 'Fiscalité de base', filiere: 'Comptabilité', niveau: 'L1', credits: 2, heures: 30, enseignant: 'M. Alain Nguema', semestre: 'S1', statut: 'actif' },
]

const FILIERES = ['Toutes', 'Informatique', 'Gestion', 'Comptabilité']
const NIVEAUX = ['Tous', 'L1', 'L2', 'L3']
const SEMESTRES = ['Tous', 'S1', 'S2']
const PAGE_SIZE = 8

function ModalDetail({ cours, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-800">Détail de l'UE</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                            <BookOpen className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-800">{cours.intitule}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{cours.code}</p>
                            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${cours.statut === 'actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                }`}>{cours.statut}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        {[
                            { icon: GraduationCap, label: 'Filière', value: cours.filiere },
                            { icon: Hash, label: 'Niveau', value: cours.niveau },
                            { icon: Clock, label: 'Volume horaire', value: `${cours.heures}h` },
                            { icon: BookOpen, label: 'Crédits', value: `${cours.credits} ECTS` },
                            { icon: Users, label: 'Semestre', value: cours.semestre },
                            { icon: User, label: 'Enseignant', value: cours.enseignant },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                                    <Icon className="h-3.5 w-3.5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">{label}</p>
                                    <p className="text-sm font-medium text-slate-800">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="px-6 pb-5">
                    <button onClick={onClose}
                        className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 transition-colors">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    )
}

function ModalForm({ cours = null, onClose, onSave }) {
    const [form, setForm] = useState(
        cours ?? { code: '', intitule: '', filiere: 'Informatique', niveau: 'L1', credits: 2, heures: 30, enseignant: '', semestre: 'S1', statut: 'actif' }
    )
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-800">
                        {cours ? "Modifier l'UE" : 'Ajouter une UE'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
                    {[
                        { label: 'Code UE', field: 'code', type: 'text' },
                        { label: 'Intitulé', field: 'intitule', type: 'text' },
                        { label: 'Enseignant', field: 'enseignant', type: 'text' },
                    ].map(({ label, field, type }) => (
                        <div key={field}>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
                            <input type={type} value={form[field]}
                                onChange={e => setForm({ ...form, [field]: e.target.value })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"
                            />
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Filière</label>
                            <select value={form.filiere} onChange={e => setForm({ ...form, filiere: e.target.value })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400">
                                {['Informatique', 'Gestion', 'Comptabilité'].map(f => <option key={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Niveau</label>
                            <select value={form.niveau} onChange={e => setForm({ ...form, niveau: e.target.value })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400">
                                {['L1', 'L2', 'L3'].map(n => <option key={n}>{n}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Crédits</label>
                            <input type="number" min={1} max={6} value={form.credits}
                                onChange={e => setForm({ ...form, credits: Number(e.target.value) })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Volume horaire (h)</label>
                            <input type="number" min={10} value={form.heures}
                                onChange={e => setForm({ ...form, heures: Number(e.target.value) })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Semestre</label>
                            <select value={form.semestre} onChange={e => setForm({ ...form, semestre: e.target.value })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400">
                                {['S1', 'S2'].map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Statut</label>
                            <select value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400">
                                {['actif', 'inactif'].map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 px-6 pb-5 pt-2">
                    <button onClick={() => onSave(form)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">
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

export default function CoursLayout({ config }) {
    const {
        titre, subtitle,
        filiereForcee = null,
        peutAjouter = false,
        peutModifier = false,
        peutSupprimer = false,
        accent = {},
    } = config

    const source = filiereForcee
        ? COURS_MOCK.filter(c => c.filiere === filiereForcee)
        : COURS_MOCK

    const [liste, setListe] = useState(source)
    const [search, setSearch] = useState('')
    const [filtreFiliere, setFiltreFiliere] = useState('Toutes')
    const [filtreNiveau, setFiltreNiveau] = useState('Tous')
    const [filtreSemestre, setFiltreSemestre] = useState('Tous')
    const [page, setPage] = useState(1)
    const [modalDetail, setModalDetail] = useState(null)
    const [modalForm, setModalForm] = useState(null)
    const [confirmSuppr, setConfirmSuppr] = useState(null)

    const filtered = liste.filter(c => {
        const matchSearch = c.intitule.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
        const matchFiliere = filtreFiliere === 'Toutes' || c.filiere === filtreFiliere
        const matchNiveau = filtreNiveau === 'Tous' || c.niveau === filtreNiveau
        const matchSemestre = filtreSemestre === 'Tous' || c.semestre === filtreSemestre
        return matchSearch && matchFiliere && matchNiveau && matchSemestre
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    function handleSave(form) {
        if (modalForm === 'new') {
            setListe(l => [...l, { ...form, id: Date.now() }])
        } else {
            setListe(l => l.map(c => c.id === form.id ? form : c))
        }
        setModalForm(null)
    }

    function handleSupprimer(id) {
        setListe(l => l.filter(c => c.id !== id))
        setConfirmSuppr(null)
    }

    return (
        <div className="p-6 space-y-5">

            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{titre}</h1>
                    <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
                </div>
                {peutAjouter && (
                    <button onClick={() => setModalForm('new')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${accent.btn ?? 'bg-emerald-600 hover:bg-emerald-700'}`}>
                        <Plus className="h-4 w-4" /> Ajouter une UE
                    </button>
                )}
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Rechercher par intitulé ou code…"
                        className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 placeholder:text-slate-400"
                    />
                </div>
                {!filiereForcee && (
                    <select value={filtreFiliere} onChange={e => { setFiltreFiliere(e.target.value); setPage(1) }}
                        className="text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400">
                        {FILIERES.map(f => <option key={f}>{f}</option>)}
                    </select>
                )}
                <select value={filtreNiveau} onChange={e => { setFiltreNiveau(e.target.value); setPage(1) }}
                    className="text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400">
                    {NIVEAUX.map(n => <option key={n}>{n}</option>)}
                </select>
                <select value={filtreSemestre} onChange={e => { setFiltreSemestre(e.target.value); setPage(1) }}
                    className="text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400">
                    {SEMESTRES.map(s => <option key={s}>{s}</option>)}
                </select>
            </div>

            {/* Compteur */}
            <p className="text-xs text-slate-400">
                {filtered.length} UE trouvée{filtered.length > 1 ? 's' : ''}
            </p>

            {/* Tableau */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <th className="text-left px-5 py-3 font-semibold">Code</th>
                                <th className="text-left px-4 py-3 font-semibold">Intitulé</th>
                                <th className="text-left px-4 py-3 font-semibold">Filière</th>
                                <th className="text-center px-4 py-3 font-semibold">Niveau</th>
                                <th className="text-center px-4 py-3 font-semibold">Crédits</th>
                                <th className="text-center px-4 py-3 font-semibold">Semestre</th>
                                <th className="text-center px-4 py-3 font-semibold">Statut</th>
                                <th className="text-center px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">Aucune UE trouvée</td></tr>
                            ) : paginated.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                            {c.code}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-slate-800">{c.intitule}</p>
                                        <p className="text-xs text-slate-400">{c.enseignant}</p>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{c.filiere}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{c.niveau}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{c.credits} ECTS</span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-slate-500 text-xs">{c.semestre}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.statut === 'actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                            }`}>{c.statut}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button onClick={() => setModalDetail(c)} title="Voir détail"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {peutModifier && (
                                                <button onClick={() => setModalForm(c)} title="Modifier"
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                            )}
                                            {peutSupprimer && (
                                                <button onClick={() => setConfirmSuppr(c)} title="Supprimer"
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
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

            {modalDetail && <ModalDetail cours={modalDetail} onClose={() => setModalDetail(null)} />}

            {modalForm && (
                <ModalForm
                    cours={modalForm === 'new' ? null : modalForm}
                    onClose={() => setModalForm(null)}
                    onSave={handleSave}
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
                                <p className="text-sm font-semibold text-slate-800">Supprimer l'UE ?</p>
                                <p className="text-xs text-slate-500 mt-0.5">{confirmSuppr.intitule}</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">Cette action est irréversible.</p>
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