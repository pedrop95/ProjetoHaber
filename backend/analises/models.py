# PROJETOHABER/backend/analises/models.py

from django.db import models
from produtos.models import ProdutoMatPrima # Importar ProdutoMatPrima

class RegistroAnalise(models.Model):
    produto_mat_prima = models.ForeignKey(
        ProdutoMatPrima,
        on_delete=models.CASCADE,
        verbose_name="Produto/Matéria-Prima",
        related_name="registros_analise"
    )
    data_analise = models.DateField(
        null=False,
        blank=False,
        verbose_name="Data da Análise"
    )
    nota_fiscal = models.CharField(
        max_length=255,
        null=True, # Pode ser nulo
        blank=True, # Pode ser vazio no formulário
        verbose_name="Nota Fiscal"
    )
    lote = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name="Lote"
    )

    class Meta:
        verbose_name = "Registro de Análise"
        verbose_name_plural = "Registros de Análises"
        ordering = ['-data_analise', 'produto_mat_prima__nome'] # Ordena pela data mais recente

    def __str__(self):
        return f"Análise de {self.produto_mat_prima.nome} em {self.data_analise}"
    
    
from django.db import models
# Importar ElementoQuimico da app 'elementos'
from elementos.models import ElementoQuimico

# (Classe RegistroAnalise definida acima)

class DetalheAnalise(models.Model):
    registro_analise = models.ForeignKey(
        RegistroAnalise,
        on_delete=models.CASCADE,
        verbose_name="Registro de Análise",
        related_name="detalhes" # Permite acesso reverso (registro.detalhes.all())
    )
    elemento_quimico = models.ForeignKey(
        ElementoQuimico,
        on_delete=models.CASCADE,
        verbose_name="Elemento Químico"
    )
    diluicao1_massa = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        null=True,
        blank=True,
        verbose_name="Diluição 1 - Massa"
    )
    diluicao1_abs = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        null=True,
        blank=True,
        verbose_name="Diluição 1 - Absorbância"
    )
    diluicao2_massa = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        null=True,
        blank=True,
        verbose_name="Diluição 2 - Massa"
    )
    diluicao2_abs = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        null=True,
        blank=True,
        verbose_name="Diluição 2 - Absorbância"
    )
    resultado = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        null=True,
        blank=True,
        verbose_name="Resultado Final"
    )

    class Meta:
        verbose_name = "Detalhe da Análise"
        verbose_name_plural = "Detalhes da Análise"
        # Garante que um registro de análise só tenha um detalhe por elemento
        unique_together = ('registro_analise', 'elemento_quimico')
        ordering = ['registro_analise', 'elemento_quimico__nome']

    def __str__(self):
        return f"Detalhe para {self.registro_analise.produto_mat_prima.nome} - {self.elemento_quimico.nome}"