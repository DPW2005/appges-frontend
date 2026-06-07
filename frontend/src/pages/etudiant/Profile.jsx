import ProfilLayout from '@/components/shared/ProfilLayout'
import { GraduationCap, BookOpen } from 'lucide-react'

const config = {
    subtitle: 'Informations du compte étudiant',
    editable: false,
    user: {
        nom: 'Jean-Pierre Nkomo',
        email: 'jp.nkomo@appges.cm',
        telephone: '+237 699 321 654',
        role: 'Étudiant',
        dateCreation: '05 septembre 2024',
        initiales: 'JN',
        couleur: 'bg-amber-500',
    },
    accent: {
        badge: 'bg-amber-100 text-amber-700',
    },
    champsSup: [
        { icon: GraduationCap, label: 'Filière', value: 'Informatique' },
        { icon: BookOpen, label: 'Niveau', value: 'Licence 2' },
    ],
}

export default function EtudiantProfil() {
    return <ProfilLayout config={config} />
}