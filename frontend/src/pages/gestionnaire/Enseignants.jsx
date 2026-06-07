import EnseignantsLayout from '@/components/shared/EnseignantsLayout'

const config = {
    titre: 'Enseignants',
    subtitle: 'Gestion complète du corps enseignant',
    peutAjouter: true,
    peutModifier: true,
    peutSupprimer: true,
    peutSuspendre: false,
    accent: { btn: 'bg-blue-600 hover:bg-blue-700' },
}

export default function GestionnaireEnseignants() {
    return <EnseignantsLayout config={config} />
}