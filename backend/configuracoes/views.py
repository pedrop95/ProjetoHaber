from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import ConfiguracaoAnalise
from .serializers import ConfiguracaoAnaliseSerializer

class ConfiguracaoAnaliseViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracaoAnalise.objects.all().order_by('produto_mat_prima__nome', 'elemento_quimico__nome')
    serializer_class = ConfiguracaoAnaliseSerializer
    # Permite filtrar por produto_mat_prima (ex: /api/configuracoes-analise/?produto_mat_prima=1)
    filterset_fields = ['produto_mat_prima']

    def create(self, request, *args, **kwargs):
        detalhes_elementos = request.data.get('detalhes_elementos', [])
        produto_mat_prima = request.data.get('produto_mat_prima')
        
        if not detalhes_elementos:
            return Response({'error': 'detalhes_elementos é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        created_configs = []
        for detalhe in detalhes_elementos:
            config_data = {
                'produto_mat_prima': produto_mat_prima,
                'elemento_quimico': detalhe['elemento_quimico'],
                'diluicao1_X': detalhe.get('diluicao1_X'),
                'diluicao1_Y': detalhe.get('diluicao1_Y'),
                'diluicao2_X': detalhe.get('diluicao2_X'),
                'diluicao2_Y': detalhe.get('diluicao2_Y'),
                'limite_min': detalhe.get('limite_min'),
                'limite_max': detalhe.get('limite_max'),
            }
            serializer = self.get_serializer(data=config_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            created_configs.append(serializer.data)
        
        return Response(created_configs, status=status.HTTP_201_CREATED)