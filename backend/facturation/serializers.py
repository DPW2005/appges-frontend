from rest_framework import serializers
from facturation.models import Facture, LigneFacture


class LigneFactureSerializer(serializers.ModelSerializer):
    class Meta:
        model = LigneFacture
        fields = '__all__'


class FactureSerializer(serializers.ModelSerializer):
    lignes = LigneFactureSerializer(many=True, read_only=True)
    enseignant_nom = serializers.CharField(source='enseignant.nom_complet', read_only=True)

    class Meta:
        model = Facture
        fields = [
            'id', 'reference', 'enseignant', 'enseignant_nom', 'trimestre', 
            'annee', 'date_emission', 'date_paiement', 'statut', 
            'montant_total', 'observations', 'generee_par', 'lignes'
        ]
        read_only_fields = [
            'id', 'reference', 'date_emission', 'montant_total', 
            'generee_par', 'enseignant_nom'
        ]
