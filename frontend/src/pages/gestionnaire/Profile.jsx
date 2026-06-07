import ProfilLayout from '@/components/shared/ProfilLayout'

const config = {
    subtitle: 'Informations du compte gestionnaire',
    editable: true,
    user: {
        nom: 'Alice Fouda',
        email: 'alice.fouda@appges.cm',
        telephone: '+237 677 123 456',
        role: 'Gestionnaire',
        dateCreation: '15 octobre 2023',
        initiales: 'AF',
        couleur: 'bg-blue-600',
    },
    accent: {
        btn: 'bg-blue-600 hover:bg-blue-700',
        text: 'text-blue-600 hover:text-blue-700',
        border: 'border-blue-300 focus:border-blue-500',
        ring: 'focus:border-blue-400 focus:ring-blue-100',
        badge: 'bg-blue-100 text-blue-700',
    },
    champsSup: [],
}

export default function GestionnaireProfil() {
    return <ProfilLayout config={config} />
}