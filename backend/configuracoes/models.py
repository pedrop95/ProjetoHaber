# PROJETOHABER/backend/configuracoes/models.py

from django.db import models
from produtos.models import ProdutoMatPrima
from elementos.models import ElementoQuimico

class ConfiguracaoAnalise(models.Model):
    # Dê um related_name único para este aplicativo/modelo
    produto_mat_prima = models.ForeignKey(
        ProdutoMatPrima, 
        on_delete=models.CASCADE, 
        related_name='configuracoes_gerais_por_produto' # NOME ÚNICO AQUI
    )
    elemento_quimico = models.ForeignKey(
        ElementoQuimico, 
        on_delete=models.CASCADE, 
        related_name='configuracoes_gerais_por_elemento' # NOME ÚNICO AQUI
    )
    # ... (o resto dos seus campos: diluicao1_X, diluicao1_Y, etc.)
    diluicao1_X = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True, help_text="Diluição 1:X (ex: 100 para 1:100)")
    diluicao1_Y = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True, help_text="Fator da diluição 1 (ex: 100 para 1:100)")
    diluicao2_X = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True, help_text="Diluição 1:X (ex: 50 para 1:50) - Opcional")
    diluicao2_Y = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True, help_text="Fator da diluição 2 (ex: 50 para 1:50) - Opcional")
    
    def __str__(self):
        return f"Configuração para {self.produto_mat_prima.nome} - {self.elemento_quimico.nome}"

    class Meta:
        verbose_name = "Configuração de Análise"
        verbose_name_plural = "Configurações de Análises"
        unique_together = ('produto_mat_prima', 'elemento_quimico')
        ordering = ['produto_mat_prima__nome', 'elemento_quimico__nome']