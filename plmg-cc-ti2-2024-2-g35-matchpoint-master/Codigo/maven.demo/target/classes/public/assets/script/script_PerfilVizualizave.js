function cards(searchTerm = '') {
    // Selecionar o elemento onde os cards serão adicionados
    let container = document.getElementById("container-dos-cards");

    // Limpar o container antes de adicionar os novos cards
    container.innerHTML = '';

    // Fazer uma requisição ao backend para obter os usuários do banco de dados
    fetch('http://localhost:4567/mostrarTodosUsuarios')  // Substitua pela URL correta da sua API
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar os usuários');
            }
            return response.json();
        })
        .then(usuariosCadastrados => {
            // Obter o usuário logado do localStorage
            let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")).usuario;

            // Iterar sobre a lista de usuários cadastrados
            for (let usuario of usuariosCadastrados) {
                // Verificar se o usuário não é o usuário logado e se corresponde ao termo de busca
                if (usuario.nome !== usuarioLogado && usuario.nome.toLowerCase().includes(searchTerm.toLowerCase())) {
                    
                    // Fazer uma requisição para obter o caminho da imagem de cada usuário
                    fetch(`http://localhost:4567/obterCaminhoImagem/${usuario.id}`) // Chama a nova rota com o ID do usuário
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Erro ao buscar o caminho da imagem');
                            }
                            return response.text();  // O caminho da imagem é retornado como texto
                        })
                        .then(caminhoImagem => {
                            // Criar o card com a imagem retornada
                            let cardDiv = `
                                <div class="card mb-3">
                                    <div class="row g-0">
                                        <div class="col-md-4">
                                            <img src="${caminhoImagem}" class="img-fluid rounded-start" alt="Imagem de perfil">
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h5 class="card-title">@${usuario.nome}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

                            // Criar o link para o perfil escolhido
                            let link = `<a href="perfilescolhido.html?id=${usuario.nome}" class="text-decoration-none text-dark">${cardDiv}</a>`;

                            // Adicionar o card ao container
                            container.insertAdjacentHTML('beforeend', link);
                        })
                        .catch(error => {
                            console.error('Erro ao buscar o caminho da imagem:', error);
                            // Aqui você pode optar por mostrar a imagem padrão em caso de erro:
                            let cardDiv = `
                                <div class="card mb-3">
                                    <div class="row g-0">
                                        <div class="col-md-4">
                                            <img src="assets/img/perfil0.jpg" class="img-fluid rounded-start" alt="Imagem de perfil">
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h5 class="card-title">@${usuario.nome}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

                            let link = `<a href="perfilescolhido.html?id=${usuario.nome}" class="text-decoration-none text-dark">${cardDiv}</a>`;
                            container.insertAdjacentHTML('beforeend', link);
                        });
                }
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os usuários:', error);
            alert('Não foi possível carregar os usuários.');
        });
}

document.addEventListener("DOMContentLoaded", function () {
    cards();

    // Adicionar evento ao botão de busca
    document.querySelector('.search-button').addEventListener('click', function () {
        var searchTerm = document.querySelector('.search-input').value;
        cards(searchTerm);
    });

    // Adicionar evento para filtrar conforme o usuário digita
    document.querySelector('.search-input').addEventListener('input', function () {
        var searchTerm = document.querySelector('.search-input').value;
        cards(searchTerm);
    });
});