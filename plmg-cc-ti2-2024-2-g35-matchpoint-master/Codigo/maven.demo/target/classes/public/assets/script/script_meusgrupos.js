document.addEventListener("DOMContentLoaded", function () {
    const gruposCriadosContainer = document.getElementById('grupos-criados-row');
    const gruposParticipandoContainer = document.getElementById('grupos-participando-row');
    const emptyCriadosMessage = document.getElementById('empty-criados-message');
    const emptyParticipandoMessage = document.getElementById('empty-participando-message');
    const user = JSON.parse(localStorage.getItem('usuarioLogado')).usuario;

    // Função para carregar imagem do grupo
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

    // Função para carregar grupos criados pelo usuário
    function loadGroupsCriados() {
        gruposCriadosContainer.innerHTML = '';

        fetch('http://localhost:4567/gruposCriados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ criador: user })  // Envia o nome do criador para o backend
        })
            .then(response => response.json())  // Converte a resposta para JSON
            .then(gruposCriados => {
                if (gruposCriados.length === 0) {
                    emptyCriadosMessage.style.display = 'block';  // Exibe mensagem se não houver grupos
                } else {
                    emptyCriadosMessage.style.display = 'none';  // Esconde a mensagem
                    gruposCriados.forEach(grupo => {
                        const col = document.createElement('div');
                        col.className = 'col-md-6';

                        const card = createGroupCard(grupo, true); // Adiciona o botão de editar e deletar para grupos criados
                        col.appendChild(card);
                        gruposCriadosContainer.appendChild(col);
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao carregar grupos:', error);
            });
    }

    // Função para carregar os grupos que o usuário participa
    function loadGroupsParticipando() {
        gruposParticipandoContainer.innerHTML = '';

        fetch(`http://localhost:4567/gruposParticipando?usuario=${encodeURIComponent(user)}`)
            .then(response => response.json())  // Converte a resposta para JSON
            .then(gruposParticipando => {
                console.log("Grupos Participando recebidos do servidor:", gruposParticipando);
                if (gruposParticipando.length === 0) {
                    emptyParticipandoMessage.style.display = 'block';  // Exibe mensagem se não houver grupos
                } else {
                    emptyParticipandoMessage.style.display = 'none';  // Esconde a mensagem
                    gruposParticipando.forEach(grupo => {
                        const col = document.createElement('div');
                        col.className = 'col-md-6';

                        const card = createGroupCard(grupo, false); // Grupos participando não mostram botões de editar ou deletar
                        col.appendChild(card);
                        gruposParticipandoContainer.appendChild(col);
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao carregar grupos participando:', error);
            });
    }

    // Função para criar um card de grupo (usado tanto para criados quanto para participados)
    function createGroupCard(grupo, isCriador) {
        const card = document.createElement('div');
        card.className = 'card grupo';

        const title = document.createElement('h2');
        title.textContent = grupo.nome;

        const date = document.createElement('p');
        date.textContent = `Data: ${grupo.data}`;

        const horario = document.createElement('p');
        horario.textContent = `Horário: ${grupo.horario}`;

        const location = document.createElement('p');
        location.textContent = `Local: ${grupo.local}`;

        const sport = document.createElement('p');
        sport.textContent = `Esporte: ${grupo.id_esporte}`;

        const participantsCount = document.createElement('p');
        participantsCount.textContent = `Máximo de Jogadores: ${grupo.jogadoresMax}`;

        const img = document.createElement('img');
        img.src = 'assets/img/loading.png';

        carregarImagemGrupo(grupo.id, img);

        img.alt = grupo.esporte;
        img.className = 'card-img-top';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'card-img-container';
        imgContainer.appendChild(img);

        card.appendChild(imgContainer);
        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(horario);
        card.appendChild(location);
        card.appendChild(sport);
        card.appendChild(participantsCount);

        // Botão "Mais Detalhes" que abre o modal
        const detalhesButton = document.createElement('button');
        detalhesButton.textContent = 'Participantes';
        detalhesButton.className = 'btn btn-info btn-detalhes';
        detalhesButton.addEventListener('click', function () {
            carregarDetalhes(grupo.id);
            openModal(grupo);
        });
        card.appendChild(detalhesButton);

        if (isCriador) {
            // Se o usuário for o criador, adiciona os botões de edição e exclusão
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-warning btn-editar';
            editButton.textContent = 'Editar';
            editButton.onclick = () => editGroup(grupo.id);
            card.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sair';
            deleteButton.textContent = 'Deletar';
            deleteButton.onclick = () => showConfirmDelete(card, grupo.id, deleteButton);
            card.appendChild(deleteButton);
        } else {
            // Botão "Sair do Grupo" para os grupos que o usuário participa
            const leaveButton = document.createElement('button');
            leaveButton.className = 'btn btn-danger btn-sair';
            leaveButton.textContent = 'Sair do Grupo';
            leaveButton.onclick = () => leaveGroup(card, grupo.id);
            card.appendChild(leaveButton);
        }

        return card;
    }

    // Função para editar o grupo
    function editGroup(groupId) {
        // Limpar os campos do formulário (deixar vazios)
        document.getElementById('groupId').value = groupId;  // Manter o ID do grupo
        document.getElementById('nome').value = '';
        document.getElementById('data').value = '';
        document.getElementById('horario').value = '';
        document.getElementById('local').value = '';
        document.getElementById('jogadoresMax').value = '';

        // Abrir o modal
        var myModal = new bootstrap.Modal(document.getElementById('editGroupModal'));
        myModal.show();
    }



    // Função para exibir a confirmação de exclusão do grupo
    function showConfirmDelete(card, groupId, deleteButton) {
        const confirmDelete = document.createElement('div');
        confirmDelete.className = 'confirm-delete';

        const confirmText = document.createElement('p');
        confirmText.textContent = 'Tem certeza que deseja deletar este grupo?';

        const confirmYes = document.createElement('button');
        confirmYes.className = 'confirm-yes';
        confirmYes.textContent = 'Sim';
        confirmYes.onclick = () => deleteGroup(card, groupId, confirmDelete);

        const confirmNo = document.createElement('button');
        confirmNo.className = 'confirm-no';
        confirmNo.textContent = 'Não';
        confirmNo.onclick = () => cancelDelete(confirmDelete, deleteButton);

        confirmDelete.appendChild(confirmText);
        confirmDelete.appendChild(confirmYes);
        confirmDelete.appendChild(confirmNo);

        card.appendChild(confirmDelete);
        deleteButton.disabled = true;
    }

    // Função para deletar o grupo no backend
    function deleteGroup(card, groupId, confirmDelete) {
        fetch(`http://localhost:4567/deletarGrupo/${groupId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    // Remove o card da interface
                    card.parentNode.removeChild(card);

                    // Esconder confirmação de deletar
                    confirmDelete.parentNode.removeChild(confirmDelete);

                    // Atualizar mensagem de grupos vazios se necessário
                    if (gruposCriadosContainer.children.length === 0) {
                        emptyCriadosMessage.style.display = 'block';
                    }
                } else {
                    console.error('Erro ao deletar grupo');
                }
            })
            .catch(error => {
                console.error('Erro ao deletar grupo:', error);
            });
    }

    // Função para cancelar a exclusão do grupo
    function cancelDelete(confirmDelete, deleteButton) {
        confirmDelete.parentNode.removeChild(confirmDelete);
        deleteButton.disabled = false;
    }

    // Função para sair de um grupo
    function leaveGroup(card, groupId) {
        const user = JSON.parse(localStorage.getItem('usuarioLogado')).usuario;  // Pegue o nome do usuário logado
        console.log("Tentando sair do grupo com ID:", groupId, "usuário:", user);  // Log para verificar o ID do grupo e o nome do usuário

        // Envia o ID do grupo e o nome do usuário para o backend
        fetch(`http://localhost:4567/sairDoGrupo/${groupId}?usuario=${encodeURIComponent(user)}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    console.log("Saída do grupo bem-sucedida");
                    // Remove o card da interface
                    card.parentNode.removeChild(card);

                    // Atualizar mensagem de grupos vazios se necessário
                    if (gruposParticipandoContainer.children.length === 0) {
                        emptyParticipandoMessage.style.display = 'block';
                    }
                } else {
                    console.error('Erro ao sair do grupo:', response.status);
                    response.text().then(text => console.error("Resposta do servidor:", text));  // Loga a resposta do servidor
                }
            })
            .catch(error => {
                console.error('Erro ao sair do grupo:', error);
            });
    }

    // Carregar ambos os grupos ao carregar a página
    loadGroupsCriados();  // Carregar os grupos que o usuário criou
    loadGroupsParticipando();  // Carregar os grupos que o usuário participa
});

// Função para enviar as atualizações do grupo editado
function enviarAtualizacao() {
    const groupId = parseInt(document.getElementById('groupId').value, 10); // Converte para número inteiro
    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;
    const local = document.getElementById('local').value;
    const jogadoresMax = parseInt(document.getElementById('jogadoresMax').value, 10); // Converte para número inteiro

    const grupoAtualizado = {
        id: groupId,
        nome: nome,
        data: data,
        horario: horario,
        local: local,
        jogadoresMax: jogadoresMax
    };
    console.log(grupoAtualizado);

    fetch('/updateGrupo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(grupoAtualizado)
    })
        .then(response => {
            console.log('Resposta do servidor:', response); // Verificar o status da resposta
            return response.json();
        })
        .then(result => {
            console.log('Resultado JSON:', result); // Verificar o conteúdo do JSON recebido
            if (result.success) {
                alert('Grupo atualizado com sucesso!');
                window.location.href = '/MeusGrupos.html';  // Redireciona para a página de grupos
            } else {
                alert('Grupo atualizado com sucesso!');
                window.location.href = '/MeusGrupos.html';
            }
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro ao enviar os dados ao servidor.');
        });
}


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