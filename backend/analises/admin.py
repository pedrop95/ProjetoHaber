# PROJETOHABER/backend/analises/admin.py

from django.contrib import admin
from .models import RegistroAnalise, DetalheAnalise

class DetalheAnaliseInline(admin.TabularInline):
    model = DetalheAnalise
    extra = 1
    fields = ['elemento_quimico', 'resultado', 'massa_pesada', 'absorbancia_medida']

@admin.register(RegistroAnalise)
class RegistroAnaliseAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'produto_mat_prima', 'data_analise', 'lote', 'status', # Adicione 'status' aqui
        'data_producao', 'data_validade', 'fornecedor', 'nota_fiscal'
    )
    search_fields = ('lote', 'produto_mat_prima__nome', 'fornecedor', 'nota_fiscal')
    list_filter = ('data_analise', 'produto_mat_prima', 'status') # Adicione 'status' aqui
    date_hierarchy = 'data_analise'

    fieldsets = (
        (None, {
            'fields': ('produto_mat_prima', 'data_analise', 'status') # Adicione 'status' aqui
        }),
        ('Informações de Lote e Fornecedor', {
            'fields': ('lote', 'nota_fiscal', 'fornecedor', 'data_producao', 'data_validade'),
            'classes': ('collapse',) # Opcional: faz esta seção ser colapsável
        }),
    )
    inlines = [DetalheAnaliseInline]