# PROJETOHABER/backend/analises/serializers.py

from rest_framework import serializers
from .models import RegistroAnalise, DetalheAnalise
# O serializer em si não precisa de import específico para ConfiguraçãoAnalise aqui.
# Apenas o frontend precisará buscar esses dados separadamente.

class DetalheAnaliseSerializer(serializers.ModelSerializer):
    elemento_quimico_nome = serializers.ReadOnlyField(source='elemento_quimico.nome')

    class Meta:
        model = DetalheAnalise
        # Inclui todos os campos, incluindo os novos massa_pesada e absorbancia_medida
        fields = '__all__'

class RegistroAnaliseSerializer(serializers.ModelSerializer):
    produto_mat_prima_nome = serializers.ReadOnlyField(source='produto_mat_prima.nome')
    produto_mat_prima_id_ou_op = serializers.ReadOnlyField(source='produto_mat_prima.id_ou_op')

    # Este campo aninhado permite que o frontend envie/receba uma lista de DetalheAnalise
    detalhes = DetalheAnaliseSerializer(many=True, required=False)

    class Meta:
        model = RegistroAnalise
        # Inclui todos os campos do RegistroAnalise, incluindo os novos
        fields = '__all__'

    def create(self, validated_data):
        detalhes_data = validated_data.pop('detalhes', [])
        registro_analise = RegistroAnalise.objects.create(**validated_data)
        for detalhe_data in detalhes_data:
            DetalheAnalise.objects.create(registro_analise=registro_analise, **detalhe_data)
        return registro_analise

    def update(self, instance, validated_data):
        detalhes_data = validated_data.pop('detalhes', [])

        # Atualiza os campos da instância principal de RegistroAnalise
        instance.produto_mat_prima = validated_data.get('produto_mat_prima', instance.produto_mat_prima)
        instance.data_analise = validated_data.get('data_analise', instance.data_analise)
        instance.data_producao = validated_data.get('data_producao', instance.data_producao) # NOVO CAMPO
        instance.data_validade = validated_data.get('data_validade', instance.data_validade) # NOVO CAMPO
        instance.lote = validated_data.get('lote', instance.lote)
        instance.nota_fiscal = validated_data.get('nota_fiscal', instance.nota_fiscal)
        instance.fornecedor = validated_data.get('fornecedor', instance.fornecedor) # NOVO CAMPO
        instance.save()

        # Lógica de atualização para DetalheAnalise:
        # 1. Obter os IDs dos detalhes existentes que foram enviados na requisição
        detalhe_ids_present_in_request = [d.get('id') for d in detalhes_data if 'id' in d]

        # 2. Excluir detalhes antigos que NÃO foram enviados na requisição (ou seja, foram removidos pelo usuário ou substituídos)
        DetalheAnalise.objects.filter(registro_analise=instance).exclude(id__in=detalhe_ids_present_in_request).delete()

        # 3. Iterar sobre os detalhes enviados na requisição (que agora são os que queremos manter/criar)
        for detalhe_data in detalhes_data:
            detalhe_id = detalhe_data.get('id', None)
            if detalhe_id:
                # Se o detalhe tem um ID, tente atualizá-lo
                try:
                    detalhe_instance = DetalheAnalise.objects.get(id=detalhe_id, registro_analise=instance)
                    # Atualiza os campos do detalhe existente
                    detalhe_instance.elemento_quimico = detalhe_data.get('elemento_quimico', detalhe_instance.elemento_quimico)
                    detalhe_instance.resultado = detalhe_data.get('resultado', detalhe_instance.resultado)
                    detalhe_instance.massa_pesada = detalhe_data.get('massa_pesada', detalhe_instance.massa_pesada) # NOVO CAMPO
                    detalhe_instance.absorbancia_medida = detalhe_data.get('absorbancia_medida', detalhe_instance.absorbancia_medida) # NOVO CAMPO
                    detalhe_instance.save()
                except DetalheAnalise.DoesNotExist:
                    # Este caso é improvável se a lógica de `exclude` acima estiver correta,
                    # mas serve como um fallback para criar um detalhe se ele de alguma forma não existir.
                    DetalheAnalise.objects.create(registro_analise=instance, **detalhe_data)
            else:
                # Se o detalhe NÃO tem um ID, é um novo detalhe, então crie-o
                DetalheAnalise.objects.create(registro_analise=instance, **detalhe_data)

        return instance