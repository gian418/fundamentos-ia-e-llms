# Fluxo do Treinamento no modelTrainingWorker.js

Este documento descreve a ordem e o fluxo das etapas do treinamento de recomendação dentro do Worker.

---

## 1. Recebimento da Mensagem de Treinamento
- O Worker recebe uma mensagem da thread principal (UI) com a ação `trainModel` e os dados dos usuários.

## 2. Leitura dos Dados dos Produtos
- O Worker faz um fetch para `/data/products.json` para obter a lista de produtos.

## 3. Preparação do Contexto
- Chama `makeContext(products, users)`:
  - Calcula mínimos/máximos de preço e idade.
  - Indexa categorias e cores.
  - Normaliza médias de idade dos compradores por produto.
  - Gera vetores codificados para cada produto.

## 4. Codificação dos Dados
- Para cada produto: codifica em vetor numérico.
- Para cada usuário: codifica em vetor numérico (média dos produtos comprados ou apenas idade).

## 5. Criação dos Dados de Treinamento
- Chama `createTrainingData(context)`:
  - Gera pares (usuário, produto).
  - Rotula se o usuário comprou aquele produto (1) ou não (0).
  - Cria tensores xs (entradas) e ys (rótulos).

## 6. Configuração e Treinamento da Rede Neural
- Chama `configureNeuralNetAndTrain(trainData)`:
  - Cria modelo sequencial com camadas densas.
  - Compila o modelo.
  - Treina por 100 épocas.
  - Envia logs de progresso para a UI.

## 7. Finalização do Treinamento
- Ao terminar, envia mensagem de progresso 100% e sinaliza `trainingComplete` para a UI.

---

## Resumo Visual

1. UI → Worker: `trainModel` (com usuários)
2. Worker → fetch produtos
3. Worker → prepara contexto
4. Worker → codifica dados
5. Worker → cria dados de treino
6. Worker → treina modelo
7. Worker → envia status para UI

---

Se quiser o fluxo de recomendação, posso montar também!