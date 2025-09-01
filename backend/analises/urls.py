# PROJETOHABER/backend/analises/urls.py

from rest_framework.routers import DefaultRouter
from .views import RegistroAnaliseViewSet, DetalheAnaliseViewSet

router = DefaultRouter()
router.register(r'detalhes-analise', DetalheAnaliseViewSet)   # URL: /api/detalhes-analise/

urlpatterns = router.urls