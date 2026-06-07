import { useState } from 'react'
import {
    Search, Plus, Eye, Edit2, Trash2, Ban,
    ChevronLeft, ChevronRight, X, Check,
    GraduationCap, Mail, Phone, BookOpen, Hash
} from 'lucide-react'

const ETUDIANTS_MOCK = [
    { id: 1, nom: 'Jean-Pierre Nkomo', email: 'jp.nkomo@appges.cm', telephone: '+237 699 321 654', filiere: 'Informatique', niveau: 'L2', statut: 'actif' },
    { id: 2, nom: 'Marie Ateba', email: 'm.ateba@appges.cm', telephone: '+237 677 456 123', filiere: 'Informatique', niveau: 'L1', statut: 'actif' },
    { id: 3, nom: 'Alain Biya', email: 'a.biya@appges.cm', telephone: '+237 655 789 456', filiere: 'Informatique', niveau: 'L3', statut: 'actif' },
    { id: 4, nom: 'Fatima Oumarou', email: 'f.oumarou@appges.cm', telephone: '+237 691 234 567', filiere: 'Gestion', niveau: 'L1', statut: 'actif' },
    { id: 5, nom: 'Eric Tamba', email: 'e.tamba@appges.cm', telephone: '+237 699 876 543', filiere: 'Gestion', niveau: 'L2', statut: 'suspendu' },
    { id: 6, nom: 'Carine Mballa', email: 'c.mballa@appges.cm', telephone: '+237 677 111 222', filiere: 'Informatique', niveau: 'L1', statut: 'actif' },
    { id: 7, nom: 'Boris Nguema', email: 'b.nguema@appges.cm', telephone: '+237 655 333 444', filiere: 'Comptabilité', niveau: 'L2', statut: 'actif' },
    { id: 8, nom: 'Sandrine Foe', email: 's.foe@appges.cm', telephone: '+237 691 555 666', filiere: 'Informatique', niveau: 'L2', statut: 'actif' },
    { id: 9, nom: 'Patrick Owona', email: 'p.owona@appges.cm', telephone: '+237 699 777 888', filiere: 'Gestion', niveau: 'L3', statut: 'actif' },
    { id: 10, nom: 'Nadège Essama', email: 'n.essama@appges.cm', telephone: '+237 677 999 000', filiere: 'Comptabilité', niveau: 'L1', statut: 'actif' },
    { id: 11, nom: 'Hervé Minkang', email: 'h.minkang@appges.cm', telephone: '+237 655 112 233', filiere: 'Informatique', niveau: 'L3', statut: 'actif' },
    { id: 12, nom: 'Laure Ondoa', email: 'l.ondoa@appges.cm', telephone: '+237 691 445 566', filiere: 'Gestion', niveau: 'L1', statut: 'suspendu' },
]

const FILIERES = ['Toutes', 'Informatique', 'Gestion', 'Comptabilité']
const NIVEAUX = ['Tous', 'L1', 'L2', 'L3']
const PAGE_SIZE = 8

function Avatar({ nom, size = 'sm' }) {
    const initiales = nom.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    const colors = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500']
    const color = colors[nom.charCodeAt(0) % colors.length]
    const sz = size === 'lg' ? 'h-14 w-14 text-lg' : 'h-8 w-8 text-xs'
    return (
        <div className={`${sz} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0 select-none`}>
            {initiales}
        </div>
    )
}

function ModalFiche({ etudiant, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-800">Fiche étudiant</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar nom={etudiant.nom} size="lg" />
                        <div>
                            <p className="text-lg font-bold text-slate-800">{etudiant.nom}</p>
                            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${etudiant.statut === 'actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}>{etudiant.statut}</span>
                        </div>
                    </div>
                    <div className="space-y-3 pt-2">
                        {[
                            { icon: Mail, label: 'Email', value: etudiant.email },
                            { icon: Phone, label: 'Tél.', value: etudiant.telephone },
                            { icon: BookOpen, label: 'Filière', value: etudiant.filiere },
                            { icon: GraduationCap, label: 'Niveau', value: etudiant.niveau },
                            { icon: Hash, label: 'ID', value: `ETU-${String(etudiant.id).padStart(4, '0')}` },
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

function ModalForm({ etudiant = null, onClose, onSave }) {
    const [form, setForm] = useState(
        etudiant ?? { nom: '', email: '', telephone: '', filiere: 'Informatique', niveau: 'L1', statut: 'actif' }
    )
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-800">
                        {etudiant ? 'Modifier l\'étudiant' : 'Ajouter un étudiant'}
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
                    ].map(({ label, field, type }) => (
                        <div key={field}>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
                            <input type={type} value={form[field]}
                                onChange={e => setForm({ ...form, [field]: e.target.value })}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                            />
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Filière</label>
                            <select value={form.filiere} onChange={e => setForm({ ...form, filiere: e.target.value })}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                                {['Informatique', 'Gestion', 'Comptabilité'].map(f => <option key={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Niveau</label>
                            <select value={form.niveau} onChange={e => setForm({ ...form, niveau: e.target.value })}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                                {['L1', 'L2', 'L3'].map(n => <option key={n}>{n}</option>)}
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

export default function EtudiantsLayout({ config }) {
    const { titre, subtitle, filiereForcee = null, peutAjouter = false, peutModifier = false, peutSupprimer = false, peutSuspendre = false, accent = {} } = config

    const source = filiereForcee
        ? ETUDIANTS_MOCK.filter(e => e.filiere === filiereForcee)
        : ETUDIANTS_MOCK

    const [liste, setListe] = useState(source)
    const [search, setSearch] = useState('')
    const [filtreFiliere, setFiltreFiliere] = useState('Toutes')
    const [filtreNiveau, setFiltreNiveau] = useState('Tous')
    const [page, setPage] = useState(1)
    const [modalFiche, setModalFiche] = useState(null)
    const [modalForm, setModalForm] = useState(null) // null | 'new' | etudiant
    const [confirmSuppr, setConfirmSuppr] = useState(null)

    const filtered = liste.filter(e => {
        const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
        const matchFiliere = filtreFiliere === 'Toutes' || e.filiere === filtreFiliere
        const matchNiveau = filtreNiveau === 'Tous' || e.niveau === filtreNiveau
        return matchSearch && matchFiliere && matchNiveau
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
                        <Plus className="h-4 w-4" /> Ajouter un étudiant
                    </button>
                )}
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Rechercher un étudiant…"
                        className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-slate-400"
                    />
                </div>
                {!filiereForcee && (
                    <select value={filtreFiliere} onChange={e => { setFiltreFiliere(e.target.value); setPage(1) }}
                        className="text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                        {FILIERES.map(f => <option key={f}>{f}</option>)}
                    </select>
                )}
                <select value={filtreNiveau} onChange={e => { setFiltreNiveau(e.target.value); setPage(1) }}
                    className="text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                    {NIVEAUX.map(n => <option key={n}>{n}</option>)}
                </select>
            </div>

            {/* Compteur */}
            <p className="text-xs text-slate-400">{filtered.length} étudiant{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>

            {/* Tableau */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <th className="text-left px-5 py-3 font-semibold">Étudiant</th>
                                <th className="text-left px-4 py-3 font-semibold">Filière</th>
                                <th className="text-center px-4 py-3 font-semibold">Niveau</th>
                                <th className="text-left px-4 py-3 font-semibold">Téléphone</th>
                                <th className="text-center px-4 py-3 font-semibold">Statut</th>
                                <th className="text-center px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">Aucun étudiant trouvé</td></tr>
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
                                    <td className="px-4 py-3 text-slate-600">{e.filiere}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{e.niveau}</span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">{e.telephone}</td>
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                        <p className="text-xs text-slate-400">
                            Page {page} sur {totalPages}
                        </p>
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

            {/* Modal fiche */}
            {modalFiche && <ModalFiche etudiant={modalFiche} onClose={() => setModalFiche(null)} />}

            {/* Modal formulaire */}
            {modalForm && (
                <ModalForm
                    etudiant={modalForm === 'new' ? null : modalForm}
                    onClose={() => setModalForm(null)}
                    onSave={handleSave}
                />
            )}

            {/* Confirmation suppression */}
            {confirmSuppr && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                                <Trash2 className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Supprimer l'étudiant ?</p>
                                <p className="text-xs text-slate-500 mt-0.5">{confirmSuppr.nom}</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">Cette action est irréversible. Toutes les données associées seront perdues.</p>
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