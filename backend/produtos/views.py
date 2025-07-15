from django.shortcuts import render
# PROJETOHABER/backend/produtos/views.py

from rest_framework import viewsets
from .models import ProdutoMatPrima
from .serializers import ProdutoMatPrimaSerializer

class ProdutoMatPrimaViewSet(viewsets.ModelViewSet):
    queryset = ProdutoMatPrima.objects.all().order_by('nome')
    serializer_class = ProdutoMatPrimaSerializer