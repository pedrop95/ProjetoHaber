#!/usr/bin/env python
"""
Script de teste para validar isolamento de dados por produto

Este script verifica se os elementos químicos e suas diluições estão
corretamente isolados por produto. Testa se:
1. ConfiguracaoAnalise é unique por produto
2. ConfiguracaoElementoDetalhe filtra corretamente por produto
3. Não há vazamento de dados entre produtos
"""

import os
import sys
import django
import json
from decimal import Decimal

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projeto_haber_backend.settings')

# Carregar variáveis de ambiente
from dotenv import load_dotenv
load_dotenv()

django.setup()

from api.models import ProdutoMatPrima, ElementoQuimico, ConfiguracaoAnalise, ConfiguracaoElementoDetalhe
from django.db.models import Q, Count

def cor_verde(texto):
    return f"\033[92m{texto}\033[0m"

def cor_vermelho(texto):
    return f"\033[91m{texto}\033[0m"

def cor_amarelo(texto):
    return f"\033[93m{texto}\033[0m"

def cor_azul(texto):
    return f"\033[94m{texto}\033[0m"

print("\n" + "="*80)
print(cor_azul("TESTE DE ISOLAMENTO DE DADOS POR PRODUTO"))
print("="*80 + "\n")

# Teste 1: Verificar se ConfiguracaoAnalise é unique por produto
print(cor_azul("TESTE 1: ConfiguracaoAnalise deve ser unique por produto"))
print("-" * 80)

produtos = ProdutoMatPrima.objects.all()
print(f"Total de produtos: {len(produtos)}\n")

configuracoes = ConfiguracaoAnalise.objects.all()
print(f"Total de ConfiguracaoAnalise: {len(configuracoes)}\n")

# Verificar se há duplicatas (deve haver apenas 1 por produto)
prods_com_multiplas_configs = ConfiguracaoAnalise.objects.values('produto_mat_prima').annotate(
    count=Count('id')
).filter(count__gt=1)

if prods_com_multiplas_configs.exists():
    print(cor_vermelho("❌ ERRO: Há produtos com múltiplas ConfiguracaoAnalise!"))
    for item in prods_com_multiplas_configs:
        print(f"   Produto ID {item['produto_mat_prima']}: {item['count']} configurações")
else:
    print(cor_verde("✅ OK: Cada produto tem no máximo 1 ConfiguracaoAnalise"))

print()

# Teste 2: Para cada produto, verificar os elementos configurados
print(cor_azul("TESTE 2: Elementos configurados por produto"))
print("-" * 80)

for produto in produtos:
    try:
        config = ConfiguracaoAnalise.objects.get(produto_mat_prima=produto)
        elementos = ConfiguracaoElementoDetalhe.objects.filter(
            configuracao_analise=config
        ).select_related('elemento_quimico')
        
        print(f"\n📦 Produto: {produto.nome} (ID: {produto.id})")
        print(f"   ConfiguracaoAnalise ID: {config.id}")
        print(f"   Elementos configurados: {len(elementos)}")
        
        for elem in elementos:
            print(f"      • {elem.elemento_quimico.nome} ({elem.elemento_quimico.simbolo})")
            print(f"        - Diluição 1: {elem.diluicao1_X} / {elem.diluicao1_Y}")
            if elem.diluicao2_X or elem.diluicao2_Y:
                print(f"        - Diluição 2: {elem.diluicao2_X} / {elem.diluicao2_Y}")
    except ConfiguracaoAnalise.DoesNotExist:
        print(f"\n⚠️  Produto: {produto.nome} (ID: {produto.id}) - Sem ConfiguracaoAnalise")

print()

# Teste 3: Simular filtro de API - Verificar isolamento
print(cor_azul("TESTE 3: Filtro de isolamento por produto"))
print("-" * 80)

erro_identificado = False

for produto in produtos:
    # Simular a query que o frontend faz
    elementos_filtrados = ConfiguracaoElementoDetalhe.objects.filter(
        configuracao_analise__produto_mat_prima=produto
    ).select_related('elemento_quimico', 'configuracao_analise__produto_mat_prima')
    
    print(f"\n📦 Produto: {produto.nome} (ID: {produto.id})")
    print(f"   Elementos retornados pelo filtro: {elementos_filtrados.count()}")
    
    # Verificar se os elementos retornados pertencem de fato a este produto
    for elem in elementos_filtrados:
        if elem.configuracao_analise.produto_mat_prima.id != produto.id:
            print(cor_vermelho(f"   ❌ ERRO: Elemento {elem.elemento_quimico.nome} não pertence a este produto!"))
            print(f"      Elemento pertence a: {elem.configuracao_analise.produto_mat_prima.nome}")
            erro_identificado = True
        else:
            print(f"   ✅ {elem.elemento_quimico.nome} ({elem.elemento_quimico.simbolo}) - OK")

if not erro_identificado:
    print(f"\n{cor_verde('✅ OK: Isolamento correto - sem vazamento de dados')}")

print()

# Teste 4: Verificar se há elementos órfãos (sem configuração)
print(cor_azul("TESTE 4: Elementos órfãos"))
print("-" * 80)

# Contar todos os elementos
todos_elementos = ElementoQuimico.objects.all()
elementos_configurados = ConfiguracaoElementoDetalhe.objects.values_list(
    'elemento_quimico_id', flat=True
).distinct()

elementos_orfaos = todos_elementos.exclude(id__in=elementos_configurados)

print(f"Total de elementos químicos: {todos_elementos.count()}")
print(f"Elementos configurados em algum produto: {len(elementos_configurados)}")
print(f"Elementos órfãos (não configurados): {elementos_orfaos.count()}")

if elementos_orfaos.exists():
    print("\nElementos órfãos:")
    for elem in elementos_orfaos:
        print(f"   • {elem.nome} ({elem.simbolo})")

print()

# Resumo final
print(cor_azul("="*80))
print(cor_verde("✅ TESTES COMPLETADOS"))
print("="*80 + "\n")

print("📝 RESUMO:")
print(f"   • Total de produtos: {produtos.count()}")
print(f"   • Total de configurações: {configuracoes.count()}")
print(f"   • Total de elementos: {todos_elementos.count()}")
print(f"   • Total de configurações de elementos: {ConfiguracaoElementoDetalhe.objects.count()}")
print(f"   • Elementos órfãos: {elementos_orfaos.count()}")
print()
