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
    
    # Campos de diluição 1
    volume_final_diluicao_1 = models.DecimalField(
        max_digits=10, decimal_places=4, null=True, blank=True,
        verbose_name="Volume Final da Diluição 1 (mL)"
    )
    
    # Campos de diluição 2 (opcionais)
    volume_inicial_diluicao_2 = models.DecimalField(
        max_digits=10, decimal_places=4, null=True, blank=True,
        verbose_name="Volume Inicial da Diluição 2 (mL)"
    )
    volume_final_diluicao_2 = models.DecimalField(
        max_digits=10, decimal_places=4, null=True, blank=True,
        verbose_name="Volume Final da Diluição 2 (mL)"
    )

    def calcular_concentracao(self):
        """
        Calcula a concentração baseado na fórmula:
        - Sem diluição 2: absorbância / (massa_pesada / volume_final_diluicao_1)
        - Com diluição 2: absorbância / ((massa_pesada / volume_final_diluicao_1) * (volume_inicial_diluicao_2 / volume_final_diluicao_2))
        
        Retorna None se faltarem dados obrigatórios.
        """
        # Verifica se todos os campos obrigatórios estão preenchidos
        if not all([self.absorbancia_medida, self.massa_pesada, self.volume_final_diluicao_1]):
            return None
        
        from decimal import Decimal
        
        # Denominador da primeira parte da fórmula
        denominador_base = self.massa_pesada / self.volume_final_diluicao_1
        
        # Se não há diluição 2
        if not self.volume_inicial_diluicao_2 or not self.volume_final_diluicao_2:
            # Fórmula simples: absorbância / (massa_pesada / volume_final_diluicao_1)
            if denominador_base != 0:
                concentracao = self.absorbancia_medida / denominador_base
                return float(concentracao)
            return None
        
        # Se há diluição 2
        fator_diluicao_2 = self.volume_inicial_diluicao_2 / self.volume_final_diluicao_2
        denominador_total = denominador_base * fator_diluicao_2
        
        if denominador_total != 0:
            concentracao = self.absorbancia_medida / denominador_total
            return float(concentracao)
        
        return None

    def calcular_concentracao_ppm(self):
        """
        Calcula a concentração em ppm (partes por milhão).
        Retorna o mesmo valor que calcular_concentracao() já que é a unidade padrão.
        """
        return self.calcular_concentracao()

    def calcular_concentracao_porcentagem(self):
        """
        Calcula a concentração em porcentagem.
        Fórmula: ppm / 10000
        """
        concentracao_ppm = self.calcular_concentracao()
        if concentracao_ppm is not None:
            return concentracao_ppm / 10000
        return None

    def __str__(self):
        return f"Detalhe de {self.elemento_quimico.nome} para {self.registro_analise}"

    class Meta:
        unique_together = ('registro_analise', 'elemento_quimico')
        verbose_name = "Detalhe de Análise"
        verbose_name_plural = "Detalhes de Análises"
        ordering = ['elemento_quimico__nome']