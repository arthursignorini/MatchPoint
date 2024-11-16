document.getElementById('profileForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Previne o comportamento padrão de envio de formulário

    // Pega o objeto do usuário logado do localStorage (ajuste a chave se necessário)
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Verifica se o objeto usuarioLogado está disponível e se tem o campo "usuario"
    if (!usuarioLogado || !usuarioLogado.usuario) {
        alert('Erro: Usuário logado não encontrado. Por favor, faça login novamente.');
        return;
    }

    const loggedUserName = usuarioLogado.usuario;  // Pega o nome do usuário logado
    const userNameFromForm = document.getElementById('usernameInput').value.trim();  // Nome do usuário digitado no formulário
    const userBio = document.getElementById('bioInput').value.trim();  // Biografia do formulário

    // Verifica se os campos estão preenchidos
    if (!userNameFromForm || !userBio) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Cria um objeto com os dados do usuário
    const userUpdateData = {
        loggedUser: loggedUserName,   // Nome do usuário logado
        username: userNameFromForm,   // Nome do usuário preenchido no formulário
        bio: userBio                  // Biografia preenchida
    };

    console.log(userUpdateData);

    // Faz a requisição para o backend para atualizar o perfil do usuário
    fetch('http://localhost:4567/updateUsuario', {  // URL do seu backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // Define que o conteúdo enviado é JSON
        },
        body: JSON.stringify(userUpdateData)    // Converte o objeto para JSON
    })
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error('Erro ao atualizar o perfil do usuário.');
            }
            return response.json();
        })
        .then(data => {
            // Exibe uma mensagem de sucesso ao usuário
            alert('Perfil atualizado com sucesso!');
            console.log('Resposta do backend:', data);
            // Atualiza o nome do usuário logado no localStorage com o novo nome
            usuarioLogado.usuario = userNameFromForm;  // Atualiza o nome com o novo nome
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));  // Salva o novo nome no localStorage 
            window.location.href = "/meuperfil.html";
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao atualizar o perfil. Tente novamente.');
        });
});

// Selecionando elementos
const deleteProfileButton = document.getElementById('deleteProfileButton');
const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const cancelDeleteButton = document.getElementById('cancelDeleteButton');
const passwordInput = document.getElementById('passwordInput');

// Função para abrir o modal de confirmação
deleteProfileButton.addEventListener('click', function () {
    deleteConfirmationModal.style.display = 'flex';
});

// Função para cancelar a exclusão
cancelDeleteButton.addEventListener('click', function () {
    deleteConfirmationModal.style.display = 'none';
});

// Função para confirmar a exclusão
confirmDeleteButton.addEventListener('click', function () {
    const password = passwordInput.value;

    // Recupera o usuário logado do LocalStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        alert('Usuário não encontrado no LocalStorage!');
        return;
    }

    const username = usuarioLogado.usuario;  // Extrai o nome de usuário do objeto armazenado

    // Verifica se a senha foi inserida
    if (password === '') {
        alert('Por favor, digite sua senha.');
    } else {
        // Cria a URL com os parâmetros de query (usuário e senha)
        const url = `/deleteUsuario?usuario=${encodeURIComponent(username)}&senha=${encodeURIComponent(password)}`;

        // Faz a requisição de exclusão
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',  // Isso é opcional, mas mantém o formato
            }
        })
        .then(response => {
            // Verifica se a resposta foi bem-sucedida
            if (response.ok) {
                return response.json();  // Converte a resposta para JSON se o status for OK
            } else {
                throw new Error('Erro ao excluir o usuário');  // Lança um erro se a resposta não for OK
            }
        })
        .then(data => {
            console.log('Resposta do backend:', data.message);
            alert('Usuário excluído com sucesso!');  // Alerta de sucesso
            // Você pode adicionar um redirecionamento aqui, se necessário
            window.location.href = '/index.html';  // Redireciona para a página de login ou home após a exclusão
        })
        .catch(error => {
            console.error('Erro ao excluir o usuário:', error);
            alert('Erro ao excluir o usuário. Por favor, tente novamente.');  // Alerta de erro
        });
    }
});

// Função para abrir o seletor de imagens
function abrirSeletorDeImagens() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        alert('Erro: Usuário logado não encontrado. Por favor, faça login novamente.');
        return;
    }

    const fotoIndex = usuarioLogado.foto || 0; 

    const photoSelector = document.getElementById('photoSelector');
    const photoOptions = document.getElementById('photoOptions');

    photoOptions.innerHTML = ''; 

    for (let i = 0; i < 8; i++) {
        if (i !== fotoIndex) {
            const imgOption = document.createElement('img');
            imgOption.src = `assets/img/perfil${i}.jpg`;
            imgOption.classList.add('photo-option');
            imgOption.dataset.index = i; 
            imgOption.addEventListener('click', selecionarImagem);
            photoOptions.appendChild(imgOption);
        }
    }

    photoSelector.style.display = 'block';
    photoSelector.style.position = 'fixed';
    photoSelector.style.top = '50%';
    photoSelector.style.left = '50%';
    photoSelector.style.transform = 'translate(-50%, -50%)';
}

// Função para selecionar a imagem
function selecionarImagem(event) {
    const selectedPhoto = document.querySelector('.photo-option.selected');
    if (selectedPhoto) {
        selectedPhoto.classList.remove('selected');
    }
    event.target.classList.add('selected');
}

// Função para confirmar a seleção da imagem
function confirmarImagem() {
    const selectedPhoto = document.querySelector('.photo-option.selected');
    if (selectedPhoto) {
        const newPhotoIndex = selectedPhoto.dataset.index;
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

       
        if (!usuarioLogado || !usuarioLogado.usuario) {
            alert('Erro: Usuário logado não encontrado. Por favor, faça login novamente.');
            return;
        }

        const photoPath = `assets/img/perfil${newPhotoIndex}.jpg`;

        
        const loggedUserName = usuarioLogado.usuario; 

        
        const photoData = {
            loggedUser: loggedUserName,   
            photoPath: photoPath          
        };

        // Faz a requisição para o backend
        fetch('http://localhost:4567/updateUserPhoto', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify(photoData) 
        })
        .then(response => {
            console.log('Dados enviados ao backend:', photoData);

            if (!response.ok) {
                throw new Error('Erro ao atualizar a foto do usuário.');
            }
            return response.json();
        })
        .then(data => {
            alert('Foto alterada com sucesso!');
            console.log('Resposta do backend:', data);
            // Atualiza a foto no front-end
            usuarioLogado.foto = parseInt(newPhotoIndex, 10); 
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado)); 
            exibirFotoUsuario();  
        })
        .catch(error => {
            console.error('Erro ao atualizar a foto do usuário:', error);
            alert('Erro ao atualizar a foto. Tente novamente.');
        });

        // Fecha o seletor de fotos
        const photoSelector = document.getElementById('photoSelector');
        photoSelector.style.display = 'none';
    }
}


// Função para exibir a foto atual do usuário
function exibirFotoUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const fotoIndex = usuarioLogado.foto || 0;
    const userPhoto = document.getElementById('userPhoto');
    userPhoto.src = `assets/img/perfil${fotoIndex}.jpg`;
}

// Função para cancelar a seleção de imagem
function cancelarSelecao() {
    const photoSelector = document.getElementById('photoSelector');
    photoSelector.style.display = 'none';
}

// Chamar função para abrir seletor de imagens quando o usuário clica para alterar a foto
document.getElementById('userPhotoLabel').addEventListener('click', abrirSeletorDeImagens);

// Chamar função para confirmar a imagem selecionada
document.getElementById('confirmPhotoButton').addEventListener('click', confirmarImagem);
