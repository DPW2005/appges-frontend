export const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export const TRANCHES = [
    { id: 'T1', debut: '08h00', fin: '10h00', pause: false },
    { id: 'T2', debut: '10h00', fin: '12h00', pause: false },
    { id: 'T3', debut: '12h00', fin: '13h00', pause: true },
    { id: 'T4', debut: '13h00', fin: '15h00', pause: false },
    { id: 'T5', debut: '15h00', fin: '17h00', pause: false },
]

export const PLANNING_DATA = {
    'Informatique': {
        'L1': [
            { id: 1, jour: 'Lundi', tranche: 'T1', ue: 'Introduction à la prog.', enseignant: 'Mme Claire Ateba', salle: 'Salle B04', statut: 'planifiée' },
            { id: 2, jour: 'Lundi', tranche: 'T4', ue: 'Mathématiques L1', enseignant: 'Mme Claire Ateba', salle: 'Salle C02', statut: 'planifiée' },
            { id: 3, jour: 'Mardi', tranche: 'T2', ue: 'Anglais technique', enseignant: 'Mme Sophie Biya', salle: 'Salle B02', statut: 'validée' },
            { id: 4, jour: 'Mercredi', tranche: 'T1', ue: 'Introduction à la prog.', enseignant: 'Mme Claire Ateba', salle: 'Salle B04', statut: 'planifiée' },
            { id: 5, jour: 'Jeudi', tranche: 'T4', ue: 'Mathématiques L1', enseignant: 'Mme Claire Ateba', salle: 'Salle C02', statut: 'planifiée' },
            { id: 6, jour: 'Vendredi', tranche: 'T2', ue: 'Anglais technique', enseignant: 'Mme Sophie Biya', salle: 'Salle B02', statut: 'non validée' },
        ],
        'L2': [
            { id: 7, jour: 'Lundi', tranche: 'T1', ue: 'Algorithmique avancée', enseignant: 'Dr. Paul Mbarga', salle: 'Salle A12', statut: 'planifiée' },
            { id: 8, jour: 'Lundi', tranche: 'T4', ue: 'Bases de données', enseignant: 'M. Serge Nkomo', salle: 'Salle A08', statut: 'validée' },
            { id: 9, jour: 'Mardi', tranche: 'T1', ue: 'Mathématiques L2', enseignant: 'Mme Claire Ateba', salle: 'Salle C02', statut: 'planifiée' },
            { id: 10, jour: 'Mercredi', tranche: 'T2', ue: "Systèmes d'exploitation", enseignant: 'Dr. René Ondoa', salle: 'Labo Info', statut: 'planifiée' },
            { id: 11, jour: 'Jeudi', tranche: 'T1', ue: 'Algorithmique avancée', enseignant: 'Dr. Paul Mbarga', salle: 'Salle A12', statut: 'validée' },
            { id: 12, jour: 'Vendredi', tranche: 'T4', ue: 'Bases de données', enseignant: 'M. Serge Nkomo', salle: 'Salle A08', statut: 'planifiée' },
        ],
        'L3': [
            { id: 13, jour: 'Lundi', tranche: 'T2', ue: 'Réseaux informatiques', enseignant: 'Dr. Hélène Owona', salle: 'Labo Info', statut: 'planifiée' },
            { id: 14, jour: 'Mardi', tranche: 'T4', ue: 'Projet tutoré', enseignant: 'Dr. Paul Mbarga', salle: 'Labo Info', statut: 'planifiée' },
            { id: 15, jour: 'Mercredi', tranche: 'T1', ue: 'Réseaux informatiques', enseignant: 'Dr. Hélène Owona', salle: 'Labo Info', statut: 'validée' },
            { id: 16, jour: 'Jeudi', tranche: 'T2', ue: 'Projet tutoré', enseignant: 'Dr. Paul Mbarga', salle: 'Labo Info', statut: 'non validée' },
            { id: 17, jour: 'Vendredi', tranche: 'T1', ue: 'Réseaux informatiques', enseignant: 'Dr. Hélène Owona', salle: 'Labo Info', statut: 'planifiée' },
        ],
    },
    'Gestion': {
        'L1': [
            { id: 18, jour: 'Lundi', tranche: 'T1', ue: 'Comptabilité générale', enseignant: 'M. Bertrand Foe', salle: 'Salle D01', statut: 'planifiée' },
            { id: 19, jour: 'Mardi', tranche: 'T4', ue: 'Droit des affaires', enseignant: 'Dr. Jules Minkang', salle: 'Salle D03', statut: 'validée' },
            { id: 20, jour: 'Jeudi', tranche: 'T1', ue: 'Comptabilité générale', enseignant: 'M. Bertrand Foe', salle: 'Salle D01', statut: 'planifiée' },
        ],
        'L2': [
            { id: 21, jour: 'Lundi', tranche: 'T2', ue: "Finance d'entreprise", enseignant: 'Mme Nadine Essama', salle: 'Salle D02', statut: 'planifiée' },
            { id: 22, jour: 'Mercredi', tranche: 'T4', ue: "Finance d'entreprise", enseignant: 'Mme Nadine Essama', salle: 'Salle D02', statut: 'non validée' },
            { id: 23, jour: 'Vendredi', tranche: 'T1', ue: 'Fiscalité de base', enseignant: 'M. Alain Nguema', salle: 'Salle D04', statut: 'planifiée' },
        ],
        'L3': [
            { id: 24, jour: 'Mardi', tranche: 'T1', ue: "Stratégie d'entreprise", enseignant: 'M. Bertrand Foe', salle: 'Salle D05', statut: 'planifiée' },
            { id: 25, jour: 'Jeudi', tranche: 'T4', ue: 'Management avancé', enseignant: 'Mme Nadine Essama', salle: 'Salle D02', statut: 'validée' },
        ],
    },
    'Comptabilité': {
        'L1': [
            { id: 26, jour: 'Lundi', tranche: 'T1', ue: 'Fiscalité de base', enseignant: 'M. Alain Nguema', salle: 'Salle E01', statut: 'planifiée' },
            { id: 27, jour: 'Mercredi', tranche: 'T2', ue: 'Comptabilité générale', enseignant: 'M. Bertrand Foe', salle: 'Salle E02', statut: 'validée' },
            { id: 28, jour: 'Vendredi', tranche: 'T4', ue: 'Fiscalité de base', enseignant: 'M. Alain Nguema', salle: 'Salle E01', statut: 'planifiée' },
        ],
        'L2': [
            { id: 29, jour: 'Mardi', tranche: 'T1', ue: 'Droit des affaires', enseignant: 'Dr. Jules Minkang', salle: 'Salle E03', statut: 'planifiée' },
            { id: 30, jour: 'Jeudi', tranche: 'T2', ue: 'Audit et contrôle', enseignant: 'M. Alain Nguema', salle: 'Salle E04', statut: 'non validée' },
        ],
        'L3': [
            { id: 31, jour: 'Lundi', tranche: 'T4', ue: 'Expertise comptable', enseignant: 'Dr. Jules Minkang', salle: 'Salle E05', statut: 'planifiée' },
            { id: 32, jour: 'Mercredi', tranche: 'T1', ue: 'Consolidation des comptes', enseignant: 'M. Alain Nguema', salle: 'Salle E04', statut: 'validée' },
        ],
    },
}