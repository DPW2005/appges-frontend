import { useState } from 'react'
import {
    Search, Plus, Eye, Edit2, Trash2, Ban,
    ChevronLeft, ChevronRight, X, Check,
    Mail, Phone, BookOpen, Hash, Users, GraduationCap
} from 'lucide-react'

const ENSEIGNANTS_MOCK = [
    { id: 1, nom: 'Dr. Paul Mbarga', email: 'p.mbarga@appges.cm', telephone: '+237 655 789 012', specialite: 'Algorithmique', filiere: 'Informatique', grade: 'Docteur', statut: 'actif' },
    { id: 2, nom: 'Mme Claire Ateba', email: 'c.ateba@appges.cm', telephone: '+237 677 234 567', specialite: 'Mathématiques', filiere: 'Informatique', grade: 'Master', statut: 'actif' },
    { id: 3, nom: 'M. Serge Nkomo', email: 's.nkomo@appges.cm', telephone: '+237 699 345 678', specialite: 'Bases de données', filiere: 'Informatique', grade: 'Docteur', statut: 'actif' },
    { id: 4, nom: 'Dr. Hélène Owona', email: 'h.owona@appges.cm', telephone: '+237 691 456 789', specialite: 'Réseaux', filiere: 'Informatique', grade: 'Docteur', statut: 'actif' },
    { id: 5, nom: 'M. Bertrand Foe', email: 'b.foe@appges.cm', telephone: '+237 655 567 890', specialite: 'Comptabilité', filiere: 'Gestion', grade: 'Master', statut: 'actif' },
    { id: 6, nom: 'Mme Nadine Essama', email: 'n.essama@appges.cm', telephone: '+237 677 678 901', specialite: 'Finance', filiere: 'Gestion', grade: 'Master', statut: 'suspendu' },
    { id: 7, nom: 'Dr. Jules Minkang', email: 'j.minkang@appges.cm', telephone: '+237 699 789 012', specialite: 'Droit des affaires', filiere: 'Comptabilité', grade: 'Docteur', statut: 'actif' },
    { id: 8, nom: 'M. Alain Nguema', email: 'a.nguema@appges.cm', telephone: '+237 691 890 123', specialite: 'Fiscalité', filiere: 'Comptabilité', grade: 'Master', statut: 'actif' },
    { id: 9, nom: 'Mme Sophie Biya', email: 's.biya@appges.cm', telephone: '+237 655 901 234', specialite: 'Anglais technique', filiere: 'Informatique', grade: 'Licencié', statut: 'actif' },
    { id: 10, nom: 'Dr. René Ondoa', email: 'r.ondoa@appges.cm', telephone: '+237 677 012 345', specialite: 'Systèmes embarqués', filiere: 'Informatique', grade: 'Docteur', statut: 'actif' },
]

const FILIERES = ['Toutes', 'Informatique', 'Gestion', 'Comptabilité']
const GRADES = ['Tous', 'Docteur', 'Master', 'Licencié']
const PAGE_SIZE = 8

function Avatar({ nom }) {
    const initiales = nom.replace(/^(Dr\.|M\.|Mme)\s+/i, '').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    const colors = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-teal-500']
    const color = colors[nom.charCodeAt(0) % colors.length]
    return (
        <div className={`h-8 w-8 ${color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 select-none`}>
            {initiales}
        </div>
    )
}

function AvatarLg({ nom }) {
    const initiales = nom.replace(/^(Dr\.|M\.|Mme)\s+/i, '').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    const colors = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-teal-500']
    const color = colors[nom.charCodeAt(0) % colors.length]
    return (
        <div className={`h-14 w-14 ${color} rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0 select-none`}>
            {initiales}
        </div>
    )
}

function ModalFiche({ enseignant, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-800">Fiche enseignant</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <AvatarLg nom={enseignant.nom} />
                        <div>
                            <p className="text-lg font-bold text-slate-800">{enseignant.nom}</p>
                            <p className="text-xs text-slate-500">{enseignant.grade}</p>
                            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${enseignant.statut === 'actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}>{enseignant.statut}</span>
                        </div>
                    </div>
                    <div className="space-y-3 pt-2">
                        {[
                            { icon: Mail, label: 'Email', value: enseignant.email },
                            { icon: Phone, label: 'Téléphone', value: enseignant.telephone },
                            { icon: BookOpen, label: 'Spécialité', value: enseignant.specialite },
                            { icon: Users, label: 'Filière', value: enseignant.filiere },
                            { icon: Hash, label: 'ID', value: `ENS-${String(enseignant.id).padStart(4, '0')}` },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                                    <Icon className="h-4 w-4 text-slate-400" />
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

function ModalForm({ enseignant = null, onClose, onSave }) {
    const [form, setForm] = useState(
        enseignant ?? { nom: '', email: '', telephone: '', specialite: '', filiere: 'Informatique', grade: 'Master', statut: 'actif' }
    )
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-800">
                        {enseignant ? "Modifier l'enseignant" : 'Ajouter un enseignant'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {[
                        { label: 'Nom complet', field: 'nom', type: 'text' },
                        { label: 'Email', field: 'email', type: 'email' },
                        { label: 'Téléphone', field: 'telephone', type: 'text' },
                        { label: 'Spécialité', field: 'specialite', type: 'text' },
                    ].map(({ label, field, type }) => (
                        <div key={field}>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
                            <input type={type} value={form[field]}
                                onChange={e => setForm({ ...form, [field]: e.target.value })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                            />
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Filière</label>
                            <select value={form.filiere} onChange={e => setForm({ ...form, filiere: e.target.value })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                                {['Informatique', 'Gestion', 'Comptabilité'].map(f => <option key={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Grade</label>
                            <select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                                {['Docteur', 'Master', 'Licencié'].map(g => <option key={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 px-6 pb-5">
                    <button onClick={() => onSave(form)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
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

export default function EnseignantsLayout({ config }) {
    const {
        titre, subtitle,
        filiereForcee = null,
        peutAjouter = false,
        peutModifier = false,
        peutSupprimer = false,
        peutSuspendre = false,
        accent = {},
    } = config

    const source = filiereForcee
        ? ENSEIGNANTS_MOCK.filter(e => e.filiere === filiereForcee)
        : ENSEIGNANTS_MOCK

    const [liste, setListe] = useState(source)
    const [search, setSearch] = useState('')
    const [filtreFiliere, setFiltreFiliere] = useState('Toutes')
    const [filtreGrade, setFiltreGrade] = useState('Tous')
    const [page, setPage] = useState(1)
    const [modalFiche, setModalFiche] = useState(null)
    const [modalForm, setModalForm] = useState(null)
    const [confirmSuppr, setConfirmSuppr] = useState(null)

    const filtered = liste.filter(e => {
        const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
        const matchFiliere = filtreFiliere === 'Toutes' || e.filiere === filtreFiliere
        const matchGrade = filtreGrade === 'Tous' || e.grade === filtreGrade
        return matchSearch && matchFiliere && matchGrade
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    function handleSave(form) {
        if (modalForm === 'new') {
            setListe(l => [...l, { ...form, id: Date.now() }])
        } else {
            setListe(l => l.map(e => e.id === form.id ? form : e))
        }
        setModalForm(null)
    }

    function handleSupprimer(id) {
        setListe(l => l.filter(e => e.id !== id))
        setConfirmSuppr(null)
    }

    function handleSuspendre(id) {
        setListe(l => l.map(e => e.id === id
            ? { ...e, statut: e.statut === 'actif' ? 'suspendu' : 'actif' }
            : e
        ))
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
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${accent.btn ?? 'bg-blue-600 hover:bg-blue-700'}`}>
                        <Plus className="h-4 w-4" /> Ajouter un enseignant
                    </button>
                )}
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Rechercher un enseignant…"
                        className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-slate-400"
                    />
                </div>
                {!filiereForcee && (
                    <select value={filtreFiliere} onChange={e => { setFiltreFiliere(e.target.value); setPage(1) }}
                        className="text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                        {FILIERES.map(f => <option key={f}>{f}</option>)}
                    </select>
                )}
                <select value={filtreGrade} onChange={e => { setFiltreGrade(e.target.value); setPage(1) }}
                    className="text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                    {GRADES.map(g => <option key={g}>{g}</option>)}
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
                                <th className="text-left px-4 py-3 font-semibold">Spécialité</th>
                                <th className="text-left px-4 py-3 font-semibold">Filière</th>
                                <th className="text-center px-4 py-3 font-semibold">Grade</th>
                                <th className="text-center px-4 py-3 font-semibold">Statut</th>
                                <th className="text-center px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">Aucun enseignant trouvé</td></tr>
                            ) : paginated.map(e => (
                                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar nom={e.nom} />
                                            <div>
                                                <p className="font-medium text-slate-800">{e.nom}</p>
                                                <p className="text-xs text-slate-400">{e.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{e.specialite}</td>
                                    <td className="px-4 py-3 text-slate-600">{e.filiere}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{e.grade}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${e.statut === 'actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                            }`}>{e.statut}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button onClick={() => setModalFiche(e)} title="Voir fiche"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {peutModifier && (
                                                <button onClick={() => setModalForm(e)} title="Modifier"
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                            )}
                                            {peutSuspendre && (
                                                <button onClick={() => handleSuspendre(e.id)}
                                                    title={e.statut === 'actif' ? 'Suspendre' : 'Réactiver'}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                                                    <Ban className="h-4 w-4" />
                                                </button>
                                            )}
                                            {peutSupprimer && (
                                                <button onClick={() => setConfirmSuppr(e)} title="Supprimer"
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

            {modalFiche && <ModalFiche enseignant={modalFiche} onClose={() => setModalFiche(null)} />}

            {modalForm && (
                <ModalForm
                    enseignant={modalForm === 'new' ? null : modalForm}
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
                                <p className="text-sm font-semibold text-slate-800">Supprimer l'enseignant ?</p>
                                <p className="text-xs text-slate-500 mt-0.5">{confirmSuppr.nom}</p>
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