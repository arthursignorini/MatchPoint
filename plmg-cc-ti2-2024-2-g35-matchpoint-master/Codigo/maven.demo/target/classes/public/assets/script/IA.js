document.getElementById('imagem').addEventListener('change', function () {
    const fileInput = document.getElementById('imagem');
    const file = fileInput.files[0];

    if (file) {
        document.getElementById('uploadBtn').disabled = false;
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgElement = document.getElementById('imagem-preview');
            imgElement.style.display = 'block';
            imgElement.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        document.getElementById('uploadBtn').disabled = true;
    }
});

document.getElementById('uploadBtn').addEventListener('click', async function () {
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
        handlePredictionResult(result.predictions);

    } catch (error) {
        console.error('Erro ao enviar imagem:', error);
        document.getElementById('resultado').innerText = 'Erro ao enviar imagem para a API.';
    }
});

function handlePredictionResult(predictions) {
    const highestPrediction = predictions.reduce((max, prediction) => 
        prediction.probability > max.probability ? prediction : max
    );

    let outputMessage = "";
    if (highestPrediction.probability >= 0.5) {
        outputMessage = `Esporte identificado: ${highestPrediction.tagName} com ${Math.round(highestPrediction.probability * 100)}% de confiança.`;
        alert(`Esporte identificado: ${highestPrediction.tagName}`);
        pegarGrupos(highestPrediction.tagName);
    } else {
        outputMessage = "Não foi possível prever com confiança.";
    }

    document.getElementById('resultado').innerText = outputMessage;
}

function pegarGrupos(esporte) {

    fetch(`http://localhost:4567/gruposIA?esporte=${encodeURIComponent(esporte)}`)
        .then(response => response.json())
        .then(grupos => {
            console.log("Grupos recebidos:", grupos); // Log para verificar os dados recebidos
            displayGroups(grupos); // Função para exibir os grupos na interface
        })
        .catch(error => {
            console.error('Erro ao carregar os grupos:', error);
            document.getElementById('empty-message').style.display = 'block';
        });
}

function displayGroups(grupos, username) {
    const gruposContainer = document.getElementById('grupos-row');
    const emptyMessage = document.getElementById('empty-message');

    // Limpar o conteúdo anterior
    gruposContainer.innerHTML = '';

    // Verifica se há grupos para exibir
    if (grupos.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';

        // Para cada grupo, cria um card e adiciona ao contêiner
        grupos.forEach(grupo => {
            const card = createGroupCard(grupo, username);
            gruposContainer.appendChild(card);
        });
    }
}

// Função para criar o card de grupo
function createGroupCard(grupo, username) {
    const card = document.createElement('div');
    card.className = 'card grupo';

    // Título do grupo
    const title = document.createElement('h2');
    title.textContent = grupo.nome;

    // Data do grupo
    const date = document.createElement('p');
    date.textContent = 'Data: ' + grupo.data;

    // Criador do grupo
    const criador = document.createElement('p');
    criador.textContent = `Criador: ${grupo.criador}`;
    criador.className = 'criador';

    // Local do grupo
    const location = document.createElement('p');
    location.textContent = `Local: ${grupo.local}`;

    // Imagem do grupo
    const img = document.createElement('img');
    img.src = grupo.imagem; // Imagem de carregamento inicial
    img.alt = grupo.esporte;
    img.className = 'card-img-top';


    // Container da imagem
    const imgContainer = document.createElement('div');
    imgContainer.className = 'card-img-container';
    imgContainer.appendChild(img);

    // Botão "Mais Detalhes"
    const detalhesButton = document.createElement('a');
    detalhesButton.textContent = 'Mais Detalhes';
    detalhesButton.className = 'btn btn-info btn-detalhes';
    detalhesButton.href = `detalhes_grupo.html?grupo=${encodeURIComponent(grupo.nome)}`;

    // Botão "Entrar no grupo"
    const entrarButton = document.createElement('button');
    entrarButton.textContent = 'Entrar no grupo';
    entrarButton.className = 'btn btn-success btn-entrar';
    entrarButton.addEventListener('click', function () {
        console.log('Grupo ID:', grupo.id);    
        console.log('Username:', username);    
        entrarNoGrupo(grupo.id, username);     
    });

    // Montando o card
    card.appendChild(imgContainer);
    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(criador);
    card.appendChild(location);
    card.appendChild(detalhesButton);
    card.appendChild(entrarButton);

    return card;
}

