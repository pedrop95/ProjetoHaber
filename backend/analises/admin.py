# PROJETOHABER/backend/analises/admin.py

from django.contrib import admin
from .models import RegistroAnalise, DetalheAnalise

class DetalheAnaliseInline(admin.TabularInline):
    model = DetalheAnalise
    extra = 1
    fields = [
        'elemento_quimico', 'resultado', 'massa_pesada', 'absorbancia_medida', 
        'volume_final_diluicao_1', 'volume_inicial_diluicao_2', 'volume_final_diluicao_2',
        'concentracao_calculada'
    ]
    readonly_fields = ['concentracao_calculada']

    def concentracao_calculada(self, obj):
        """Exibe a concentração calculada no inline admin"""
        concentracao = obj.calcular_concentracao()
        if concentracao is not None:
            return f"{concentracao:.6f}"
        return "Dados incompletos"
    concentracao_calculada.short_description = "Concentração Calculada"

@admin.register(RegistroAnalise)
class RegistroAnaliseAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'produto_mat_prima', 'data_analise', 'lote', 'status',
        'data_producao', 'data_validade', 'fornecedor', 'nota_fiscal'
    )
    search_fields = ('lote', 'produto_mat_prima__nome', 'fornecedor', 'nota_fiscal')
    list_filter = ('data_analise', 'produto_mat_prima', 'status')
    date_hierarchy = 'data_analise'

    fieldsets = (
        (None, {
            'fields': ('produto_mat_prima', 'data_analise', 'status')
        }),
        ('Informações de Lote e Fornecedor', {
            'fields': ('lote', 'nota_fiscal', 'fornecedor', 'data_producao', 'data_validade'),
            'classes': ('collapse',)
        }),
    )
    inlines = [DetalheAnaliseInline]