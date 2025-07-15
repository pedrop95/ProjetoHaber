from django.shortcuts import render
# PROJETOHABER/backend/elementos/views.py

from rest_framework import viewsets
from .models import ElementoQuimico, ConfiguracaoAnalise
from .serializers import ElementoQuimicoSerializer, ConfiguracaoAnaliseSerializer

class ElementoQuimicoViewSet(viewsets.ModelViewSet):
    queryset = ElementoQuimico.objects.all().order_by('nome')
    serializer_class = ElementoQuimicoSerializer

class ConfiguracaoAnaliseViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracaoAnalise.objects.all()
    serializer_class = ConfiguracaoAnaliseSerializer