from rest_framework import serializers
from django.contrib.auth import authenticate
from core.models import Utilisateur, TarifNiveau, Filiere, Classe, Role


class UtilisateurSerializer(serializers.ModelSerializer):
    nom_complet = serializers.ReadOnlyField()
    initiales = serializers.ReadOnlyField()
    avatar_svg = serializers.SerializerMethodField()

    class Meta:
        model = Utilisateur
        fields = [
            'id', 'matricule', 'email', 'nom', 'prenom', 'role', 
            'photo', 'telephone', 'is_active', 'is_suspended', 
            'motif_suspension', 'is_2fa_enabled', 'date_joined', 
            'last_login', 'nom_complet', 'initiales', 'avatar_svg'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'nom_complet', 'initiales', 'avatar_svg']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_avatar_svg(self, obj):
        if not obj.photo:
            return obj.get_avatar_svg()
        return None

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class TarifNiveauSerializer(serializers.ModelSerializer):
    niveau_display = serializers.CharField(source='get_niveau_display', read_only=True)

    class Meta:
        model = TarifNiveau
        fields = ['id', 'niveau', 'niveau_display', 'tarif_cours', 'tarif_td', 'tarif_tp', 'date_maj', 'modifie_par']
        read_only_fields = ['id', 'date_maj', 'modifie_par']


class ClasseSerializer(serializers.ModelSerializer):
    filiere_code = serializers.CharField(source='filiere.code', read_only=True)

    class Meta:
        model = Classe
        fields = ['id', 'filiere', 'filiere_code', 'libelle', 'niveau', 'semestre', 'effectif_max']


class FiliereSerializer(serializers.ModelSerializer):
    classes = ClasseSerializer(many=True, read_only=True)
    chef_nom = serializers.CharField(source='chef.nom_complet', read_only=True)

    class Meta:
        model = Filiere
        fields = ['id', 'code', 'libelle', 'description', 'chef', 'chef_nom', 'annee_academique', 'classes']


class LoginSerializer(serializers.Serializer):
    matricule = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        matricule = attrs.get('matricule')
        password = attrs.get('password')

        if matricule and password:
            user = authenticate(request=self.context.get('request'), matricule=matricule, password=password)
            if not user:
                raise serializers.ValidationError('Identifiants incorrects.', code='authorization')
            if user.is_suspended:
                raise serializers.ValidationError('Ce compte est suspendu.', code='authorization')
        else:
            raise serializers.ValidationError('Le matricule et le mot de passe sont obligatoires.', code='authorization')
        
        attrs['user'] = user
        return attrs


class VerifyOTPSerializer(serializers.Serializer):
    matricule = serializers.CharField(max_length=20)
    otp_code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        matricule = attrs.get('matricule')
        otp_code = attrs.get('otp_code')

        try:
            user = Utilisateur.objects.get(matricule=matricule)
        except Utilisateur.DoesNotExist:
            raise serializers.ValidationError('Utilisateur non trouvé.', code='authorization')
        
        if not user.est_otp_valide(otp_code):
            raise serializers.ValidationError('Code OTP invalide ou expiré.', code='authorization')

        attrs['user'] = user
        return attrs
