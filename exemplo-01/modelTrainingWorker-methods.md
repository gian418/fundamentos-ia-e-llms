# modelTrainingWorker.js — Métodos Detalhados

## normalize(value, min, max)
Normaliza valores contínuos para o intervalo 0–1.

## makeContext(products, users)
Prepara o contexto: indexa categorias/cores, calcula mínimos/máximos, normaliza médias de idade dos compradores.

## oneHotWeighted(index, length, weight)
Gera um vetor one-hot para categorias/cores, multiplicando pelo peso.

## encodeProduct(product, context)
Transforma um produto em vetor numérico, usando one-hot e normalização.

## encodeUser(user, context)
Transforma um usuário em vetor numérico, usando média dos produtos comprados ou apenas idade se não comprou nada.

## createTrainingData(context)
Monta pares (usuário, produto) e rotula se o usuário comprou aquele produto. Gera tensores para treinamento.

## configureNeuralNetAndTrain(trainData)
Cria e treina uma rede neural sequencial (camadas densas). Envia logs de progresso.

## trainModel({ users })
Busca produtos, prepara contexto, gera dados de treino, treina o modelo e sinaliza progresso.

## recommend({ user })
Codifica o usuário, concatena com todos os produtos, faz previsão, ordena produtos por pontuação e envia recomendações.

## handlers
Mapeia ações recebidas para funções (treinamento e recomendação).

## self.onmessage
Escuta mensagens da thread principal e executa o handler correspondente.

---
Se quiser exemplos ou explicações de cada método, posso detalhar ainda mais!