# PROJETOHABER/backend/analises/models.py

from django.db import models
from produtos.models import ProdutoMatPrima
from elementos.models import ElementoQuimico # Certifique-se de que está importado

class RegistroAnalise(models.Model):
    STATUS_CHOICES = [
        ('EM_ANDAMENTO', 'Em Andamento'),
        ('CONCLUIDO', 'Concluído'),
        ('CANCELADO', 'Cancelado'),
    ]

    produto_mat_prima = models.ForeignKey(ProdutoMatPrima, on_delete=models.CASCADE, related_name='registros_analise')
    data_analise = models.DateField()
    data_producao = models.DateField(null=True, blank=True)
    data_validade = models.DateField(null=True, blank=True)
    lote = models.CharField(max_length=100, blank=True, null=True)
    nota_fiscal = models.CharField(max_length=100, blank=True, null=True)
    fornecedor = models.CharField(max_length=200, blank=True, null=True)
    # Novo campo Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='EM_ANDAMENTO', # Status padrão para novas análises
        verbose_name="Status da Análise"
    )

    def __str__(self):
        return f"Análise {self.lote} - {self.produto_mat_prima.nome} ({self.data_analise})"

    class Meta:
        verbose_name = "Registro de Análise"
        verbose_name_plural = "Registros de Análises"
        ordering = ['-data_analise', 'lote']


class DetalheAnalise(models.Model):
    registro_analise = models.ForeignKey(RegistroAnalise, on_delete=models.CASCADE, related_name='detalhes')
    elemento_quimico = models.ForeignKey(ElementoQuimico, on_delete=models.CASCADE, related_name='detalhes_analise')
    resultado = models.DecimalField(max_digits=10, decimal_places=4)
    massa_pesada = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    absorbancia_medida = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)

    def __str__(self):
        return f"Detalhe de {self.elemento_quimico.nome} para {self.registro_analise}"

    class Meta:
        unique_together = ('registro_analise', 'elemento_quimico')
        verbose_name = "Detalhe de Análise"
        verbose_name_plural = "Detalhes de Análises"
        ordering = ['elemento_quimico__nome']