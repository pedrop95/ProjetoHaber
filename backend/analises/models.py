# PROJETOHABER/backend/analises/models.py

from django.db import models
from produtos.models import ProdutoMatPrima
from elementos.models import ElementoQuimico # Certifique-se de que ElementoQuimico está importado

class RegistroAnalise(models.Model):
    produto_mat_prima = models.ForeignKey(ProdutoMatPrima, on_delete=models.PROTECT, related_name='registros_analise')
    data_analise = models.DateField()
    data_producao = models.DateField(null=True, blank=True) # NOVO CAMPO
    data_validade = models.DateField(null=True, blank=True) # NOVO CAMPO
    lote = models.CharField(max_length=100, null=True, blank=True)
    nota_fiscal = models.CharField(max_length=100, null=True, blank=True)
    fornecedor = models.CharField(max_length=200, null=True, blank=True) # NOVO CAMPO
    # Adicione outros campos aqui conforme a necessidade do seu projeto

    def __str__(self):
        return f"Análise de {self.produto_mat_prima.nome} ({self.lote if self.lote else 'N/A'}) em {self.data_analise}"

    class Meta:
        verbose_name = "Registro de Análise"
        verbose_name_plural = "Registros de Análises"
        ordering = ['-data_analise', 'produto_mat_prima__nome'] # Ordenação padrão


class DetalheAnalise(models.Model):
    registro_analise = models.ForeignKey(RegistroAnalise, on_delete=models.CASCADE, related_name='detalhes_analise')
    elemento_quimico = models.ForeignKey(ElementoQuimico, on_delete=models.PROTECT, related_name='detalhes_analise')
    resultado = models.DecimalField(max_digits=10, decimal_places=4)
    # Os campos de diluição (diluicao1_X, diluicao1_Y etc.) devem vir da ConfiguraçãoAnalise
    # e serão APENAS exibidos no frontend, não armazenados no DetalheAnalise.

    # NOVOS CAMPOS PARA VALORES MEDIDOS PELO USUÁRIO NO MOMENTO DA ANÁLISE
    massa_pesada = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True, help_text="Massa pesada para a diluição no momento da análise.") # NOVO CAMPO
    absorbancia_medida = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True, help_text="Valor de absorbância lido no equipamento.") # NOVO CAMPO

    def __str__(self):
        return f"Detalhe: {self.elemento_quimico.nome} - {self.resultado}"

    class Meta:
        verbose_name = "Detalhe de Análise"
        verbose_name_plural = "Detalhes de Análises"
        # Garante que um produto/elemento só tenha uma entrada por registro de análise
        unique_together = ('registro_analise', 'elemento_quimico')
        ordering = ['elemento_quimico__nome'] # Ordenação padrão