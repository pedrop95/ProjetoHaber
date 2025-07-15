# PROJETOHABER/backend/produtos/urls.py

from rest_framework.routers import DefaultRouter
from .views import ProdutoMatPrimaViewSet

router = DefaultRouter()
router.register(r'produtos', ProdutoMatPrimaViewSet) # URL: /api/produtos/

urlpatterns = router.urls