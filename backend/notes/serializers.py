from rest_framework import serializers
from notes.models import EvaluationUE, Note, Bulletin


class EvaluationUESerializer(serializers.ModelSerializer):
    ue_code = serializers.CharField(source='ue.code', read_only=True)

    class Meta:
        model = EvaluationUE
        fields = '__all__'


class NoteSerializer(serializers.ModelSerializer):
    etudiant_nom = serializers.CharField(source='etudiant.nom_complet', read_only=True)
    evaluation_libelle = serializers.CharField(source='evaluation.libelle', read_only=True)

    class Meta:
        model = Note
        fields = [
            'id', 'etudiant', 'etudiant_nom', 'evaluation', 'evaluation_libelle',
            'valeur', 'absent', 'observations', 'saisie_par', 'date_saisie', 'date_modif'
        ]
        read_only_fields = ['id', 'saisie_par', 'date_saisie', 'date_modif']


class BulletinSerializer(serializers.ModelSerializer):
    etudiant_nom = serializers.CharField(source='etudiant.nom_complet', read_only=True)
    classe_libelle = serializers.CharField(source='classe.libelle', read_only=True)

    class Meta:
        model = Bulletin
        fields = [
            'id', 'etudiant', 'etudiant_nom', 'classe', 'classe_libelle',
            'trimestre', 'annee', 'moyenne_generale', 'rang', 'mention',
            'appreciations', 'publie', 'date_generation'
        ]
        read_only_fields = [
            'id', 'moyenne_generale', 'rang', 'mention', 'date_generation'
        ]
