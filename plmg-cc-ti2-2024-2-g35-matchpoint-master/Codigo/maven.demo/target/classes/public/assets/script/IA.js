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
        const predictions = result.predictions;
        const highestPrediction = predictions.reduce((max, prediction) => prediction.probability > max.probability ? prediction : max);

        let outputMessage = "";
        if (highestPrediction.probability >= 0.5) {
            outputMessage = `Esporte identificado: ${highestPrediction.tagName} com ${Math.round(highestPrediction.probability * 100)}% de confiança.`;
            alert(`Esporte identificado: ${highestPrediction.tagName}`);

            let esporte = highestPrediction.tagName;
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
            const username = usuarioLogado.usuario;

            fetch(`http://localhost:4567/gruposIA?esporte=${encodeURIComponent(esporte)}`)
                .then(response => response.json())
                .then(grupos => {
                    const gruposContainer = document.getElementById('grupos-row');
                    const emptyMessage = document.getElementById('empty-message');

                    // Limpa o conteúdo do container antes de adicionar os novos cards
                    gruposContainer.innerHTML = '';

                    if (grupos.length === 0) {
                        emptyMessage.style.display = 'block';
                    } else {
                        emptyMessage.style.display = 'none';

                        // Criar e adicionar os cards para cada grupo
                        grupos.forEach((grupo) => {
                            console.log('Processando grupo:', grupo);  // Log para verificar os dados do grupo

                            const col = document.createElement('div');
                            col.className = 'col-md-6';

                            const card = createGroupCard(grupo, username);

                            col.appendChild(card);
                            gruposContainer.appendChild(col);
                        });
                    }
                })
                .catch(error => {
                    console.error('Erro ao carregar os grupos:', error);
                    emptyMessage.style.display = 'block';
                });

        } else {
            outputMessage = "Não foi possível prever com confiança.";
        }

        document.getElementById('resultado').innerText = outputMessage;
    } catch (error) {
        console.error('Erro ao enviar imagem:', error);
        document.getElementById('resultado').innerText = 'Erro ao enviar imagem para a API.';
    }
});


// Função para criar o card de grupo
function createGroupCard(grupo, username) {
    const card = document.createElement('div');
    card.className = 'card grupo';

    const title = document.createElement('h2');
    title.textContent = grupo.nome;

    const date = document.createElement('p');
    date.textContent = 'Data: ' + grupo.data;

    const criador = document.createElement('p');
    criador.textContent = `Criador: ${grupo.criador}`;
    criador.className = 'criador';

    const location = document.createElement('p');
    location.textContent = `Local: ${grupo.local}`;

    const img = document.createElement('img');
    img.src = grupo.imagem;
    img.alt = grupo.esporte;
    img.className = 'card-img-top';

    const imgContainer = document.createElement('div');
    imgContainer.className = 'card-img-container';
    imgContainer.appendChild(img);

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

    card.appendChild(imgContainer);
    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(criador);
    card.appendChild(location);
    card.appendChild(detalhesButton);
    card.appendChild(entrarButton);

    return card;
}

// Função para enviar a requisição ao backend para entrar no grupo
function entrarNoGrupo(grupoId, username) {
    // Cria a URL com os parâmetros de query
    const url = `http://localhost:4567/entrarNoGrupo?usuario=${encodeURIComponent(username)}&grupoId=${encodeURIComponent(grupoId)}`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => {
            if (response.ok) {
                alert('Você entrou no grupo com sucesso!');
                window.location.href = "/MeusGrupos.html"
            } else {
                alert('Erro ao entrar no grupo. Tente novamente.');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao entrar no grupo. Por favor, tente novamente.');
        });
}

loadGroups();


