# PROJETOHABER/backend/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProdutoMatPrimaViewSet,
    ElementoQuimicoViewSet,
    ConfiguracaoAnaliseViewSet,
    RegistroAnaliseViewSet,
    DetalheAnaliseViewSet,
    ConfiguracaoElementoDetalheViewSet # Importar o novo ViewSet
)

router = DefaultRouter()
router.register(r'produtos', ProdutoMatPrimaViewSet)
router.register(r'elementos', ElementoQuimicoViewSet)
router.register(r'configuracoes-analise', ConfiguracaoAnaliseViewSet)
router.register(r'registros-analise', RegistroAnaliseViewSet)
router.register(r'detalhes-analise', DetalheAnaliseViewSet)
router.register(r'configuracoes-elemento-detalhe', ConfiguracaoElementoDetalheViewSet) # Adicionar nova rota

urlpatterns = [
    path('', include(router.urls)),
]