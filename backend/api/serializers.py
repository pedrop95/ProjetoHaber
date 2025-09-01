# PROJETOHABER/backend/api/serializers.py

from rest_framework import serializers
from .models import ProdutoMatPrima, ElementoQuimico, ConfiguracaoAnalise, ConfiguracaoElementoDetalhe, RegistroAnalise, DetalheAnalise

# Serializer para ProdutoMatPrima
class ProdutoMatPrimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoMatPrima
        fields = '__all__'

# Serializer para ElementoQuimico
class ElementoQuimicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElementoQuimico
        fields = '__all__'

# Serializer para ConfiguracaoElementoDetalhe
class ConfiguracaoElementoDetalheSerializer(serializers.ModelSerializer):
    elemento_quimico_nome = serializers.CharField(source='elemento_quimico.nome', read_only=True)
    elemento_quimico_simbolo = serializers.CharField(source='elemento_quimico.simbolo', read_only=True)
    diluicao1_X = serializers.DecimalField(max_digits=10, decimal_places=4, required=True, coerce_to_string=False)
    diluicao1_Y = serializers.DecimalField(max_digits=10, decimal_places=4, required=True, coerce_to_string=False)
    diluicao2_X = serializers.DecimalField(max_digits=10, decimal_places=4, required=False, allow_null=True, coerce_to_string=False)
    diluicao2_Y = serializers.DecimalField(max_digits=10, decimal_places=4, required=False, allow_null=True, coerce_to_string=False)
    limite_min = serializers.DecimalField(max_digits=10, decimal_places=4, required=False, allow_null=True, coerce_to_string=False)
    limite_max = serializers.DecimalField(max_digits=10, decimal_places=4, required=False, allow_null=True, coerce_to_string=False)

    class Meta:
        model = ConfiguracaoElementoDetalhe
        fields = [
            'id', 'configuracao_analise', 'elemento_quimico',
            'elemento_quimico_nome', 'elemento_quimico_simbolo',
            'diluicao1_X', 'diluicao1_Y', 'diluicao2_X', 'diluicao2_Y',
            'limite_min', 'limite_max'
        ]
        extra_kwargs = {
            'configuracao_analise': {'read_only': True}
        }


# Serializer para ConfiguracaoAnalise
class ConfiguracaoAnaliseSerializer(serializers.ModelSerializer):
    produto_mat_prima_nome = serializers.CharField(source='produto_mat_prima.nome', read_only=True)
    produto_mat_prima_id_ou_op = serializers.CharField(source='produto_mat_prima.id_ou_op', read_only=True)
    
    # Campo aninhado para lidar com os detalhes dos elementos
    # IMPORTANTE: `read_only=False` é o padrão, mas `required=True` pode ser um problema se os detalhes forem opcionais
    # `many=True` indica que é uma lista de objetos
    # `allow_empty=False` garante que a lista de detalhes não pode ser vazia ao criar
    detalhes_elementos = ConfiguracaoElementoDetalheSerializer(many=True, required=True, write_only=True)
    def validate(self, data):
        print("\n--- DEBUG ConfiguracaoAnaliseSerializer.validate ---")
        print("Dados sendo validados na configuracao de analise:", data)
        print("--- FIM DEBUG ConfiguracaoAnaliseSerializer.validate ---\n")
        return data
    class Meta:
        model = ConfiguracaoAnalise
        fields = [
            'id', 'produto_mat_prima', 'produto_mat_prima_nome', 'produto_mat_prima_id_ou_op',
            'detalhes_elementos'
        ]
        # Remova quaisquer outros fields aqui, especialmente se você tentou adicionar os campos de diluição/limite/elemento_quimico diretamente.
    
    # MÉTODOS create e update são essenciais para lidar com a escrita de campos aninhados
    def create(self, validated_data):
        detalhes_elementos_data = validated_data.pop('detalhes_elementos') # Extrai a lista de detalhes
        configuracao_analise = ConfiguracaoAnalise.objects.create(**validated_data) # Cria a instância principal
        
        for detalhe_data in detalhes_elementos_data:
            ConfiguracaoElementoDetalhe.objects.create(configuracao_analise=configuracao_analise, **detalhe_data)
        
        return configuracao_analise

    def update(self, instance, validated_data):
        detalhes_elementos_data = validated_data.pop('detalhes_elementos', []) # Extrai a lista de detalhes (pode ser vazia)
        
        # Atualiza campos da instância principal
        instance.produto_mat_prima = validated_data.get('produto_mat_prima', instance.produto_mat_prima)
        instance.save()

        # Lógica para atualizar/criar/deletar os detalhes dos elementos
        existing_detalhe_ids = set([d.id for d in instance.detalhes_elementos.all()])
        incoming_detalhe_ids = set([d.get('id') for d in detalhes_elementos_data if d.get('id')])

        # Remover detalhes que não foram enviados na requisição
        for detalhe_id in existing_detalhe_ids - incoming_detalhe_ids:
            ConfiguracaoElementoDetalhe.objects.filter(id=detalhe_id).delete()

        # Criar ou atualizar detalhes
        for detalhe_data in detalhes_elementos_data:
            detalhe_id = detalhe_data.get('id', None)
            if detalhe_id: # Se tem ID, é uma atualização
                # Garantir que o ID pertence à instância atual para segurança
                try:
                    detalhe = ConfiguracaoElementoDetalhe.objects.get(id=detalhe_id, configuracao_analise=instance)
                    for key, value in detalhe_data.items():
                        setattr(detalhe, key, value)
                    detalhe.save()
                except ConfiguracaoElementoDetalhe.DoesNotExist:
                    # Se o ID não existe ou não pertence a esta configuração, criar um novo
                    # Isso pode acontecer se o frontend tentar enviar um ID inválido
                    ConfiguracaoElementoDetalhe.objects.create(configuracao_analise=instance, **detalhe_data)

            else: # Se não tem ID, é uma criação
                ConfiguracaoElementoDetalhe.objects.create(configuracao_analise=instance, **detalhe_data)
        
        return instance
    

# Serializer para DetalheAnalise
class DetalheAnaliseSerializer(serializers.ModelSerializer):
    configuracao_elemento_detalhe_elemento_nome = serializers.CharField(source='configuracao_elemento_detalhe.elemento_quimico.nome', read_only=True)
    configuracao_elemento_detalhe_elemento_simbolo = serializers.CharField(source='configuracao_elemento_detalhe.elemento_quimico.simbolo', read_only=True)
    configuracao_elemento_detalhe_diluicao1_X = serializers.DecimalField(source='configuracao_elemento_detalhe.diluicao1_X', max_digits=10, decimal_places=4, read_only=True)
    configuracao_elemento_detalhe_diluicao1_Y = serializers.DecimalField(source='configuracao_elemento_detalhe.diluicao1_Y', max_digits=10, decimal_places=4, read_only=True)
    massa_pesada = serializers.DecimalField(max_digits=10, decimal_places=4, required=False, allow_null=True)
    absorbancia_medida = serializers.DecimalField(max_digits=10, decimal_places=4, required=False, allow_null=True)

    class Meta:
        model = DetalheAnalise
        fields = [
            'id', 'registro_analise', 'configuracao_elemento_detalhe',
            'configuracao_elemento_detalhe_elemento_nome', 'configuracao_elemento_detalhe_elemento_simbolo',
            'configuracao_elemento_detalhe_diluicao1_X', 'configuracao_elemento_detalhe_diluicao1_Y',
            'massa_pesada', 'absorbancia_medida', 'resultado'
        ]
        # Certifique-se que o FK registro_analise não seja required na escrita aninhada
        extra_kwargs = {
            'registro_analise': {'required': False, 'read_only': True}
        }

# Serializer para RegistroAnalise
class RegistroAnaliseSerializer(serializers.ModelSerializer):
    detalhes = DetalheAnaliseSerializer(many=True, required=False) # Permite leitura e escrita dos detalhes
    
    produto_mat_prima_nome = serializers.CharField(source='produto_mat_prima.nome', read_only=True)
    produto_mat_prima_id_ou_op = serializers.CharField(source='produto_mat_prima.id_ou_op', read_only=True)

    class Meta:
        model = RegistroAnalise
        fields = [
            'id', 'produto_mat_prima', 'produto_mat_prima_nome', 'produto_mat_prima_id_ou_op',
            'data_analise', 'analista', 'status', 'detalhes'
        ]

    def create(self, validated_data):
        detalhes_data = validated_data.pop('detalhes')
        registro_analise = RegistroAnalise.objects.create(**validated_data)
        for detalhe_data in detalhes_data:
            DetalheAnalise.objects.create(registro_analise=registro_analise, **detalhe_data)
        return registro_analise

    def update(self, instance, validated_data):
        detalhes_data = validated_data.pop('detalhes', [])

        # Atualiza campos da instância principal
        instance.produto_mat_prima = validated_data.get('produto_mat_prima', instance.produto_mat_prima)
        instance.data_analise = validated_data.get('data_analise', instance.data_analise)
        instance.analista = validated_data.get('analista', instance.analista)
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        # Lógica para atualizar/criar/deletar os detalhes da análise
        existing_detalhe_ids = set([d.id for d in instance.detalhes.all()])
        incoming_detalhe_ids = set([d.get('id') for d in detalhes_data if d.get('id')])

        # Remover detalhes que não foram enviados na requisição
        for detalhe_id in existing_detalhe_ids - incoming_detalhe_ids:
            DetalheAnalise.objects.filter(id=detalhe_id).delete()

        # Criar ou atualizar detalhes
        for detalhe_data in detalhes_data:
            detalhe_id = detalhe_data.get('id', None)
            if detalhe_id:
                try:
                    detalhe = DetalheAnalise.objects.get(id=detalhe_id, registro_analise=instance)
                    for key, value in detalhe_data.items():
                        setattr(detalhe, key, value)
                    detalhe.save()
                except DetalheAnalise.DoesNotExist:
                    DetalheAnalise.objects.create(registro_analise=instance, **detalhe_data)
            else:
                DetalheAnalise.objects.create(registro_analise=instance, **detalhe_data)

        return instance