import ProfilLayout from '@/components/shared/ProfilLayout'
import { BookOpen } from 'lucide-react'

const config = {
    subtitle: 'Informations du responsable de filière',
    editable: true,
    user: {
        nom: 'Dr. Martin Essomba',
        email: 'm.essomba@appges.cm',
        telephone: '+237 691 456 789',
        role: 'Chef de Département',
        dateCreation: '10 septembre 2023',
        initiales: 'ME',
        couleur: 'bg-cyan-600',
    },
    accent: {
        btn: 'bg-cyan-600 hover:bg-cyan-700',
        text: 'text-cyan-600 hover:text-cyan-700',
        border: 'border-cyan-300 focus:border-cyan-500',
        ring: 'focus:border-cyan-400 focus:ring-cyan-100',
        badge: 'bg-cyan-100 text-cyan-700',
    },
    champsSup: [
        { icon: BookOpen, label: 'Filière supervisée', value: 'Informatique' },
    ],
}

export default function ChefDeptProfil() {
    return <ProfilLayout config={config} />
}