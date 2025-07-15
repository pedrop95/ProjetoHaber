# PROJETOHABER/backend/analises/admin.py
from django.contrib import admin
from .models import RegistroAnalise, DetalheAnalise

@admin.register(RegistroAnalise)
class RegistroAnaliseAdmin(admin.ModelAdmin):
    list_display = ('produto_mat_prima', 'data_analise', 'nota_fiscal', 'lote')
    list_filter = ('data_analise', 'produto_mat_prima')
    search_fields = ('produto_mat_prima__nome', 'nota_fiscal', 'lote')
    date_hierarchy = 'data_analise'

@admin.register(DetalheAnalise)
class DetalheAnaliseAdmin(admin.ModelAdmin):
    list_display = ('registro_analise', 'elemento_quimico', 'resultado', 'diluicao1_massa', 'diluicao1_abs')
    list_filter = ('registro_analise__produto_mat_prima', 'elemento_quimico')
    search_fields = ('registro_analise__produto_mat_prima__nome', 'elemento_quimico__nome')
    # raw_id_fields = ('registro_analise', 'elemento_quimico') # Útil para muitos objetos