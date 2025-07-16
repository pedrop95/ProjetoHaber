# PROJETOHABER/backend/analises/admin.py

from django.contrib import admin
from .models import RegistroAnalise, DetalheAnalise

# Inline para DetalheAnalise (para aparecer dentro do RegistroAnalise)
class DetalheAnaliseInline(admin.TabularInline):
    model = DetalheAnalise
    extra = 1 # Quantidade de formulários vazios para adicionar novos detalhes
    fields = (
        'elemento_quimico', 
        'resultado', 
        'massa_pesada',      # NOVO CAMPO
        'absorbancia_medida' # NOVO CAMPO
    )


@admin.register(RegistroAnalise)
class RegistroAnaliseAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'produto_mat_prima', 
        'data_analise', 
        'data_producao',    # NOVO CAMPO
        'data_validade',    # NOVO CAMPO
        'lote', 
        'nota_fiscal', 
        'fornecedor'        # NOVO CAMPO
    )
    list_filter = ('data_analise', 'produto_mat_prima__nome', 'fornecedor') # Exemplo de filtro, ajuste se quiser
    search_fields = ('produto_mat_prima__nome', 'lote', 'nota_fiscal', 'fornecedor')
    inlines = [DetalheAnaliseInline] # Adiciona o inline aqui

    fieldsets = (
        (None, {
            'fields': (
                ('produto_mat_prima', 'data_analise'), # Campos na mesma linha
                ('data_producao', 'data_validade'), # NOVOS CAMPOS na mesma linha
                ('lote', 'nota_fiscal'), # Campos na mesma linha
                'fornecedor', # NOVO CAMPO
            )
        }),
    )


@admin.register(DetalheAnalise)
class DetalheAnaliseAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'registro_analise', 
        'elemento_quimico', 
        'resultado', 
        'massa_pesada',        # NOVO CAMPO
        'absorbancia_medida'   # NOVO CAMPO
    )
    list_filter = ('registro_analise__produto_mat_prima', 'elemento_quimico')
    search_fields = ('elemento_quimico__nome', 'registro_analise__lote')