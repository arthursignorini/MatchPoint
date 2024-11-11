function loadData() {
    console.log('Loading data...');
    let profileData = JSON.parse(localStorage.getItem('usuarioLogado')) || {
        "usuario": "user1",
    };

    let loginData = JSON.parse(localStorage.getItem('login'));

    let index = loginData.contatos.findIndex(contato => contato.nome === profileData.usuario);
    if (index !== -1) {
        profileData.bio = loginData.contatos[index].bio;
        profileData.seguidores = loginData.contatos[index].seguidores || [];
        profileData.seguindo = loginData.contatos[index].seguindo || [];
    }

    return { profileData, loginData, index };
}


function saveProfileData(profileData, loginData) {
    localStorage.setItem('usuarioLogado', JSON.stringify(profileData));
    localStorage.setItem('login', JSON.stringify(loginData));
}

function exibirFotoUsuario() {
    const { profileData } = loadData(); // Carrega os dados do usuário logado do localStorage

    // Obtém o ID da foto (ou índice) armazenado no localStorage
    const fotoIndex = profileData.foto; // Pega o valor de 'foto' do objeto profileData

    const fotoElement = document.getElementById('userPhoto');
    if (fotoElement) {
        // Define o caminho da foto com base no índice (ajuste o caminho conforme necessário)
        fotoElement.src = `assets/img/perfil${fotoIndex}.jpg`; // Define o caminho da foto
    } else {
        console.error("Elemento com ID 'userPhoto' não encontrado");
    }
}

// Ao carregar o documento, chama a função para exibir a foto
document.addEventListener('DOMContentLoaded', function () {
    exibirFotoUsuario(); // Chama a função para exibir a foto do usuário
});

function abrirSeletorDeImagens() {
    const { loginData, index } = loadData();
    const fotoIndex = loginData.contatos[index].foto;

    const photoSelector = document.getElementById('photoSelector');
    const photoOptions = document.getElementById('photoOptions');

    photoOptions.innerHTML = ''; // Limpa as opções anteriores

    for (let i = 0; i < 8; i++) {
        if (i !== fotoIndex) {
            const imgOption = document.createElement('img');
            imgOption.src = `assets/img/perfil${i}.jpg`;
            imgOption.classList.add('photo-option');
            imgOption.dataset.index = i; // Armazena o índice da imagem
            imgOption.addEventListener('click', selecionarImagem);
            photoOptions.appendChild(imgOption);
        }
    }

    photoSelector.style.display = 'block';
    photoSelector.style.position = 'fixed';
    photoSelector.style.top = '50%';
    photoSelector.style.left = '50%';
    photoSelector.style.transform = 'translate(-50%, -50%)'; // Mostra o seletor de imagens
}

function selecionarImagem(event) {
    const selectedPhoto = document.querySelector('.photo-option.selected');
    if (selectedPhoto) {
        selectedPhoto.classList.remove('selected');
    }
    event.target.classList.add('selected');
}

function confirmarImagem() {
    const selectedPhoto = document.querySelector('.photo-option.selected');
    if (selectedPhoto) {
        const newPhotoIndex = selectedPhoto.dataset.index;
        const { profileData, loginData, index } = loadData();

        // Atualiza o índice da foto no objeto de loginData se o usuário estiver presente nos contatos
        if (index !== -1) {
            loginData.contatos[index].foto = parseInt(newPhotoIndex, 10);
            saveProfileData(profileData, loginData); // Salva os dados atualizados no localStorage
            exibirFotoUsuario(); // Atualiza a foto exibida
            alert("Foto alterada com sucesso!");
        }
    }

    const photoSelector = document.getElementById('photoSelector');
    photoSelector.style.display = 'none'; // Esconde o seletor de imagens
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Document loaded');
    loadProfile();
    exibirFotoUsuario(); // Chama a função para exibir a foto do usuário

    const editPhotoButton = document.getElementById('editPhotoButton');
    editPhotoButton.addEventListener('click', abrirSeletorDeImagens);

    const confirmPhotoButton = document.getElementById('confirmPhotoButton');
    confirmPhotoButton.addEventListener('click', confirmarImagem);
});

function loadProfile() {
    const { profileData, loginData, index } = loadData();

    console.log('Loaded profile data:', profileData);

    const usernameDisplay = document.getElementById('usernameDisplay');
    if (usernameDisplay) {
        usernameDisplay.textContent = profileData.usuario; // Exibir o nome de usuário
    } else {
        console.error("Element with ID 'usernameDisplay' not found");
    }

    const passwordDisplay = document.getElementById('passwordDisplay');
    if (passwordDisplay) {
        passwordDisplay.textContent = "*********"; // Ajuste conforme necessário
    } else {
        console.error("Element with ID 'passwordDisplay' not found");
    }

    const bioElement = document.getElementById('bio');
    if (bioElement) {
        if (index !== -1) {
            bioElement.innerText = loginData.contatos[index].bio;
        } else {
            bioElement.innerText = "Bio não encontrada";
        }
    } else {
        console.error("Element with ID 'bio' not found");
    }

    const commentsList = document.getElementById('commentsList');
    if (commentsList) {
        commentsList.innerHTML = ''; // Limpa a lista de comentários antes de recarregar
    }

    // Adicionar contadores de seguidores e seguindo
    const seguidoresCount = document.getElementById('seguidoresCount');
    if (seguidoresCount) {
        seguidoresCount.textContent = `Seguidores (${profileData.seguidores.length})`;
    } else {
        console.error("Element with ID 'seguidoresCount' not found");
    }

    const seguindoCount = document.getElementById('seguindoCount');
    if (seguindoCount) {
        seguindoCount.textContent = `Seguindo (${profileData.seguindo.length})`;
    } else {
        console.error("Element with ID 'seguindoCount' not found");
    }
}

function saveBio() {
    const { profileData, loginData } = loadData();
    const newBio = document.getElementById('bio').textContent;

    const index = loginData.contatos.findIndex(contato => contato.nome === profileData.usuario);
    if (index !== -1) {
        loginData.contatos[index].bio = newBio;
    }

    saveProfileData(profileData, loginData); // Salva os dados atualizados no localStorage

    alert("Bio salva com sucesso!");
}

function updateUsernameInContacts(oldUsername, newUsername, loginData) {
    loginData.contatos = loginData.contatos.map(contato => {
        if (contato.nome === oldUsername) {
            return { ...contato, nome: newUsername };
        }
        return contato;
    });
}

function updatePasswordInContacts(username, newPassword, loginData) {
    loginData.contatos = loginData.contatos.map(contato => {
        if (contato.nome === username) {
            return { ...contato, senha: newPassword };
        }
        return contato;
    });
}

function changeUsername() {
    const { profileData, loginData } = loadData();
    const oldUsername = profileData.usuario;

    const newUsername = prompt("Digite um novo nome de usuário:");
    if (newUsername) {
        profileData.usuario = newUsername;

        updateUsernameInContacts(oldUsername, newUsername, loginData);

        saveProfileData(profileData, loginData);

        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = newUsername;
        }
    }
}

function changePassword() {
    const { profileData, loginData } = loadData();
    const newPassword = prompt("Digite sua nova senha:");

    if (newPassword) {
        profileData.senha = newPassword;

        updatePasswordInContacts(profileData.usuario, newPassword, loginData);

        saveProfileData(profileData, loginData);

        const passwordDisplay = document.getElementById('passwordDisplay');
        if (passwordDisplay) {
            passwordDisplay.textContent = "*********";
        }

        alert("Senha alterada com sucesso!");
    }
}

function showFollowersOrFollowing(type) {
    const { profileData } = loadData();
    let list = [];
    let listTitle = '';
    let listContainerId = '';

    if (type === 'seguidores') {
        list = profileData.seguidores;
        listTitle = 'Seguidores';
        listContainerId = 'followersList';
    } else if (type === 'seguindo') {
        list = profileData.seguindo;
        listTitle = 'Seguindo';
        listContainerId = 'followingList';
    }

    const cardContent = document.getElementById('cardContent');
    if (cardContent) {
        // Limpa o conteúdo anterior, se houver
        cardContent.innerHTML = '';

        // Adiciona o título
        const titleElement = document.createElement('h3');
        titleElement.textContent = listTitle;
        cardContent.appendChild(titleElement);

        // Adiciona o container da lista
        const listContainer = document.createElement('div');
        listContainer.id = listContainerId;
        cardContent.appendChild(listContainer);

        // Adiciona a lista
        const listElement = document.createElement('ul');
        list.forEach(item => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `perfilescolhido.html?id=${item}`;
            link.textContent = item;
            listItem.appendChild(link);
            listElement.appendChild(listItem);
        });
        listContainer.appendChild(listElement);
    } else {
        console.error(`Element with ID 'cardContent' not found`);
    }
}







document.getElementById('seguidoresCount').addEventListener('click', () => showFollowersOrFollowing('seguidores'));
document.getElementById('seguindoCount').addEventListener('click', () => showFollowersOrFollowing('seguindo'));
