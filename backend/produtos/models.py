# PROJETOHABER/backend/produtos/models.py

from django.db import models

class ProdutoMatPrima(models.Model):
    id_ou_op = models.CharField(
        max_length=255,
        unique=True,
        null=False,
        blank=False,
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
        return f"{self.nome} ({self.id_ou_op})"