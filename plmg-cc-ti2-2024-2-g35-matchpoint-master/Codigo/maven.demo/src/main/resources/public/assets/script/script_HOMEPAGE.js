document.addEventListener("DOMContentLoaded", function () {
    const gruposContainer = document.getElementById('grupos-row');
    const emptyMessage = document.getElementById('empty-message');

    // FUNCAO PARA RESGATAR AS IMAGENS
    function carregarImagemGrupo(idGrupo, imgElement) {
        fetch(`http://localhost:4567/enderecoImagemPorGrupo?id_grupo=${encodeURIComponent(idGrupo)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar a imagem do grupo.');
                }
                return response.json();
            })
            .then(data => {
                if (data.endereco) {
                    imgElement.src = data.endereco;
                } else {
                    imgElement.src = 'assets/img/default.png'; 
                }
            })
            .catch(error => {
                console.error('Erro ao buscar a imagem:', error);
                imgElement.src = 'assets/img/default.png'; 
            });
    }

    function loadGroups() {

        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        const username = usuarioLogado.usuario;
    
        // Fazer a requisição ao backend para obter os grupos
        fetch(`http://localhost:4567/todosGrupos?usuario=${encodeURIComponent(username)}`)
            .then(response => response.json())
            .then(grupos => {
                if (grupos.length === 0) {
                    emptyMessage.style.display = 'block';
                } else {
                    emptyMessage.style.display = 'none';

                    // Mostrar todos os grupos recebidos da requisição
                    grupos.forEach((grupo) => {
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
    }

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
        img.src = `assets/img/loading.png`; 
        img.alt = grupo.esporte;
        img.className = 'card-img-top';

        carregarImagemGrupo(grupo.id, img);

        const imgContainer = document.createElement('div');
        imgContainer.className = 'card-img-container';
        imgContainer.appendChild(img);

        // Botão "Mais Detalhes" que abre o modal
        const detalhesButton = document.createElement('button');
        detalhesButton.textContent = 'Participantes';
        detalhesButton.className = 'btn btn-info btn-detalhes';
        detalhesButton.addEventListener('click', function () {
            carregarDetalhes(grupo.id);
            openModal(grupo);
        });

        // Botão "Entrar no grupo"
        const entrarButton = document.createElement('button');
        entrarButton.textContent = 'Entrar no grupo';
        entrarButton.className = 'btn btn-success btn-entrar';
        entrarButton.addEventListener('click', function () {
            console.log('Grupo ID:', grupo.id);    // Verifica o grupo.id
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
});

function openModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

// Fechar o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

function carregarDetalhes(grupoId) { 
    const url = `http://localhost:4567/obterParticipantes?grupoId=${encodeURIComponent(grupoId)}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar detalhes do grupo');
            }
            return response.json();  
        })
        .then(dadosGrupo => {
            
            document.getElementById('modal-title').textContent = 'Participantes do Grupo'; 
        
            const participantsList = document.getElementById('modal-participants');
            participantsList.innerHTML = '';  

            if (Array.isArray(dadosGrupo)) {
                dadosGrupo.forEach(participante => {
                    const listItem = document.createElement('li');
                    listItem.textContent = participante; 
                    participantsList.appendChild(listItem);
                });
            } else {
                
                alert('Formato de resposta inesperado');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar os detalhes do grupo:', error);
            alert('Erro ao carregar os detalhes do grupo. Tente novamente mais tarde.');
        });
}