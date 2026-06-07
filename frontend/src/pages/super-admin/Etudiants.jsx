import EtudiantsLayout from '@/components/shared/EtudiantsLayout'

const config = {
    titre: 'Étudiants',
    subtitle: 'Vue globale — tous les étudiants du système',
    peutAjouter: false,
    peutModifier: false,
    peutSupprimer: false,
    peutSuspendre: true,
    accent: { btn: 'bg-violet-600 hover:bg-violet-700' },
}

export default function SuperAdminEtudiants() {
    return <EtudiantsLayout config={config} />
}