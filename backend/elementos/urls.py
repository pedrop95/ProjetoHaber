# PROJETOHABER/backend/elementos/urls.py

from rest_framework.routers import DefaultRouter
from .views import ElementoQuimicoViewSet, ConfiguracaoAnaliseViewSet

router = DefaultRouter()
router.register(r'elementos', ElementoQuimicoViewSet) # URL: /api/elementos/
router.register(r'configuracoes-analise', ConfiguracaoAnaliseViewSet) # URL: /api/configuracoes-analise/

urlpatterns = router.urls