document.getElementById('imagem').addEventListener('change', function() {
    const fileInput = document.getElementById('imagem');
    const file = fileInput.files[0];
    
    if (file) {
        document.getElementById('uploadBtn').disabled = false;

        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.getElementById('imagem-preview');
            imgElement.style.display = 'block';
            imgElement.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        document.getElementById('uploadBtn').disabled = true;
    }
});

document.getElementById('uploadBtn').addEventListener('click', async function() {
    const fileInput = document.getElementById('imagem');
    const file = fileInput.files[0];

    if (!file) return alert("Por favor, selecione uma imagem.");

    const endpoint = "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/dc06014f-a870-4eed-a1fc-b89a273311e6/classify/iterations/MatchPoint/image";
    const predictionKey = "7f7e301ecf9247798b05bc9f12567333";

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Prediction-Key': predictionKey,
                'Content-Type': 'application/octet-stream'
            },
            body: file
        });

        if (!response.ok) {
            throw new Error(`Erro ao enviar a imagem: ${response.statusText}`);
        }

        const result = await response.json();
        const predictions = result.predictions;
        const highestPrediction = predictions.reduce((max, prediction) => prediction.probability > max.probability ? prediction : max);

        let outputMessage = "";
        if (highestPrediction.probability >= 0.5) {
            outputMessage = `Esporte identificado: ${highestPrediction.tagName} com ${Math.round(highestPrediction.probability * 100)}% de confiança.`;
            alert(`Esporte identificado: ${highestPrediction.tagName}`); // Alerta com o nome do esporte
        } else {
            outputMessage = "Não foi possível prever com confiança.";
        }

        document.getElementById('resultado').innerText = outputMessage;
    } catch (error) {
        console.error('Erro ao enviar imagem:', error);
        document.getElementById('resultado').innerText = 'Erro ao enviar imagem para a API.';
    }
});
