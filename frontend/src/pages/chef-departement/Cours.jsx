import CoursLayout from '@/components/shared/CoursLayout'

const config = {
    titre: 'UE / Cours de ma filière',
    subtitle: 'Filière Informatique — consultation uniquement',
    filiereForcee: 'Informatique',
    peutAjouter: false,
    peutModifier: false,
    peutSupprimer: false,
}

export default function ChefDeptCours() {
    return <CoursLayout config={config} />
}