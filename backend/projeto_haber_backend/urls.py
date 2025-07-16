"""
URL configuration for projeto_haber_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]

# PROJETOHABER/backend/projeto_haber_backend/urls.py

from django.contrib import admin
from django.urls import path, include

# Importe os routers das suas apps
from produtos.urls import router as produtos_router
from elementos.urls import router as elementos_router
from analises.urls import router as analises_router

urlpatterns = [
    path('admin/', admin.site.urls),
    # Inclua as URLs das suas APIs aqui. Usaremos o prefixo 'api/'
    path('api/', include(produtos_router.urls)),
    path('api/', include(elementos_router.urls)),
    path('api/', include(analises_router.urls)),
    path('api/', include('configuracoes.urls')),
]