# PROJETOHABER/backend/produtos/models.py

from django.db import models

class ProdutoMatPrima(models.Model):
    id_ou_op = models.CharField(
        max_length=255,
        unique=False,
        null=True,
        blank=True,
        verbose_name="ID ou OP"
    )
    nome = models.CharField(
        max_length=255,
        null=False,
        blank=False,
        verbose_name="Nome do Produto/Matéria-Prima"
    )

    class Meta:
        verbose_name = "Produto/Matéria-Prima"
        verbose_name_plural = "Produtos/Matérias-Primas"
        ordering = ['nome'] # Ordena por nome por padrão

    def __str__(self):
        produto_str = self.nome
        if self.id_ou_op:
            produto_str += f" ({self.id_ou_op})"
        return produto_str