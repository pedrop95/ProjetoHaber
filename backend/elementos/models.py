# PROJETOHABER/backend/elementos/models.py

from django.db import models

class ElementoQuimico(models.Model):
    nome = models.CharField(
        max_length=255,
        unique=True,
        null=False,
        blank=False,
        verbose_name="Nome do Elemento Químico"
    )

    class Meta:
        verbose_name = "Elemento Químico"
        verbose_name_plural = "Elementos Químicos"
        ordering = ['nome']

    def __str__(self):
        return self.nome


from django.db import models
# Importar ProdutoMatPrima da app 'produtos'
from produtos.models import ProdutoMatPrima

# (Classe ElementoQuimico definida acima)

class ConfiguracaoAnalise(models.Model):
    produto_mat_prima = models.ForeignKey(
        ProdutoMatPrima,
        on_delete=models.CASCADE,
        verbose_name="Produto/Matéria-Prima",
        related_name="configuracoes_analise" # Permite acesso reverso (produto.configuracoes_analise.all())
    )
    elemento_quimico = models.ForeignKey(
        ElementoQuimico,
        on_delete=models.CASCADE,
        verbose_name="Elemento Químico",
        related_name="configuracoes_analise"
    )
    diluicao1_X = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        null=False,
        blank=False,
        verbose_name="Diluição 1 - Valor X"
    )
    diluicao1_Y = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        null=False,
        blank=False,
        verbose_name="Diluição 1 - Valor Y"
    )
    diluicao2_X = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        null=True,  # Permite que seja nulo
        blank=True, # Permite que seja vazio no formulário
        verbose_name="Diluição 2 - Valor X"
    )
    diluicao2_Y = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        null=True,
        blank=True,
        verbose_name="Diluição 2 - Valor Y"
    )

    class Meta:
        verbose_name = "Configuração de Análise"
        verbose_name_plural = "Configurações de Análises"
        # Garante que um produto só tenha uma configuração para um dado elemento
        unique_together = ('produto_mat_prima', 'elemento_quimico')
        ordering = ['produto_mat_prima__nome', 'elemento_quimico__nome']

    def __str__(self):
        diluicao_1_str = f"{self.diluicao1_X}/{self.diluicao1_Y}"
        diluicao_2_str = ""
        if self.diluicao2_X is not None and self.diluicao2_Y is not None:
            diluicao_2_str = f", {self.diluicao2_X}/{self.diluicao2_Y}"
        return f"{self.produto_mat_prima.nome} - {self.elemento_quimico.nome} ({diluicao_1_str}{diluicao_2_str})"