from django.db import models
# Importa os modelos corretos dos apps produtos e elementos
from produtos.models import ProdutoMatPrima
from elementos.models import ElementoQuimico

class ConfiguracaoAnalise(models.Model):
    produto_mat_prima = models.ForeignKey(ProdutoMatPrima, on_delete=models.CASCADE, related_name='configuracoes')
    # Removido elemento_quimico daqui.
    # Os elementos e suas configurações específicas agora estão em ConfiguracaoElementoDetalhe
    elementos = models.ManyToManyField(
        ElementoQuimico,
        through='ConfiguracaoElementoDetalhe',
        related_name='configuracoes_analise'
    )

    def __str__(self):
        return f"Configuração para {self.produto_mat_prima.nome}"

    class Meta:
        # Garante que não haja duas configurações de análise idênticas para o mesmo produto,
        # embora os detalhes dos elementos possam variar.
        # Se você quiser que a combinação de produto E conjunto de elementos seja única,
        # precisaremos de lógica adicional ou remoção desta constraint.
        # Por enquanto, mantemos essa constraint que existia implicitamente quando havia 1 elemento.
        # Mas agora, 'produto_mat_prima' sozinho não garante unicidade da CONFIGURAÇÃO,
        # apenas da base da configuração. Se quiser que a mesma configuracao_analise_id
        # nao tenha dois do mesmo elemento, isso sera tratado na inserção do formulario.
        unique_together = ('produto_mat_prima',) # Isso pode ser removido se um produto puder ter várias "configurações base"

# NOVO MODELO INTERMEDIÁRIO
class ConfiguracaoElementoDetalhe(models.Model):
    configuracao_analise = models.ForeignKey(ConfiguracaoAnalise, on_delete=models.CASCADE, related_name='detalhes_elementos')
    elemento_quimico = models.ForeignKey(ElementoQuimico, on_delete=models.CASCADE) # Este é obrigatório e precisa do ID

    # ESTES SÃO OBRIGATÓRIOS (não têm null=True, blank=True)
    diluicao1_X = models.DecimalField(max_digits=10, decimal_places=4)
    diluicao1_Y = models.DecimalField(max_digits=10, decimal_places=4)
    
    # ESTES SÃO OPCIONAIS (têm null=True, blank=True)
    diluicao2_X = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    diluicao2_Y = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    limite_min = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    limite_max = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)

    class Meta:
        unique_together = ('configuracao_analise', 'elemento_quimico')

    def __str__(self):
        return f"{self.configuracao_analise.produto_mat_prima.nome} - {self.elemento_quimico.simbolo}"

class RegistroAnalise(models.Model):
    STATUS_CHOICES = [
        ('EM_ANDAMENTO', 'Em Andamento'),
        ('CONCLUIDO', 'Concluído'),
        ('CANCELADO', 'Cancelado'),
    ]

    produto_mat_prima = models.ForeignKey(ProdutoMatPrima, on_delete=models.CASCADE, related_name='registros_analise_api')
    data_analise = models.DateField()
    analista = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='EM_ANDAMENTO')

    def __str__(self):
        return f"Registro de Análise para {self.produto_mat_prima.nome} em {self.data_analise}"

class DetalheAnalise(models.Model):
    registro_analise = models.ForeignKey(RegistroAnalise, on_delete=models.CASCADE, related_name='detalhes')
    # Agora, configuracao_analise não é mais o FK principal.
    # O FK será para o ConfiguracaoElementoDetalhe, que contém os dados da diluição e limites.
    configuracao_elemento_detalhe = models.ForeignKey(
        ConfiguracaoElementoDetalhe,
        on_delete=models.CASCADE,
        related_name='detalhes_analise_registrados' # Novo related_name
    )
    massa_pesada = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    absorbancia_medida = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    resultado = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True) # Campo para o resultado calculado

    class Meta:
        unique_together = ('registro_analise', 'configuracao_elemento_detalhe') # Garante que não haja duplicatas no mesmo registro

    def __str__(self):
        return f"Detalhe para {self.registro_analise.produto_mat_prima.nome} - {self.configuracao_elemento_detalhe.elemento_quimico.simbolo}"