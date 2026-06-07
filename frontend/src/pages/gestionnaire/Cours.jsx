import CoursLayout from '@/components/shared/CoursLayout'

const config = {
    titre: 'Cours / UE',
    subtitle: 'Gestion complète des unités d\'enseignement',
    peutAjouter: false,
    peutModifier: false,
    peutSupprimer: false,
    accent: { btn: 'bg-emerald-600 hover:bg-emerald-700' },
}

export default function GestionnaireCours() {
    return <CoursLayout config={config} />
}