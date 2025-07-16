# PROJETOHABER/backend/configuracoes/urls.py

from rest_framework.routers import DefaultRouter
from .views import ConfiguracaoAnaliseViewSet

router = DefaultRouter()
router.register(r'configuracoes-analise', ConfiguracaoAnaliseViewSet)

urlpatterns = router.urls