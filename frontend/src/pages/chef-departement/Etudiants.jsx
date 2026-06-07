import EtudiantsLayout from '@/components/shared/EtudiantsLayout'

const config = {
    titre: 'Étudiants de ma filière',
    subtitle: 'Filière Informatique — consultation uniquement',
    filiereForcee: 'Informatique',
    peutAjouter: false,
    peutModifier: false,
    peutSupprimer: false,
    peutSuspendre: false,
}

export default function ChefDeptEtudiants() {
    return <EtudiantsLayout config={config} />
}