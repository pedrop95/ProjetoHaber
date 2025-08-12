from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response

# Create your views here.




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
    queryset = ConfiguracaoAnalise.objects.all().prefetch_related('detalhes_elementos__elemento_quimico')
    serializer_class = ConfiguracaoAnaliseSerializer

    def create(self, request, *args, **kwargs):
        print("\n>>> ENTROU NO MÉTODO CREATE DO ConfiguracaoAnaliseViewSet", flush=True)
        print("\n--- DEBUG: Payload recebido na API ---", flush=True)
        print(request.data, flush=True)
        print("--- FIM DEBUG PAYLOAD ---\n", flush=True)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("\n--- DEBUG: Erros de validação do serializer ---", flush=True)
            print(serializer.errors, flush=True)
            print("--- FIM DEBUG ERROS ---\n", flush=True)
            return Response(serializer.errors, status=400)

        print("\n--- DEBUG: Dados validados ---", flush=True)
        print(serializer.validated_data, flush=True)
        print("--- FIM DEBUG DADOS VALIDADOS ---\n", flush=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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