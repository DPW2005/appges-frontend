import FacturesLayout from '@/components/shared/FacturesLayout'

const config = {
    peutModifierTarifs: true,
    accent: { btn: 'bg-violet-600 hover:bg-violet-700' },
}

export default function SuperAdminFactures() {
    return <FacturesLayout config={config} />
}