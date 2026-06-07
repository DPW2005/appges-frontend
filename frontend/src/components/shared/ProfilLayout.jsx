import { useState } from 'react'
import { User, Mail, Phone, Shield, Calendar, Edit2, Lock, Check, X, BookOpen, GraduationCap } from 'lucide-react'

export default function ProfilLayout({ config }) {
    const {
        user, accent, subtitle, editable = false,
        champsSup = [], // champs additionnels fixes (non éditables)
    } = config

    const [editMode, setEditMode] = useState(false)
    const [mdpMode, setMdpMode] = useState(false)
    const [form, setForm] = useState({
        nom: user.nom, email: user.email, telephone: user.telephone
    })
    const [mdp, setMdp] = useState({ actuel: '', nouveau: '', confirmer: '' })
    const [saved, setSaved] = useState(false)

    function handleSave() {
        setEditMode(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }
    function handleMdpSave() {
        setMdpMode(false)
        setMdp({ actuel: '', nouveau: '', confirmer: '' })
    }

    return (
        <div className="p-6 max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mon profil</h1>
                <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            </div>

            {/* Carte identité */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-6">
                <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${user.couleur} text-white text-2xl font-bold shadow-md select-none`}>
                    {user.initiales}
                </div>
                <div className="flex-1">
                    <p className="text-xl font-bold text-slate-800">{editMode ? form.nom : user.nom}</p>
                    <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${accent.badge}`}>
                        {user.role}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">Membre depuis le {user.dateCreation}</p>
                </div>
                {saved && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <Check className="h-3.5 w-3.5" /> Enregistré
                    </span>
                )}
            </div>

            {/* Infos personnelles */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-700">Informations personnelles</h2>
                    {editable && !editMode && (
                        <button onClick={() => setEditMode(true)}
                            className={`flex items-center gap-1.5 text-xs font-medium ${accent.text} transition-colors`}>
                            <Edit2 className="h-3.5 w-3.5" /> Modifier
                        </button>
                    )}
                    {editable && editMode && (
                        <div className="flex gap-2">
                            <button onClick={handleSave}
                                className={`flex items-center gap-1.5 text-xs font-medium ${accent.btn} text-white px-3 py-1.5 rounded-lg transition-colors`}>
                                <Check className="h-3.5 w-3.5" /> Enregistrer
                            </button>
                            <button onClick={() => setEditMode(false)}
                                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                                <X className="h-3.5 w-3.5" /> Annuler
                            </button>
                        </div>
                    )}
                </div>

                <div className="divide-y divide-slate-50">
                    {/* Champs éditables */}
                    {[
                        { icon: User, label: 'Nom complet', field: 'nom' },
                        { icon: Mail, label: 'Email', field: 'email' },
                        { icon: Phone, label: 'Téléphone', field: 'telephone' },
                    ].map(({ icon: Icon, label, field }) => (
                        <div key={field} className="flex items-center gap-4 px-5 py-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                                <Icon className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-400">{label}</p>
                                {editable && editMode ? (
                                    <input
                                        value={form[field]}
                                        onChange={e => setForm({ ...form, [field]: e.target.value })}
                                        className={`mt-0.5 w-full text-sm font-medium text-slate-800 border-b ${accent.border} focus:outline-none bg-transparent pb-0.5`}
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-slate-800">{form[field]}</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Champ Rôle (toujours fixe) */}
                    <div className="flex items-center gap-4 px-5 py-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                            <Shield className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Rôle</p>
                            <p className="text-sm font-medium text-slate-800">{user.role}</p>
                        </div>
                    </div>

                    {/* Champs supplémentaires spécifiques au rôle */}
                    {champsSup.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-4 px-5 py-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                                <Icon className="h-4 w-4 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">{label}</p>
                                <p className="text-sm font-medium text-slate-800">{value}</p>
                            </div>
                        </div>
                    ))}

                    {/* Date création */}
                    <div className="flex items-center gap-4 px-5 py-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                            <Calendar className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Compte créé le</p>
                            <p className="text-sm font-medium text-slate-800">{user.dateCreation}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mot de passe — uniquement si editable */}
            {editable && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-slate-400" />
                            <h2 className="text-sm font-semibold text-slate-700">Mot de passe</h2>
                        </div>
                        {!mdpMode && (
                            <button onClick={() => setMdpMode(true)}
                                className={`text-xs font-medium ${accent.text} transition-colors`}>
                                Changer
                            </button>
                        )}
                    </div>
                    {!mdpMode ? (
                        <p className="px-5 py-4 text-sm text-slate-400 tracking-widest">••••••••••••</p>
                    ) : (
                        <div className="px-5 py-4 space-y-3">
                            {[
                                { label: 'Mot de passe actuel', field: 'actuel' },
                                { label: 'Nouveau mot de passe', field: 'nouveau' },
                                { label: 'Confirmer le nouveau', field: 'confirmer' },
                            ].map(({ label, field }) => (
                                <div key={field}>
                                    <label className="text-xs text-slate-500 mb-1 block">{label}</label>
                                    <input type="password" value={mdp[field]}
                                        onChange={e => setMdp({ ...mdp, [field]: e.target.value })}
                                        className={`w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none ${accent.ring} focus:ring-1`}
                                    />
                                </div>
                            ))}
                            <div className="flex gap-2 pt-1">
                                <button onClick={handleMdpSave}
                                    className={`flex items-center gap-1.5 text-xs font-medium ${accent.btn} text-white px-4 py-2 rounded-lg transition-colors`}>
                                    <Check className="h-3.5 w-3.5" /> Confirmer
                                </button>
                                <button onClick={() => setMdpMode(false)}
                                    className="text-xs font-medium text-slate-500 hover:text-slate-700 px-4 py-2 rounded-lg border border-slate-200 transition-colors">
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}