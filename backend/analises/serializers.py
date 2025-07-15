# PROJETOHABER/backend/analises/serializers.py

from rest_framework import serializers
from .models import RegistroAnalise, DetalheAnalise
from produtos.serializers import ProdutoMatPrimaSerializer # Para aninhar o produto
from elementos.serializers import ElementoQuimicoSerializer # Para aninhar o elemento

class DetalheAnaliseSerializer(serializers.ModelSerializer):
    # Exibe o nome do elemento ao invés do ID
    elemento_quimico_nome = serializers.ReadOnlyField(source='elemento_quimico.nome')
    elemento_quimico_id = serializers.ReadOnlyField(source='elemento_quimico.id') # Manter o ID para fácil manipulação no frontend

    class Meta:
        model = DetalheAnalise
        fields = '__all__'
        # extra_fields = ['elemento_quimico_nome', 'elemento_quimico_id']


class RegistroAnaliseSerializer(serializers.ModelSerializer):
    # Aninha os detalhes da análise para que venham junto com o registro
    detalhes = DetalheAnaliseSerializer(many=True, read_only=True)
    # Exibe o nome do produto/matéria-prima
    produto_mat_prima_nome = serializers.ReadOnlyField(source='produto_mat_prima.nome')
    produto_mat_prima_id_ou_op = serializers.ReadOnlyField(source='produto_mat_prima.id_ou_op')


    class Meta:
        model = RegistroAnalise
        fields = '__all__'
        # extra_fields = ['detalhes', 'produto_mat_prima_nome', 'produto_mat_prima_id_ou_op']