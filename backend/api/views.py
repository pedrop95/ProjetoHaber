from django.shortcuts import render

# Create your views here.
# PROJETOHABER/backend/api/views.py

from rest_framework import viewsets
from .models import ProdutoMatPrima, ElementoQuimico, ConfiguracaoAnalise, RegistroAnalise, DetalheAnalise, ConfiguracaoElementoDetalhe
from .serializers import (
    ProdutoMatPrimaSerializer,
    ElementoQuimicoSerializer,
    ConfiguracaoAnaliseSerializer,
    RegistroAnaliseSerializer,
    DetalheAnaliseSerializer,
    ConfiguracaoElementoDetalheSerializer # Importar o novo serializador
)

class ProdutoMatPrimaViewSet(viewsets.ModelViewSet):
    queryset = ProdutoMatPrima.objects.all()
    serializer_class = ProdutoMatPrimaSerializer

class ElementoQuimicoViewSet(viewsets.ModelViewSet):
    queryset = ElementoQuimico.objects.all()
    serializer_class = ElementoQuimicoSerializer

class ConfiguracaoAnaliseViewSet(viewsets.ModelViewSet):
    # Precisamos pré-carregar os detalhes dos elementos para o serializer
    queryset = ConfiguracaoAnalise.objects.all().prefetch_related('detalhes_elementos__elemento_quimico')
    serializer_class = ConfiguracaoAnaliseSerializer

class RegistroAnaliseViewSet(viewsets.ModelViewSet):
    # Certifique-se de pré-carregar os detalhes aninhados para exibição
    queryset = RegistroAnalise.objects.all().prefetch_related(
        'detalhes__configuracao_elemento_detalhe__elemento_quimico', # Acesso completo aos dados aninhados
        'produto_mat_prima'
    )
    serializer_class = RegistroAnaliseSerializer

class DetalheAnaliseViewSet(viewsets.ModelViewSet):
    queryset = DetalheAnalise.objects.all().select_related(
        'registro_analise',
        'configuracao_elemento_detalhe__elemento_quimico', # Selecionar o elemento químico também
        'configuracao_elemento_detalhe__configuracao_analise__produto_mat_prima' # E o produto relacionado
    )
    serializer_class = DetalheAnaliseSerializer

# Opcional: Se você precisar de um endpoint separado para os detalhes dos elementos de configuração
class ConfiguracaoElementoDetalheViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracaoElementoDetalhe.objects.all()
    serializer_class = ConfiguracaoElementoDetalheSerializer