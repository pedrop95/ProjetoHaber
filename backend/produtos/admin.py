# PROJETOHABER/backend/produtos/admin.py
from django.contrib import admin
from .models import ProdutoMatPrima

@admin.register(ProdutoMatPrima)
class ProdutoMatPrimaAdmin(admin.ModelAdmin):
    list_display = ('id_ou_op', 'nome')
    search_fields = ('id_ou_op', 'nome')