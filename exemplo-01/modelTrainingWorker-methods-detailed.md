# modelTrainingWorker.js — Explicação Detalhada dos Métodos

## normalize(value, min, max)
Normaliza valores contínuos para o intervalo 0–1 usando a fórmula:

$\text{normalized} = \frac{\text{value} - \text{min}}{\text{max} - \text{min}}$

Isso garante que todas as features tenham escala semelhante, evitando que uma domine o treinamento.

---

## makeContext(products, users)
Constrói o contexto para codificação dos dados:
- Calcula mínimos e máximos de idade e preço.
- Indexa categorias e cores (transforma em números).
- Calcula a média de idade dos compradores por produto, normalizando.
- Retorna objetos úteis para codificação e treinamento.

Exemplo: permite transformar "acessórios" em índice 0, "preto" em índice 1, etc.

---

## oneHotWeighted(index, length, weight)
Gera um vetor one-hot (ex: [0,1,0]) para categorias ou cores, multiplicando pelo peso definido em WEIGHTS.

Exemplo: categoria "acessórios" vira [1,0,0] * 0.4.

---

## encodeProduct(product, context)
Transforma um produto em vetor numérico:
- Normaliza preço e idade.
- Aplica one-hot em categoria e cor.
- Multiplica cada feature pelo peso.
- Concatena tudo em um vetor único.

Exemplo: [preço_normalizado, idade_normalizada, cat_one_hot..., cor_one_hot...]

---

## encodeUser(user, context)
Transforma um usuário em vetor numérico:
- Se o usuário tem compras, calcula a média dos vetores dos produtos comprados.
- Se não tem compras, usa apenas idade normalizada.
- Ignora preço, categoria e cor se não há compras.

Exemplo: usuário sem compras vira [0, idade_normalizada, 0s...]

---

## createTrainingData(context)
Gera os dados de treino:
- Para cada usuário com compras, codifica o usuário.
- Para cada produto, codifica o produto.
- Cria pares (usuário, produto) e rotula se o usuário comprou aquele produto (1) ou não (0).
- Retorna tensores xs (entradas) e ys (rótulos).

---

## configureNeuralNetAndTrain(trainData)
Cria e treina a rede neural:
- Modelo sequencial com camadas densas (128, 64, 32 neurônios).
- Camada de saída com 1 neurônio (score de recomendação).
- Usa ativação 'relu' nas camadas ocultas e 'sigmoid' na saída.
- Otimizador Adam, loss binário.
- Treina por 100 épocas, envia logs de progresso.

---

## trainModel({ users })
Processo de treinamento:
- Busca produtos.
- Prepara contexto.
- Codifica produtos.
- Gera dados de treino.
- Treina o modelo.
- Atualiza progresso e sinaliza fim do treinamento.

---

## recommend({ user })
Processo de recomendação:
- Codifica o usuário.
- Concatena com todos os produtos.
- Faz previsão com o modelo treinado.
- Ordena produtos por score.
- Envia lista ordenada para a UI.

---

## handlers
Objeto que mapeia ações recebidas para funções (treinamento e recomendação).

---

## self.onmessage
Escuta mensagens da thread principal e executa o handler correspondente.

---

Se quiser exemplos de entrada/saída de cada método, posso adicionar!