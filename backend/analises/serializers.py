# PROJETOHABER/backend/analises/serializers.py

from rest_framework import serializers
from .models import RegistroAnalise, DetalheAnalise
from produtos.models import ProdutoMatPrima
from elementos.models import ElementoQuimico

class DetalheAnaliseSerializer(serializers.ModelSerializer):
    # Campos _nome são read-only para exibição
    elemento_quimico_nome = serializers.CharField(source='elemento_quimico.nome', read_only=True)
    concentracao_ppm = serializers.SerializerMethodField(read_only=True)
    concentracao_porcentagem = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DetalheAnalise
        fields = '__all__'
        extra_kwargs = {
            'registro_analise': {'required': False} # Não é necessário no payload aninhado
        }
    
    def get_concentracao_ppm(self, obj):
        """
        Calcula a concentração em ppm usando o método do modelo.
        """
        return obj.calcular_concentracao_ppm()

    def get_concentracao_porcentagem(self, obj):
        """
        Calcula a concentração em porcentagem usando o método do modelo.
        """
        return obj.calcular_concentracao_porcentagem()

class RegistroAnaliseSerializer(serializers.ModelSerializer):
    detalhes = DetalheAnaliseSerializer(many=True)
    produto_mat_prima_nome = serializers.CharField(source='produto_mat_prima.nome', read_only=True)

    class Meta:
        model = RegistroAnalise
        fields = '__all__'

    def _preencher_dados_diluicao(self, detalhe_data):
        """
        Se os campos de diluição não estão preenchidos, tenta preencher a partir da ConfiguracaoElementoDetalhe
        """
        # Se configuracao_elemento_detalhe está nos dados, use-a para preencher diluições
        if 'configuracao_elemento_detalhe' in detalhe_data:
            config_id = detalhe_data['configuracao_elemento_detalhe']
            if config_id:
                from api.models import ConfiguracaoElementoDetalhe
                try:
                    config = ConfiguracaoElementoDetalhe.objects.get(id=config_id)
                    # Preencher se não estiver já preenchido
                    if not detalhe_data.get('volume_final_diluicao_1'):
                        detalhe_data['volume_final_diluicao_1'] = config.diluicao1_Y
                    if not detalhe_data.get('volume_inicial_diluicao_2'):
                        detalhe_data['volume_inicial_diluicao_2'] = config.diluicao2_X
                    if not detalhe_data.get('volume_final_diluicao_2'):
                        detalhe_data['volume_final_diluicao_2'] = config.diluicao2_Y
                except ConfiguracaoElementoDetalhe.DoesNotExist:
                    pass
        return detalhe_data

    def create(self, validated_data):
        detalhes_data = validated_data.pop('detalhes')
        registro_analise = RegistroAnalise.objects.create(**validated_data)
        for detalhe_data in detalhes_data:
            # Preencher dados de diluição automaticamente se necessário
            detalhe_data = self._preencher_dados_diluicao(detalhe_data)
            DetalheAnalise.objects.create(registro_analise=registro_analise, **detalhe_data)
        return registro_analise

    def update(self, instance, validated_data):
        detalhes_data = validated_data.pop('detalhes')

        # Atualiza campos do RegistroAnalise
        instance.produto_mat_prima = validated_data.get('produto_mat_prima', instance.produto_mat_prima)
        instance.data_analise = validated_data.get('data_analise', instance.data_analise)
        instance.data_producao = validated_data.get('data_producao', instance.data_producao)
        instance.data_validade = validated_data.get('data_validade', instance.data_validade)
        instance.lote = validated_data.get('lote', instance.lote)
        instance.nota_fiscal = validated_data.get('nota_fiscal', instance.nota_fiscal)
        instance.fornecedor = validated_data.get('fornecedor', instance.fornecedor)
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        # Lógica para atualizar/criar/deletar DetalhesAnalise
        detalhe_ids_present_in_request = [d.get('id') for d in detalhes_data if d.get('id')]

        # Deleta detalhes que não estão mais no request
        for detalhe in instance.detalhes.all():
            if detalhe.id not in detalhe_ids_present_in_request:
                detalhe.delete()

        # Cria ou atualiza detalhes
        for detalhe_data in detalhes_data:
            # Preencher dados de diluição automaticamente se necessário
            detalhe_data = self._preencher_dados_diluicao(detalhe_data)
            detalhe_id = detalhe_data.get('id')
            if detalhe_id:
                # Atualiza detalhe existente
                detalhe = DetalheAnalise.objects.get(id=detalhe_id, registro_analise=instance)
                detalhe.configuracao_elemento_detalhe = detalhe_data.get('configuracao_elemento_detalhe', detalhe.configuracao_elemento_detalhe)
                detalhe.resultado = detalhe_data.get('resultado', detalhe.resultado)
                detalhe.massa_pesada = detalhe_data.get('massa_pesada', detalhe.massa_pesada)
                detalhe.absorbancia_medida = detalhe_data.get('absorbancia_medida', detalhe.absorbancia_medida)
                detalhe.volume_final_diluicao_1 = detalhe_data.get('volume_final_diluicao_1', detalhe.volume_final_diluicao_1)
                detalhe.volume_inicial_diluicao_2 = detalhe_data.get('volume_inicial_diluicao_2', detalhe.volume_inicial_diluicao_2)
                detalhe.volume_final_diluicao_2 = detalhe_data.get('volume_final_diluicao_2', detalhe.volume_final_diluicao_2)
                detalhe.save()
            else:
                # Cria novo detalhe
                DetalheAnalise.objects.create(registro_analise=instance, **detalhe_data)

        return instance