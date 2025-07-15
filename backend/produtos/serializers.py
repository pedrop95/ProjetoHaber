# PROJETOHABER/backend/produtos/serializers.py

from rest_framework import serializers
from .models import ProdutoMatPrima

class ProdutoMatPrimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoMatPrima
        fields = '__all__' # Inclui todos os campos do modelo