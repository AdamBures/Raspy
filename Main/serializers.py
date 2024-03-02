from rest_framework import serializers
from rest_framework import filters
from .models import User, Project
from .permissions import IsLoggedInUserCanAccess

class FileExtensionValidator:
    def __call__(self, value):
        allowed_extension = 'rpy'
        file_extension = value.name.split('.')[-1].lower()
        
        if file_extension != allowed_extension:
            raise ValidationError(f"File type not supported. Only '{allowed_extension}' files are allowed.")

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            user = User(username=validated_data['username'], password=validated_data['password'])
            user.save()
            return user
        except:
            raise ValidationError("Wrong username or password. Check the lengths.")

    def to_representation(self, instance):
        request = self.context.get('request')
        if request and request.method == 'GET':
            return {'id': instance.id, 'username': instance.username}
        return super().to_representation(instance)

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        filter_backends = [filters.SearchFilter]
        search_fields = ['id', 'name', 'description', 'file']
        permission_classes = [IsLoggedInUserCanAccess]