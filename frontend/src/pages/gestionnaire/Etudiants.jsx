import EtudiantsLayout from '@/components/shared/EtudiantsLayout'

const config = {
    titre: 'Étudiants',
    subtitle: 'Gestion complète des étudiants inscrits',
    peutAjouter: true,
    peutModifier: true,
    peutSupprimer: true,
    peutSuspendre: false,
    accent: { btn: 'bg-blue-600 hover:bg-blue-700' },
}

export default function GestionnaireEtudiants() {
    return <EtudiantsLayout config={config} />
}