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
    simbolo = models.CharField(
        max_length=10,
        null=False,
        blank=False,
        default="X",
        verbose_name="Símbolo do Elemento Químico"
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

class ConfiguracaoAnalise(models.Model): # ESTA É A CLASSE QUE VOCÊ PRECISA ENCONTRAR E MODIFICAR
    # Dê um related_name único para este aplicativo/modelo também
    produto_mat_prima = models.ForeignKey(
        ProdutoMatPrima, 
        on_delete=models.CASCADE, 
        related_name='configuracoes_elementos_por_produto' # NOME ÚNICO AQUI (DIFERENTE DO ANTERIOR)
    )
    elemento_quimico = models.ForeignKey(
        'ElementoQuimico', # Referência de string se ElementoQuimico estiver no mesmo arquivo
        on_delete=models.CASCADE, 
        related_name='configuracoes_elementos_por_elemento' # NOME ÚNICO AQUI (DIFERENTE DO ANTERIOR)
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
        verbose_name = "Configuração de Elemento" # Talvez mude o verbose_name para diferenciá-lo no Admin
        verbose_name_plural = "Configurações de Elementos"
        unique_together = ('produto_mat_prima', 'elemento_quimico')
        ordering = ['produto_mat_prima__nome', 'elemento_quimico__nome']

    def __str__(self):
        return f"Configuração de Elemento para {self.produto_mat_prima.nome} - {self.elemento_quimico.nome}"
        diluicao_1_str = f"{self.diluicao1_X}/{self.diluicao1_Y}"
        diluicao_2_str = ""
        if self.diluicao2_X is not None and self.diluicao2_Y is not None:
            diluicao_2_str = f", {self.diluicao2_X}/{self.diluicao2_Y}"
        return f"{self.produto_mat_prima.nome} - {self.elemento_quimico.nome} ({diluicao_1_str}{diluicao_2_str})"