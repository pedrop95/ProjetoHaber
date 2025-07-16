# PROJETOHABER/backend/configuracoes/serializers.py

from rest_framework import serializers
from .models import ConfiguracaoAnalise

class ConfiguracaoAnaliseSerializer(serializers.ModelSerializer):
    produto_mat_prima_nome = serializers.ReadOnlyField(source='produto_mat_prima.nome')
    elemento_quimico_nome = serializers.ReadOnlyField(source='elemento_quimico.nome')

    class Meta:
        model = ConfiguracaoAnalise
        fields = '__all__'