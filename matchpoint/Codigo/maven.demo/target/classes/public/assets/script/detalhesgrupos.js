document.addEventListener("DOMContentLoaded", function () {
    console.log(localStorage.getItem('id'));
    // Função para carregar os detalhes do grupo
    fetch("http://localhost:4567/participantes/" + localStorage.getItem('id'), {
        method: "GET",
    })
        .then(response=>{
            if(response.ok){
                console.log(response.json);
                return response.json();
            }else{
                alert("Nao foi possivel carregar as informações");
            }
        })
        .then(data=>{
            console.log(data);
            montarCards([data]);
        })
        .catch(error => {
            console.error('Erro ao buscar participantes:', error);
            alert("NAO CHAMOU O ENDPOINT");
        });


});

// Função para criar um card
function criarCardDoGrupo(grupo) {
    const card = document.createElement('div');
    card.classList.add('card');

    const nomeDoGrupo = document.createElement('h3');
    nomeDoGrupo.textContent = `${grupo.nome}`;
    card.appendChild(nomeDoGrupo);

    const participantes = document.createElement('p');
    participantes.innerHTML = `<strong>Participantes:</strong> ${grupo.participantes.join(', ')}`;
    card.appendChild(participantes);

    return card;
}

// Função para montar os cards e adicionar ao div com id "grupo-details-content"
function montarCards(grupos) {
    const cardsContainer = document.getElementById('grupo-details-content');
    cardsContainer.innerHTML = '';

    grupos.forEach(grupo => {
        const card = criarCardDoGrupo(grupo);
        cardsContainer.appendChild(card);
    });
}


