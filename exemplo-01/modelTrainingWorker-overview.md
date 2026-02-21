# modelTrainingWorker.js — Visão Geral

Este arquivo implementa um Web Worker para treinar e usar um modelo de recomendação de produtos com TensorFlow.js, rodando no navegador. Ele processa dados de usuários e produtos, treina uma rede neural, e faz recomendações personalizadas.

## Principais etapas:

1. **Importação e Constantes**
   - Importa TensorFlow.js.
   - Define pesos para cada feature (categoria, cor, preço, idade).

2. **Normalização e Contexto**
   - Normaliza valores contínuos (preço, idade).
   - Prepara o contexto: indexa categorias/cores, calcula mínimos/máximos, normaliza médias de idade dos compradores.

3. **Codificação dos Dados**
   - Transforma produtos e usuários em vetores numéricos (one-hot e normalização).

4. **Dados de Treinamento**
   - Monta pares (usuário, produto) e rotula se o usuário comprou aquele produto.

5. **Treinamento do Modelo**
   - Cria e treina uma rede neural sequencial.
   - Envia logs de progresso para a UI.

6. **Recomendação**
   - Codifica o usuário, concatena com todos os produtos, faz previsão, ordena produtos por pontuação e envia recomendações.

7. **Handlers e Mensagens**
   - Define handlers para ações de treinamento e recomendação.
   - O worker escuta mensagens da thread principal e executa o handler correspondente.

---

**Resumo:**
Esse worker prepara vetores numéricos, treina uma rede neural para prever se um usuário compraria um produto, e usa esse modelo para recomendar produtos ordenados por probabilidade. Tudo é feito de forma assíncrona, isolada da UI, para não travar o navegador.