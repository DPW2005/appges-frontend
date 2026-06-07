import EnseignantsLayout from '@/components/shared/EnseignantsLayout'

const config = {
    titre: 'Enseignants',
    subtitle: 'Vue globale — tous les enseignants du système',
    peutAjouter: false,
    peutModifier: false,
    peutSupprimer: false,
    peutSuspendre: true,
    accent: { btn: 'bg-violet-600 hover:bg-violet-700' },
}

export default function SuperAdminEnseignants() {
    return <EnseignantsLayout config={config} />
}