# modelTrainingWorker.js — Explicação Detalhada dos Métodos

## normalize(value, min, max)
Normaliza valores contínuos para o intervalo 0–1 usando a fórmula:

$\text{normalized} = \frac{\text{value} - \text{min}}{\text{max} - \text{min}}$

Isso garante que todas as features tenham escala semelhante, evitando que uma domine o treinamento.

**Exemplo de entrada:**
- value: 129.99
- min: 39.99
- max: 199.99

**Exemplo de saída:**
- 0.56

---

## makeContext(products, users)
Constrói o contexto para codificação dos dados:
- Calcula mínimos e máximos de idade e preço.
- Indexa categorias e cores (transforma em números).
- Calcula a média de idade dos compradores por produto, normalizando.
- Retorna objetos úteis para codificação e treinamento.

Exemplo: permite transformar "acessórios" em índice 0, "preto" em índice 1, etc.

**Exemplo de entrada:**
- products: [{ name: 'Boné', category: 'acessórios', price: 39.99, color: 'preto' }, ...]
- users: [{ name: 'Rafael', age: 27, purchases: [...] }, ...]

**Exemplo de saída:**
- {
		colorsIndex: { 'preto': 0, 'cinza': 1 },
		categoriesIndex: { 'acessórios': 0 },
		minAge: 18,
		maxAge: 65,
		minPrice: 39.99,
		maxPrice: 199.99,
		...
	}

---

## oneHotWeighted(index, length, weight)
Gera um vetor one-hot (ex: [0,1,0]) para categorias ou cores, multiplicando pelo peso definido em WEIGHTS.

Exemplo: categoria "acessórios" vira [1,0,0] * 0.4.

**Exemplo de entrada:**
- index: 0
- length: 3
- weight: 0.4

**Exemplo de saída:**
- [0.4, 0, 0]

---

## encodeProduct(product, context)
Transforma um produto em vetor numérico:
- Normaliza preço e idade.
- Aplica one-hot em categoria e cor.
- Multiplica cada feature pelo peso.
- Concatena tudo em um vetor único.

Exemplo: [preço_normalizado, idade_normalizada, cat_one_hot..., cor_one_hot...]

**Exemplo de entrada:**
- product: { name: 'Boné', category: 'acessórios', price: 39.99, color: 'preto' }
- context: {...}

**Exemplo de saída:**
- [0, 0.12, 0.4, 0.3] (exemplo simplificado)

---

## encodeUser(user, context)
Transforma um usuário em vetor numérico:
- Se o usuário tem compras, calcula a média dos vetores dos produtos comprados.
- Se não tem compras, usa apenas idade normalizada.
- Ignora preço, categoria e cor se não há compras.

Exemplo: usuário sem compras vira [0, idade_normalizada, 0s...]

**Exemplo de entrada:**
- user: { name: 'Rafael', age: 27, purchases: [produto1, produto2] }
- context: {...}

**Exemplo de saída:**
- [0.15, 0.1, 0.4, 0.3] (exemplo simplificado)

---

## createTrainingData(context)
Gera os dados de treino:
- Para cada usuário com compras, codifica o usuário.
- Para cada produto, codifica o produto.
- Cria pares (usuário, produto) e rotula se o usuário comprou aquele produto (1) ou não (0).
- Retorna tensores xs (entradas) e ys (rótulos).

**Exemplo de entrada:**
- context: {...}

**Exemplo de saída:**
- xs: tensor2d de pares usuário-produto
- ys: tensor2d de rótulos (1 ou 0)

---

## configureNeuralNetAndTrain(trainData)
Cria e treina a rede neural:
- Modelo sequencial com camadas densas (128, 64, 32 neurônios).
- Camada de saída com 1 neurônio (score de recomendação).
- Usa ativação 'relu' nas camadas ocultas e 'sigmoid' na saída.
- Otimizador Adam, loss binário.
- Treina por 100 épocas, envia logs de progresso.

**Exemplo de entrada:**
- trainData: { xs: tensor2d, ys: tensor2d, inputDimention: 8 }

**Exemplo de saída:**
- model: objeto tf.Model treinado

---

## trainModel({ users })
Processo de treinamento:
- Busca produtos.
- Prepara contexto.
- Codifica produtos.
- Gera dados de treino.
- Treina o modelo.
- Atualiza progresso e sinaliza fim do treinamento.

**Exemplo de entrada:**
- users: [{ name: 'Rafael', ... }, ...]

**Exemplo de saída:**
- Mensagens de progresso e conclusão para a UI

---

## recommend({ user })
Processo de recomendação:
- Codifica o usuário.
- Concatena com todos os produtos.
- Faz previsão com o modelo treinado.
- Ordena produtos por score.
- Envia lista ordenada para a UI.

**Exemplo de entrada:**
- user: { name: 'Rafael', ... }

**Exemplo de saída:**
- recommendations: [
		{ name: 'Boné', score: 0.85 },
		{ name: 'Mochila', score: 0.67 },
		...
	]

---

## handlers
Objeto que mapeia ações recebidas para funções (treinamento e recomendação).

---

## self.onmessage
Escuta mensagens da thread principal e executa o handler correspondente.

---

Se quiser exemplos de entrada/saída de cada método, posso adicionar!