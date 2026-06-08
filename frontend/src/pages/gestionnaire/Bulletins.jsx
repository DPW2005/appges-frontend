import BulletinsLayout from '@/components/shared/BulletinsLayout'

const config = {
    peutEditerNotes: false,
    accent: { btn: 'bg-blue-600 hover:bg-blue-700' },
}

export default function GestionnaireBulletins() {
    return <BulletinsLayout config={config} />
}