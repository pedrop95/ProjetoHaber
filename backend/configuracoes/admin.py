# PROJETOHABER/backend/configuracoes/admin.py

from django.contrib import admin
from .models import ConfiguracaoAnalise

@admin.register(ConfiguracaoAnalise)
class ConfiguracaoAnaliseAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'produto_mat_prima', 
        'elemento_quimico', 
        'diluicao1_X', 
        'diluicao1_Y', 
        'diluicao2_X', 
        'diluicao2_Y'
    )
    list_filter = ('produto_mat_prima', 'elemento_quimico')
    search_fields = ('produto_mat_prima__nome', 'elemento_quimico__nome')
    raw_id_fields = ('produto_mat_prima', 'elemento_quimico') # Facilita seleção de FKs com muitos itens