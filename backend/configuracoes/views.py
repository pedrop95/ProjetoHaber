# PROJETOHABER/backend/configuracoes/views.py

from rest_framework import viewsets
from .models import ConfiguracaoAnalise
from .serializers import ConfiguracaoAnaliseSerializer

class ConfiguracaoAnaliseViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracaoAnalise.objects.all().order_by('produto_mat_prima__nome', 'elemento_quimico__nome')
    serializer_class = ConfiguracaoAnaliseSerializer
    # Permite filtrar por produto_mat_prima (ex: /api/configuracoes-analise/?produto_mat_prima=1)
    filterset_fields = ['produto_mat_prima']