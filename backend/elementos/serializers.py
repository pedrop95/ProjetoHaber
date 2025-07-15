# PROJETOHABER/backend/elementos/serializers.py

from rest_framework import serializers
from .models import ElementoQuimico, ConfiguracaoAnalise

class ElementoQuimicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElementoQuimico
        fields = '__all__'

class ConfiguracaoAnaliseSerializer(serializers.ModelSerializer):
    # Para exibir os nomes ao invés dos IDs
    produto_mat_prima_nome = serializers.ReadOnlyField(source='produto_mat_prima.nome')
    elemento_quimico_nome = serializers.ReadOnlyField(source='elemento_quimico.nome')

    class Meta:
        model = ConfiguracaoAnalise
        fields = '__all__'
        # Opcional: para incluir os nomes no retorno da API sem precisar de lookup manual no frontend
        # extra_fields = ['produto_mat_prima_nome', 'elemento_quimico_nome']