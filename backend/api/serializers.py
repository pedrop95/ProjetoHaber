# PROJETOHABER/backend/api/serializers.py

from rest_framework import serializers
from .models import ProdutoMatPrima, ElementoQuimico, ConfiguracaoAnalise, RegistroAnalise, DetalheAnalise, ConfiguracaoElementoDetalhe

class ProdutoMatPrimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoMatPrima
        fields = '__all__'

class ElementoQuimicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElementoQuimico
        fields = '__all__'

# NOVO SERIALIZER PARA O DETALHE DO ELEMENTO NA CONFIGURAÇÃO
class ConfiguracaoElementoDetalheSerializer(serializers.ModelSerializer):
    elemento_quimico_nome = serializers.CharField(source='elemento_quimico.nome', read_only=True)
    elemento_quimico_simbolo = serializers.CharField(source='elemento_quimico.simbolo', read_only=True)

    class Meta:
        model = ConfiguracaoElementoDetalhe
        fields = [
            'id', 'elemento_quimico', 'elemento_quimico_nome', 'elemento_quimico_simbolo',
            'diluicao1_X', 'diluicao1_Y', 'diluicao2_X', 'diluicao2_Y',
            'limite_min', 'limite_max'
        ]
        # 'configuracao_analise' não é incluído aqui, pois será manipulado pelo serializador pai

# SERIALIZER DE CONFIGURACAO DE ANALISE ATUALIZADO
class ConfiguracaoAnaliseSerializer(serializers.ModelSerializer):
    produto_mat_prima_nome = serializers.CharField(source='produto_mat_prima.nome', read_only=True)
    produto_mat_prima_id_ou_op = serializers.CharField(source='produto_mat_prima.id_ou_op', read_only=True)
    
    # Nested serializer para os detalhes dos elementos
    detalhes_elementos = ConfiguracaoElementoDetalheSerializer(many=True, read_only=False)

    class Meta:
        model = ConfiguracaoAnalise
        fields = [
            'id', 'produto_mat_prima', 'produto_mat_prima_nome', 'produto_mat_prima_id_ou_op',
            'detalhes_elementos'
        ]

    # Sobrescreve create e update para lidar com os detalhes aninhados
    def create(self, validated_data):
        detalhes_elementos_data = validated_data.pop('detalhes_elementos')
        configuracao_analise = ConfiguracaoAnalise.objects.create(**validated_data)
        for detalhe_data in detalhes_elementos_data:
            ConfiguracaoElementoDetalhe.objects.create(configuracao_analise=configuracao_analise, **detalhe_data)
        return configuracao_analise

    def update(self, instance, validated_data):
        detalhes_elementos_data = validated_data.pop('detalhes_elementos')
        
        # Atualiza campos da instância principal
        instance.produto_mat_prima = validated_data.get('produto_mat_prima', instance.produto_mat_prima)
        instance.save()

        # Lógica para atualizar/criar/deletar os detalhes dos elementos
        # 1. Obter IDs dos detalhes existentes
        existing_detalhe_ids = [d.id for d in instance.detalhes_elementos.all()]
        # 2. Obter IDs dos detalhes enviados na requisição (se houver id, significa que já existe)
        incoming_detalhe_ids = [d.get('id') for d in detalhes_elementos_data if d.get('id')]

        # 3. Remover detalhes que não foram enviados na requisição
        for detalhe_id in set(existing_detalhe_ids) - set(incoming_detalhe_ids):
            ConfiguracaoElementoDetalhe.objects.filter(id=detalhe_id).delete()

        # 4. Criar ou atualizar detalhes
        for detalhe_data in detalhes_elementos_data:
            detalhe_id = detalhe_data.get('id', None)
            if detalhe_id: # Se tem ID, é uma atualização
                detalhe = ConfiguracaoElementoDetalhe.objects.get(id=detalhe_id, configuracao_analise=instance)
                for key, value in detalhe_data.items():
                    setattr(detalhe, key, value)
                detalhe.save()
            else: # Se não tem ID, é uma criação
                ConfiguracaoElementoDetalhe.objects.create(configuracao_analise=instance, **detalhe_data)
        
        return instance

# SERIALIZADOR DE DETALHE DE ANALISE ATUALIZADO
class DetalheAnaliseSerializer(serializers.ModelSerializer):
    # Campos para exibir informações do elemento químico e produto
    # Agora vêm do ConfiguracaoElementoDetalhe
    configuracao_elemento_detalhe_elemento_quimico_nome = serializers.CharField(source='configuracao_elemento_detalhe.elemento_quimico.nome', read_only=True)
    configuracao_elemento_detalhe_elemento_quimico_simbolo = serializers.CharField(source='configuracao_elemento_detalhe.elemento_quimico.simbolo', read_only=True)
    
    # Campos de diluição e limite também vêm do ConfiguracaoElementoDetalhe
    diluicao1_X = serializers.DecimalField(source='configuracao_elemento_detalhe.diluicao1_X', max_digits=10, decimal_places=4, read_only=True)
    diluicao1_Y = serializers.DecimalField(source='configuracao_elemento_detalhe.diluicao1_Y', max_digits=10, decimal_places=4, read_only=True)
    diluicao2_X = serializers.DecimalField(source='configuracao_elemento_detalhe.diluicao2_X', max_digits=10, decimal_places=4, read_only=True)
    diluicao2_Y = serializers.DecimalField(source='configuracao_elemento_detalhe.diluicao2_Y', max_digits=10, decimal_places=4, read_only=True)
    limite_min = serializers.DecimalField(source='configuracao_elemento_detalhe.limite_min', max_digits=10, decimal_places=4, read_only=True)
    limite_max = serializers.DecimalField(source='configuracao_elemento_detalhe.limite_max', max_digits=10, decimal_places=4, read_only=True)


    class Meta:
        model = DetalheAnalise
        fields = [
            'id', 'configuracao_elemento_detalhe', 
            'configuracao_elemento_detalhe_elemento_quimico_nome',
            'configuracao_elemento_detalhe_elemento_quimico_simbolo',
            'diluicao1_X', 'diluicao1_Y', 'diluicao2_X', 'diluicao2_Y',
            'limite_min', 'limite_max',
            'massa_pesada', 'absorbancia_medida', 'resultado'
        ]

class RegistroAnaliseSerializer(serializers.ModelSerializer):
    produto_nome = serializers.CharField(source='produto_mat_prima.nome', read_only=True)
    produto_id_ou_op = serializers.CharField(source='produto_mat_prima.id_ou_op', read_only=True)
    detalhes = DetalheAnaliseSerializer(many=True, read_only=False) # nested serializer para detalhes

    class Meta:
        model = RegistroAnalise
        fields = [
            'id', 'produto_mat_prima', 'produto_nome', 'produto_id_ou_op',
            'data_analise', 'analista', 'status', 'detalhes'
        ]

    def create(self, validated_data):
        detalhes_data = validated_data.pop('detalhes')
        registro_analise = RegistroAnalise.objects.create(**validated_data)
        for detalhe_data in detalhes_data:
            DetalheAnalise.objects.create(registro_analise=registro_analise, **detalhe_data)
        return registro_analise

    def update(self, instance, validated_data):
        detalhes_data = validated_data.pop('detalhes')
        
        # Atualiza campos da instância principal
        instance.produto_mat_prima = validated_data.get('produto_mat_prima', instance.produto_mat_prima)
        instance.data_analise = validated_data.get('data_analise', instance.data_analise)
        instance.analista = validated_data.get('analista', instance.analista)
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        # Lógica para atualizar/criar/deletar DetalhesAnalise
        # 1. Obter IDs dos detalhes existentes
        existing_detalhe_ids = [d.id for d in instance.detalhes.all()]
        # 2. Obter IDs dos detalhes enviados na requisição (se houver id, significa que já existe)
        incoming_detalhe_ids = [d.get('id') for d in detalhes_data if d.get('id')]

        # 3. Remover detalhes que não foram enviados na requisição
        for detalhe_id in set(existing_detalhe_ids) - set(incoming_detalhe_ids):
            DetalheAnalise.objects.filter(id=detalhe_id).delete()

        # 4. Criar ou atualizar detalhes
        for detalhe_data in detalhes_data:
            detalhe_id = detalhe_data.get('id', None)
            if detalhe_id: # Se tem ID, é uma atualização
                detalhe = DetalheAnalise.objects.get(id=detalhe_id, registro_analise=instance)
                for key, value in detalhe_data.items():
                    setattr(detalhe, key, value)
                detalhe.save()
            else: # Se não tem ID, é uma criação
                DetalheAnalise.objects.create(registro_analise=instance, **detalhe_data)
        
        return instance