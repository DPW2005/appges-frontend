import EnseignantsLayout from '@/components/shared/EnseignantsLayout'

const config = {
    titre: 'Enseignants de ma filière',
    subtitle: 'Filière Informatique — consultation uniquement',
    filiereForcee: 'Informatique',
    peutAjouter: false,
    peutModifier: false,
    peutSupprimer: false,
    peutSuspendre: false,
}

export default function ChefDeptEnseignants() {
    return <EnseignantsLayout config={config} />
}