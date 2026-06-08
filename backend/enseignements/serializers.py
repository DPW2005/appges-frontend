from rest_framework import serializers
from django.utils import timezone
from enseignements.models import UniteEnseignement, Salle, Seance
from core.models import Utilisateur, Classe


class UniteEnseignementSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniteEnseignement
        fields = '__all__'


class SalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salle
        fields = '__all__'


class SeanceSerializer(serializers.ModelSerializer):
    montant_brut = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Seance
        fields = [
            'id', 'ue', 'enseignant', 'classe', 'salle', 'type_seance', 
            'date_heure_debut', 'date_heure_fin', 'duree_heures', 
            'est_validee', 'validee_par', 'date_validation', 'observations',
            'montant_brut'
        ]
        read_only_fields = [
            'id', 'duree_heures', 'est_validee', 'validee_par', 
            'date_validation', 'montant_brut'
        ]

    def validate(self, attrs):
        debut = attrs.get('date_heure_debut')
        fin = attrs.get('date_heure_fin')
        
        # S'il s'agit d'une mise à jour, on prend les valeurs de l'instance si non fournies
        if self.instance:
            debut = debut or self.instance.date_heure_debut
            fin = fin or self.instance.date_heure_fin

        if debut and fin and fin <= debut:
            raise serializers.ValidationError({"date_heure_fin": "La date de fin doit être postérieure à la date de début."})

        # Détection de conflits de salle et enseignant
        salle = attrs.get('salle') or (self.instance.salle if self.instance else None)
        enseignant = attrs.get('enseignant') or (self.instance.enseignant if self.instance else None)

        query = Seance.objects.filter(
            date_heure_debut__lt=fin,
            date_heure_fin__gt=debut
        )
        if self.instance:
            query = query.exclude(pk=self.instance.pk)

        conflits = []
        if salle and query.filter(salle=salle).exists():
            conflits.append("La salle est déjà occupée sur ce créneau.")
        if enseignant and query.filter(enseignant=enseignant).exists():
            conflits.append("L'enseignant a déjà une séance prévue sur ce créneau.")
        
        if conflits:
            raise serializers.ValidationError({"conflits": conflits})

        return attrs
