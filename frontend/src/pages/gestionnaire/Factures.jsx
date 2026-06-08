import FacturesLayout from '@/components/shared/FacturesLayout'

const config = {
    peutModifierTarifs: false,
    accent: { btn: 'bg-blue-600 hover:bg-blue-700' },
}

export default function GestionnaireFactures() {
    return <FacturesLayout config={config} />
}