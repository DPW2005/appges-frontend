import { useState } from 'react'
import { Edit2, Trash2, Plus, X, Check } from 'lucide-react'
import { JOURS, TRANCHES } from '@/data/PlanningData'

const STATUT_COLORS = {
    'planifiée': 'bg-blue-100 border-blue-300 text-blue-800',
    'validée': 'bg-emerald-100 border-emerald-300 text-emerald-800',
    'non validée': 'bg-rose-100 border-rose-300 text-rose-800',
}

function ModalForm({ seance = null, filiere, classe, onClose, onSave }) {
    const [form, setForm] = useState(
        seance ?? { jour: 'Lundi', tranche: 'T1', ue: '', enseignant: '', salle: '', statut: 'planifiée' }
    )
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-base font-semibold text-slate-800">
                            {seance ? 'Modifier la séance' : 'Ajouter une séance'}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">{filiere} · {classe}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 space-y-3">
                    {[
                        { label: "Unité d'enseignement", field: 'ue' },
                        { label: 'Enseignant', field: 'enseignant' },
                        { label: 'Salle', field: 'salle' },
                    ].map(({ label, field }) => (
                        <div key={field}>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
                            <input value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                            />
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Jour</label>
                            <select value={form.jour} onChange={e => setForm({ ...form, jour: e.target.value })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                                {JOURS.map(j => <option key={j}>{j}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Tranche horaire</label>
                            <select value={form.tranche} onChange={e => setForm({ ...form, tranche: e.target.value })}
                                className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                                {TRANCHES.filter(t => !t.pause).map(t => (
                                    <option key={t.id} value={t.id}>{t.debut} – {t.fin}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 px-6 pb-5">
                    <button onClick={() => onSave({ ...form, id: seance?.id ?? Date.now() })}
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

export default function PlanningLayout({
    filiere, classe, seances,
    editable = false,
    headerColor = 'bg-slate-800',
    headerBorder = 'border-slate-700',
    onSave,
    onDelete,
    onValider = null,
}) {
    const [modalForm, setModalForm] = useState(null)
    const [confirmSuppr, setConfirmSuppr] = useState(null)

    function getSeance(jour, trancheId) {
        return seances.find(s => s.jour === jour && s.tranche === trancheId) ?? null
    }

    function handleSave(form) {
        onSave?.(form)
        setModalForm(null)
    }

    function handleDelete(id) {
        onDelete?.(id)
        setConfirmSuppr(null)
    }

    return (
        <div className="space-y-3">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse">
                        <thead>
                            <tr className={`${headerColor} text-white`}>
                                <th className={`w-36 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-left border-r ${headerBorder}`}>
                                    Horaire
                                </th>
                                {JOURS.map(j => (
                                    <th key={j} className={`px-3 py-3 text-xs font-semibold uppercase tracking-wider text-center border-r ${headerBorder} last:border-r-0`}>
                                        {j}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TRANCHES.map(tranche => (
                                <tr key={tranche.id} className="border-b border-slate-100">
                                    {/* Colonne horaire */}
                                    <td className={`px-4 py-3 border-r border-slate-200 align-middle ${tranche.pause ? 'bg-amber-50' : 'bg-slate-50'}`}>
                                        <p className={`text-xs font-bold whitespace-nowrap ${tranche.pause ? 'text-amber-600' : 'text-slate-600'}`}>
                                            {tranche.debut} – {tranche.fin}
                                        </p>
                                        {tranche.pause && (
                                            <p className="text-xs text-amber-500 font-semibold mt-0.5">Pause déjeuner</p>
                                        )}
                                    </td>

                                    {/* Cellules par jour */}
                                    {JOURS.map(jour => {
                                        const seance = tranche.pause ? null : getSeance(jour, tranche.id)
                                        return (
                                            <td key={jour}
                                                className={`px-2 py-2 border-r border-slate-100 last:border-r-0 align-top min-w-[130px] ${tranche.pause ? 'bg-amber-50/40' : ''
                                                    }`}>
                                                {tranche.pause ? (
                                                    <div className="h-8 flex items-center justify-center">
                                                        <span className="text-xs text-amber-400 font-medium">—</span>
                                                    </div>
                                                ) : seance ? (
                                                    <div className={`rounded-lg border px-2.5 py-2 text-xs ${STATUT_COLORS[seance.statut] ?? 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                                                        <p className="font-semibold leading-tight line-clamp-2">{seance.ue}</p>
                                                        <p className="opacity-75 mt-1 truncate">{seance.enseignant}</p>
                                                        <p className="opacity-60 truncate">{seance.salle}</p>
                                                        <div className="flex items-center justify-between mt-2 gap-1 flex-wrap">
                                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${seance.statut === 'validée' ? 'bg-emerald-200 text-emerald-800' :
                                                                    seance.statut === 'non validée' ? 'bg-rose-200 text-rose-800' :
                                                                        'bg-white/70 text-slate-600'
                                                                }`}>
                                                                {seance.statut === 'validée' ? '✓' : seance.statut === 'non validée' ? '✗' : '~'} {seance.statut}
                                                            </span>
                                                            <div className="flex gap-0.5 shrink-0">
                                                                {editable && (
                                                                    <>
                                                                        <button onClick={() => setModalForm(seance)}
                                                                            className="p-1 rounded hover:bg-black/10 transition-colors" title="Modifier">
                                                                            <Edit2 className="h-3 w-3" />
                                                                        </button>
                                                                        <button onClick={() => setConfirmSuppr(seance)}
                                                                            className="p-1 rounded hover:bg-black/10 transition-colors" title="Supprimer">
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                                {onValider && seance.statut === 'non validée' && (
                                                                    <button onClick={() => onValider(seance.id)}
                                                                        className="p-1 rounded hover:bg-black/10 transition-colors" title="Valider">
                                                                        <Check className="h-3 w-3" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : editable ? (
                                                    <button
                                                        onClick={() => setModalForm({ jour, tranche: tranche.id, ue: '', enseignant: '', salle: '', statut: 'planifiée' })}
                                                        className="w-full min-h-[80px] flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                                        <Plus className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                                                    </button>
                                                ) : (
                                                    <div className="min-h-[80px]" />
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Légende */}
            <div className="flex items-center gap-4 px-1">
                {[
                    { label: 'Planifiée', color: 'bg-blue-300' },
                    { label: 'Validée', color: 'bg-emerald-300' },
                    { label: 'Non validée', color: 'bg-rose-300' },
                ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <div className={`h-3 w-3 rounded-full ${color}`} />
                        <span className="text-xs text-slate-500">{label}</span>
                    </div>
                ))}
            </div>

            {/* Modal formulaire */}
            {modalForm && (
                <ModalForm
                    seance={modalForm.ue !== '' ? modalForm : null}
                    filiere={filiere} classe={classe}
                    onClose={() => setModalForm(null)}
                    onSave={handleSave}
                />
            )}

            {/* Confirm suppression */}
            {confirmSuppr && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                                <Trash2 className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Supprimer la séance ?</p>
                                <p className="text-xs text-slate-500 mt-0.5">{confirmSuppr.ue} — {confirmSuppr.jour}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleDelete(confirmSuppr.id)}
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