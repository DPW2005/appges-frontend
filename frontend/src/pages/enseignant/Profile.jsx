import ProfilLayout from '@/components/shared/ProfilLayout'
import { BookOpen } from 'lucide-react'

const config = {
    subtitle: 'Informations du compte enseignant',
    editable: false,
    user: {
        nom: 'Dr. Paul Mbarga',
        email: 'p.mbarga@appges.cm',
        telephone: '+237 655 789 012',
        role: 'Enseignant',
        dateCreation: '20 septembre 2023',
        initiales: 'PM',
        couleur: 'bg-emerald-600',
    },
    accent: {
        badge: 'bg-emerald-100 text-emerald-700',
    },
    champsSup: [
        { icon: BookOpen, label: 'Spécialité', value: 'Informatique — Algorithmique' },
    ],
}

export default function EnseignantProfil() {
    return <ProfilLayout config={config} />
}