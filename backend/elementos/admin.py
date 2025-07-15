from django.contrib import admin

# PROJETOHABER/backend/elementos/admin.py
from django.contrib import admin
from .models import ElementoQuimico, ConfiguracaoAnalise

@admin.register(ElementoQuimico)
class ElementoQuimicoAdmin(admin.ModelAdmin):
    list_display = ('nome',)
    search_fields = ('nome',)

@admin.register(ConfiguracaoAnalise)
class ConfiguracaoAnaliseAdmin(admin.ModelAdmin):
    list_display = ('produto_mat_prima', 'elemento_quimico', 'diluicao1_X', 'diluicao1_Y')
    list_filter = ('produto_mat_prima', 'elemento_quimico')
    search_fields = ('produto_mat_prima__nome', 'elemento_quimico__nome')