document.addEventListener("DOMContentLoaded", function () {
    const usuarioLogadoString = localStorage.getItem('usuarioLogado');
    
    if (usuarioLogadoString) {
        const usuarioLogado = JSON.parse(usuarioLogadoString);
        const nome = usuarioLogado.usuario;

        // Buscar os detalhes do perfil do usuário logado
        fetch(`http://localhost:4567/obterPerfilUsuario?nome=${nome}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar o perfil no servidor.');
                }
                return response.json();
            })
            .then(perfil => {
                const perfilDetails = document.getElementById('perfil-details');
                perfilDetails.innerHTML = `
                    <div class="profile">
                        <div class="profile-info">
                            <div class="profile-img">
                                <img src="${perfil.foto}" alt="Foto de perfil">
                            </div>
                            <div class="profile-details">
                                <h1>${perfil.nome}</h1>
                                <div class="bio-section">
                                    <p>${perfil.bio}</p>
                                </div>
                                <!-- Adicionando o ícone de edição -->
                                <div class="editarperfil">
                                    <a href="meuperrfiledit.html">
                                        <i id="editUsernameIcon" class="fa-solid fa-pen-to-square"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Erro ao carregar o perfil:', error);
                const perfilDetails = document.getElementById('perfil-details');
                perfilDetails.innerHTML = `<p>Erro ao carregar os detalhes do perfil.</p>`;
            });
    } else {
        // Caso o nome do usuário não esteja no localStorage
        const perfilDetails = document.getElementById('perfil-details');
        perfilDetails.innerHTML = `<p>Usuário não encontrado. Por favor, faça login.</p>`;
    }
});
