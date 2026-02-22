const { toFillStyle } = require("pixi.js");

importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest');

const MODEL_PATH = `yolov5n_web_model/model.json`;
const LABELS_PATH = `yolov5n_web_model/labels.json`;
const INPUT_MODEL_DIMENTIONS = 640; // Tamanho de entrada esperado pelo modelo (ex: 640x640)

let _labels = []
let _model = null;
async function loadModelAndLabels() {
    await tf.ready()

    _labels = await ( await fetch(LABELS_PATH)).json();
    _model = await tf.loadGraphModel(MODEL_PATH);
    
    // warmup
    const dummyInput = tf.ones(_model.inputs[0].shape)
    await _model.executeAsync(dummyInput);
    tf.dispose(dummyInput);

    postMessage({type: 'modelLoaded'})
}
/**
 * Pré- processa a imagem para o formato aceito pelo YOLO:
 * tf.browser.fromPixels -> converte a imagem para um tensor [H, W, 3]
 * tf.image.resizeBilinear -> redimensiona para o tamanho esperado pelo modelo (ex: 640x640) [INPUT_MODEL_DIMENTIONS, INPUT_MODEL_DIMENTIONS]
 * .div(255) -> normaliza os valores para [0, 1]
 * .expandDims(0) -> adiciona a dimensão de batch, resultando em [1, H, W, 3] 
 * 
 * Uso de tf.tidy para garantir que os tensores intermediários sejam liberados da memória após a execução da função, 
 * evitando vazamentos de memória.
 */

function preprocessImage(input) { 
    return tf.tidy(() => {
        const image = tf.browser.fromPixels(input)

        return tf.image
            .resizeBilinear(image, [INPUT_MODEL_DIMENTIONS, INPUT_MODEL_DIMENTIONS])
            .div(255)
            .expandDims(0)
    })
}

async function runInference(tensor) {
    const output = await _model.executeAsync(tensor);
    tf.dispose(tensor);
    // Assume que as 3 primeiras saidas são:
    // caixas (boxes), pontuações (scores) e classes
    
    // Corrigir: usar .data() para obter os valores
    const [boxes, scores, classes] = output.slice(0, 3)
    const [boxesData, scoresData, classesData] = await Promise.all([
        boxes.data(), // Corrigido: .data() é função
        scores.data(),
        classes.data()
    ])

    output.forEach(t => t.dispose())

    return {
        boxes: boxesData,
        scores: scoresData,
        classes: classesData
    }
}

loadModelAndLabels()

self.onmessage = async ({ data }) => {
    if (data.type !== 'predict') return
    if(!_model) return

    const input = preprocessImage(data.image)
    const { width, height } = data.image;

    const inference = await runInference(input)

    debugger
    postMessage({
        type: 'prediction',
        x: 400,
        y: 400,
        score: 0
    });


};

console.log('🧠 YOLOv5n Web Worker initialized');
