# PROJETOHABER/backend/elementos/urls.py

from rest_framework.routers import DefaultRouter
from .views import ElementoQuimicoViewSet


router = DefaultRouter()
router.register(r'elementos', ElementoQuimicoViewSet) # URL: /api/elementos/

urlpatterns = router.urls