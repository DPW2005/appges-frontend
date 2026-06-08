import FiliereLayout from '@/components/shared/FiliereLayout'

const config = {
    peutEditer: true,
    accent: { btn: 'bg-violet-600 hover:bg-violet-700' },
}

export default function SuperAdminFilieres() {
    return <FiliereLayout config={config} />
}