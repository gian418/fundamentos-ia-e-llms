# modelTrainingWorker.js — Exemplos de Entrada e Saída dos Métodos

## normalize(value, min, max)
**Entrada:**
- value: 129.99
- min: 39.99
- max: 199.99

**Saída:**
- 0.56

---

## makeContext(products, users)
**Entrada:**
- products: [{ name: 'Boné', category: 'acessórios', price: 39.99, color: 'preto' }, ...]
- users: [{ name: 'Rafael', age: 27, purchases: [...] }, ...]

**Saída:**
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
**Entrada:**
- index: 0
- length: 3
- weight: 0.4

**Saída:**
- [0.4, 0, 0]

---

## encodeProduct(product, context)
**Entrada:**
- product: { name: 'Boné', category: 'acessórios', price: 39.99, color: 'preto' }
- context: {...}

**Saída:**
- [0, 0.12, 0.4, 0.3] (exemplo simplificado)

---

## encodeUser(user, context)
**Entrada:**
- user: { name: 'Rafael', age: 27, purchases: [produto1, produto2] }
- context: {...}

**Saída:**
- [0.15, 0.1, 0.4, 0.3] (exemplo simplificado)

---

## createTrainingData(context)
**Entrada:**
- context: {...}

**Saída:**
- xs: tensor2d de pares usuário-produto
- ys: tensor2d de rótulos (1 ou 0)

---

## configureNeuralNetAndTrain(trainData)
**Entrada:**
- trainData: { xs: tensor2d, ys: tensor2d, inputDimention: 8 }

**Saída:**
- model: objeto tf.Model treinado

---

## trainModel({ users })
**Entrada:**
- users: [{ name: 'Rafael', ... }, ...]

**Saída:**
- Mensagens de progresso e conclusão para a UI

---

## recommend({ user })
**Entrada:**
- user: { name: 'Rafael', ... }

**Saída:**
- recommendations: [
    { name: 'Boné', score: 0.85 },
    { name: 'Mochila', score: 0.67 },
    ...
  ]

---

Se quiser exemplos mais completos ou reais, posso detalhar ainda mais!