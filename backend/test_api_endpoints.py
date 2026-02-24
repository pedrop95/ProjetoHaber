#!/usr/bin/env python
"""
Script para testar os endpoints da API e validar os filtros

Este script simula requisições HTTP para os endpoints da API
para verificar se o filtro de produto está funcionando corretamente.
"""

import os
import sys
import django
import requests
import json

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projeto_haber_backend.settings')

# Carregar variáveis de ambiente
from dotenv import load_dotenv
load_dotenv()

django.setup()

from api.models import ProdutoMatPrima

print("\n" + "="*80)
print("TESTE DE ENDPOINTS DA API")
print("="*80 + "\n")

API_BASE_URL = "http://localhost:8000/api"

# Função helper para fazer requisições
def fazer_requisicao(endpoint, params=None):
    url = f"{API_BASE_URL}{endpoint}"
    print(f"\n📡 GET {url}")
    if params:
        print(f"   Parâmetros: {params}")
    
    try:
        response = requests.get(url, params=params, timeout=5)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"   Resultados: {len(data)} itens")
                return data
            elif isinstance(data, dict) and 'results' in data:
                print(f"   Resultados: {len(data['results'])} itens")
                return data['results']
            else:
                print(f"   Resposta: {data}")
                return data
        else:
            print(f"   ❌ Erro: {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print("   ❌ ERRO: Não foi possível conectar ao servidor")
        print("   ℹ️  Verifique se o Django está rodando (python manage.py runserver)")
        return None
    except Exception as e:
        print(f"   ❌ ERRO: {e}")
        return None

# Obter IDs dos produtos
print("Buscando produtos...")
produtos = ProdutoMatPrima.objects.all()
produto_ids = [p.id for p in produtos]
nomes_produtos = {p.id: p.nome for p in produtos}

if not produto_ids:
    print("❌ Nenhum produto encontrado no banco de dados!")
    sys.exit(1)

print(f"✅ Encontrados {len(produto_ids)} produtos: {list(nomes_produtos.values())}\n")

# Teste 1: Buscar todos os ConfiguracaoElementoDetalhe
print("\n" + "-"*80)
print("TESTE 1: Buscar todos os ConfiguracaoElementoDetalhe (sem filtro)")
print("-"*80)

todos_elementos = fazer_requisicao("/configuracoes-elemento-detalhe/")

# Teste 2: Filtrar por cada produto
print("\n" + "-"*80)
print("TESTE 2: Filtrar ConfiguracaoElementoDetalhe por cada produto")
print("-"*80)

for produto_id in produto_ids:
    print(f"\n📦 Filtrar por Produto ID: {produto_id} ({nomes_produtos[produto_id]})")
    
    # Usando o filtro correto
    elementos_produto = fazer_requisicao(
        "/configuracoes-elemento-detalhe/",
        params={"configuracao_analise__produto_mat_prima": produto_id}
    )
    
    if elementos_produto:
        print(f"   ✅ Encontrados {len(elementos_produto)} elementos para este produto")
        for elem in elementos_produto:
            if isinstance(elem, dict):
                elem_nome = elem.get('elemento_quimico_nome', 'Desconhecido')
                config_id = elem.get('configuracao_analise', 'N/A')
                print(f"      • {elem_nome} (Config ID: {config_id})")

# Teste 3: Comparar resultados
print("\n" + "-"*80)
print("TESTE 3: Validação de isolamento")
print("-"*80)

print("\nVerificando se há overlaps entre produtos...")
todas_ids = set()
overlaps = False

for produto_id in produto_ids:
    elementos_produto = fazer_requisicao(
        "/configuracoes-elemento-detalhe/",
        params={"configuracao_analise__produto_mat_prima": produto_id}
    )
    
    if elementos_produto:
        ids_produto = {elem['id'] for elem in elementos_produto if isinstance(elem, dict)}
        overlap = todas_ids & ids_produto
        
        if overlap:
            print(f"❌ ERRO: Produto {produto_id} tem elementos que já apareceram em outro produto!")
            print(f"   IDs duplicados: {overlap}")
            overlaps = True
        else:
            print(f"✅ Produto {produto_id}: OK (sem duplicatas)")
        
        todas_ids |= ids_produto

if not overlaps:
    print(f"\n✅ VALIDAÇÃO OK: Nenhuma sobreposição de dados entre produtos")

# Teste 4: Testar outras endpoints principais
print("\n" + "-"*80)
print("TESTE 4: Endpoints principais")
print("-"*80)

fazer_requisicao("/produtos/")
fazer_requisicao("/elementos-quimicos/")
fazer_requisicao("/configuracoes-analise/")
fazer_requisicao("/registros-analise/")
fazer_requisicao("/detalhes-analise/")

print("\n" + "="*80)
print("✅ TESTES CONCLUÍDOS")
print("="*80 + "\n")
