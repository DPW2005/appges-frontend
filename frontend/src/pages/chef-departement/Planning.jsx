import { useState } from 'react'
import PlanningLayout from '@/components/shared/PlanningLayout'
import { PLANNING_DATA } from '@/data/PlanningData'

const NIVEAUX = ['L1', 'L2', 'L3']
const FILIERE = 'Informatique'

export default function ChefDeptPlanning() {
    const [classe, setClasse] = useState('L1')
    const seances = PLANNING_DATA[FILIERE]?.[classe] ?? []

    return (
        <div className="p-6 space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Planning de la filière</h1>
                <p className="text-sm text-slate-500 mt-1">Filière Informatique — Consultation uniquement</p>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                    {NIVEAUX.map(n => (
                        <button key={n} onClick={() => setClasse(n)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${classe === n ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}>
                            {n}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-slate-400 ml-1">
                    {seances.length} séance{seances.length > 1 ? 's' : ''} — Informatique {classe}
                </span>
            </div>

            <PlanningLayout
                filiere={FILIERE} classe={classe}
                seances={seances}
                editable={false}
                headerColor="bg-cyan-800"
                headerBorder="border-cyan-700"
            />
        </div>
    )
}