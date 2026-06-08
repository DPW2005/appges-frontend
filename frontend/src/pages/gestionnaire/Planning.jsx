import { useState } from 'react'
import PlanningLayout from '@/components/shared/PlanningLayout'
import { PLANNING_DATA } from '@/data/PlanningData'

const FILIERES = Object.keys(PLANNING_DATA)
const NIVEAUX = ['L1', 'L2', 'L3']

export default function GestionnairePlanning() {
    const [filiere, setFiliere] = useState('Informatique')
    const [classe, setClasse] = useState('L1')
    const [data, setData] = useState(PLANNING_DATA)

    function handleSave(form) {
        setData(prev => {
            const seances = prev[filiere][classe]
            const existe = seances.find(s => s.id === form.id)
            return {
                ...prev,
                [filiere]: {
                    ...prev[filiere],
                    [classe]: existe
                        ? seances.map(s => s.id === form.id ? form : s)
                        : [...seances, form],
                },
            }
        })
    }

    function handleDelete(id) {
        setData(prev => ({
            ...prev,
            [filiere]: {
                ...prev[filiere],
                [classe]: prev[filiere][classe].filter(s => s.id !== id),
            },
        }))
    }

    const seances = data[filiere]?.[classe] ?? []

    return (
        <div className="p-6 space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Planning</h1>
                <p className="text-sm text-slate-500 mt-1">Gestion des emplois du temps — cliquez sur + pour ajouter</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                    {FILIERES.map(f => (
                        <button key={f} onClick={() => { setFiliere(f); setClasse('L1') }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filiere === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}>
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                    {NIVEAUX.map(n => (
                        <button key={n} onClick={() => setClasse(n)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${classe === n ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}>
                            {n}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-slate-400 ml-1">
                    {seances.length} séance{seances.length > 1 ? 's' : ''} — {filiere} {classe}
                </span>
            </div>

            <PlanningLayout
                filiere={filiere} classe={classe}
                seances={seances}
                editable={true}
                headerColor="bg-blue-800"
                headerBorder="border-blue-700"
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </div>
    )
}