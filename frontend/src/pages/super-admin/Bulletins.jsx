import BulletinsLayout from '@/components/shared/BulletinsLayout'

const config = {
    peutEditerNotes: true,
    accent: { btn: 'bg-violet-600 hover:bg-violet-700' },
}

export default function SuperAdminBulletins() {
    return <BulletinsLayout config={config} />
}