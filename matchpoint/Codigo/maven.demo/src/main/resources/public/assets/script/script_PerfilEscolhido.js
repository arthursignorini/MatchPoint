document.addEventListener("DOMContentLoaded", function () {
    // Extrair o parâmetro 'nome' da URL
    const urlParams = new URLSearchParams(window.location.search);
    const nome = urlParams.get('id');

    if (nome) {
        fetch(`http://localhost:4567/obterPerfilUsuario?nome=${nome}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar o perfil no servidor.');
                }
                return response.json();
            })
            .then(perfil => {
                console.log(perfil);
                // Definir valores padrão para 'foto' e 'bio'
                const foto = perfil.foto || 'assets/img/perfil0.jpg';
                const bio = perfil.bio || 'Sem biografia';

                const perfilDetails = document.getElementById('perfil-details');
                perfilDetails.innerHTML = `
                    <div class="profile">
                        <div class="profile-info">
                            <div class="profile-img">
                                <img src="${foto}" alt="Foto de perfil">
                            </div>
                            <div class="profile-details">
                                <h1>${perfil.nome}</h1>
                                <div class="bio-section">
                                    <p>${bio}</p>
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
        // Caso o parâmetro 'nome' não seja encontrado na URL
        const perfilDetails = document.getElementById('perfil-details');
        perfilDetails.innerHTML = `<p>Parâmetro 'nome' não encontrado na URL.</p>`;
    }
});
