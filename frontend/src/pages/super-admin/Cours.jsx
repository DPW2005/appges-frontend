import CoursLayout from '@/components/shared/CoursLayout'

const config = {
    titre: 'Cours / UE',
    subtitle: 'Vue globale — toutes les unités d\'enseignement',
    peutAjouter: true,
    peutModifier: true,
    peutSupprimer: true,
    accent: { btn: 'bg-violet-600 hover:bg-violet-700' },
}

export default function SuperAdminCours() {
    return <CoursLayout config={config} />
}