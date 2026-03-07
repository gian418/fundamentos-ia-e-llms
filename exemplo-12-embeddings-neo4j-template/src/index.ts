import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { CONFIG } from "./config.ts";
import { DocumentProcessor } from "./documentProcessor.ts";
import { type PretrainedOptions } from "@huggingface/transformers";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import { displayResults } from "./util.ts";

let _neo4jVectorStore = null

async function clearAll(vectorStore:Neo4jVectorStore, nodeLabel: string) {
    console.log("Removendo todos os docuumentos existentes...")
    await vectorStore.query(`MATCH (n:\`${nodeLabel}\`) DETACH DELETE n`)
    console.log("Documentos removidos com sucesso\n")
}

try {
    console.log("Inicializando sistema de Embeddings com Neo4j...\n")

    const documentProcessor = new DocumentProcessor(
        CONFIG.pdf.path,
        CONFIG.textSplitter
    )

    const documents = await documentProcessor.loadAndSplit()
    const embeddings = new HuggingFaceTransformersEmbeddings({
        model: CONFIG.embedding.modelName,
        pretrainedOptions: CONFIG.embedding.pretrainedOptions as PretrainedOptions
    })

    // const response = await embeddings.embedQuery('JAVASCRIPT')
    // const response = await embeddings.embedDocuments(['JAVASCRIPT'])
    // console.log('response', response)

    _neo4jVectorStore = await Neo4jVectorStore.fromExistingGraph(embeddings, CONFIG.neo4j)
    clearAll(_neo4jVectorStore, CONFIG.neo4j.nodeLabel)

    for (const [index, doc] of documents.entries()) {
        console.log(`Adicionando documento ${index + 1}/${documents.length}`)
        await _neo4jVectorStore.addDocuments([doc])
    }
    console.log("\nBase de dados populada com sucesso!\n")

    console.log("ETAPA 2: Executando buscas por similaridade...")
    const questions = [
        "O que significa treinar uma rede neural?"
        // "O que é hot encoding e quando usar?"
    ]

    for (const question of questions) {
        console.log(`\n${'='.repeat(80)}`)
        console.log(`PERGUNTA: ${question}`)
        console.log('='.repeat(80))

        const results = await _neo4jVectorStore.similaritySearch(
            question,
            CONFIG.similarity.topK
        )
        displayResults(results)
    }

} catch (error) {
    console.error('error', error)
} finally {
    await _neo4jVectorStore?.close()
}