import ProfilLayout from '@/components/shared/ProfilLayout'

const config = {
    subtitle: 'Informations du compte administrateur',
    editable: true,
    user: {
        nom: 'Administrateur Principal',
        email: 'admin@appges.cm',
        telephone: '+237 699 000 001',
        role: 'Super Administrateur',
        dateCreation: '01 septembre 2023',
        initiales: 'AP',
        couleur: 'bg-violet-600',
    },
    accent: {
        btn: 'bg-violet-600 hover:bg-violet-700',
        text: 'text-violet-600 hover:text-violet-700',
        border: 'border-violet-300 focus:border-violet-500',
        ring: 'focus:border-violet-400 focus:ring-violet-100',
        badge: 'bg-violet-100 text-violet-700',
    },
    champsSup: [],
}

export default function SuperAdminProfil() {
    return <ProfilLayout config={config} />
}