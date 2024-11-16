document.addEventListener("DOMContentLoaded", function () {
    // Extrair o parâmetro 'nome' da URL
    const urlParams = new URLSearchParams(window.location.search);
    const nome = urlParams.get('id');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const username = usuarioLogado.usuario;


    if (username) {

        fetch(`http://localhost:4567/obterPerfilUsuario?nome=${username}`)
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
                </div>
            </div>
            <button id="editar-perfil" class="edit-button">Editar Perfil</button>
        </div>
                `;
                // Adiciona evento de clique no botão "Editar"
                const editButton = document.getElementById('editar-perfil');
                editButton.addEventListener('click', function () {
                    // Redireciona para a página de edição
                    window.location.href = `meuperrfiledit.html?nome=${username}`;
                });


            })
            .catch(error => {
                console.error('Erro ao carregar o perfil:', error);
                const perfilDetails = document.getElementById('perfil-details');
                perfilDetails.innerHTML = `<p>Erro ao carregar os detalhes do perfil.</p>`;
            });
    } else {
        // Caso o parâmetro 'nome' não seja encontrado na URL
        const perfilDetails = document.getElementById('perfil-details');
        perfilDetails.innerHTML = `<p>Parâmetro 'nome' não encontrado na URL.</p>`;
    }
});
