let enderecoImagem = "";

document.addEventListener('DOMContentLoaded', function () {
    var dataInput = document.getElementById('data');
    var jogadoresInput = document.getElementById('jogadores');
    var esporteSelect = document.getElementById('esporte');
    var placeholder = document.querySelector('.foto-placeholder');
    var avisoEsporteNaoSelecionado = document.getElementById('avisoEsporteNaoSelecionado');
    var avisoDataInvalida = document.getElementById('avisoDataInvalida');
    //let Nomeusuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    limiteMaximoMensagem.style.display = 'none';



    // Verifica a data selecionada
    dataInput.addEventListener("change", function () {
        var hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        var partesData = dataInput.value.split("-");
        var dataSelecionada = new Date(partesData[0], partesData[1] - 1, partesData[2]);

        if (dataSelecionada < hoje) {
            avisoDataInvalida.style.display = "block";
        } else {
            avisoDataInvalida.style.display = "none";
        }
    });

    // Verifica o número de jogadores
    jogadoresInput.addEventListener('input', function () {
        var avisoLimitemax = document.getElementById('avisoLimitemax');
        var jogadoresValue = parseInt(jogadoresInput.value, 10);

        if (jogadoresValue > 30) {
            avisoLimitemax.style.display = 'block';
        } else {
            avisoLimitemax.style.display = 'none';
        }
    });
    jogadoresInput.addEventListener('input', function () {
        var avisoLimitemin = document.getElementById('avisoLimitemin');
        var jogadoresValue = parseInt(jogadoresInput.value, 10);

        if (jogadoresValue < 2) {
            avisoLimitemin.style.display = 'block';
        } else {
            avisoLimitemin.style.display = 'none';
        }
    });

    // Atualiza as opções de imagem e comportamento do placeholder ao alterar o esporte selecionado
    esporteSelect.addEventListener('change', function () {
        var selectedSport = esporteSelect.value;

        if (selectedSport) {
            placeholder.onclick = function () {
                showImageSelection(selectedSport);
            };
            avisoEsporteNaoSelecionado.style.display = 'none';
        } else {
            placeholder.onclick = null;
            avisoEsporteNaoSelecionado.style.display = 'block';
        }

        var imageSelectionContainer = document.getElementById('imageSelection');
        imageSelectionContainer.innerHTML = '';

        if (selectedSport === 'volei') {
            criarOpcaoDeImagem('assets/img/volei1.png');
            criarOpcaoDeImagem('assets/img/volei2.png');
            criarOpcaoDeImagem('assets/img/volei3.png');
        } else if (selectedSport === 'futebol') {
            criarOpcaoDeImagem('assets/img/futebol1.png');
            criarOpcaoDeImagem('assets/img/futebol2.png');
            criarOpcaoDeImagem('assets/img/futebol3.png');
        } else if (selectedSport === 'basquete') {
            criarOpcaoDeImagem('assets/img/basquete1.png');
            criarOpcaoDeImagem('assets/img/basquete2.png');
            criarOpcaoDeImagem('assets/img/basquete3.png');
        }
    });

});

// Função para criar uma opção de imagem
function criarOpcaoDeImagem(imagePath) {
    var imageOption = document.createElement('div');
    imageOption.classList.add('image-option');
    imageOption.onclick = function () {
        selectImage(imagePath);
    };

    var img = document.createElement('img');
    img.src = imagePath;
    img.alt = 'Imagem';

    imageOption.appendChild(img);
    document.getElementById('imageSelection').appendChild(imageOption);
}

// Função para mostrar o contêiner de seleção de imagem
function showImageSelection(selectedSport) {
    var imageSelectionContainer = document.getElementById('imageSelectionContainer');
    imageSelectionContainer.style.display = 'flex';
    document.body.classList.add('modal-open');
    atualizarOpcoesDeImagem(selectedSport);
}

// Função para esconder o contêiner de seleção de imagem
function hideImageSelection(event) {
    if (event.target.id === 'imageSelectionContainer') {
        var imageSelectionContainer = document.getElementById('imageSelectionContainer');
        imageSelectionContainer.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// Função para selecionar uma imagem
function selectImage(imagePath) {
    localStorage.setItem('SELECT IMAGE', imagePath);
    var placeholder = document.querySelector('.foto-placeholder');
    placeholder.style.backgroundImage = 'url(' + imagePath + ')';
    placeholder.style.backgroundSize = 'cover';
    placeholder.style.backgroundPosition = 'center';
    placeholder.style.border = 'none';
    placeholder.innerHTML = '';

    var imageNumber = imagePath.match(/\d+/)[0];
    document.getElementById('fotoInput').value = imageNumber;
    document.getElementById('removerImagemBtn').style.display = 'block';
    document.getElementById('imageSelectionContainer').style.display = 'none';
    document.body.classList.remove('modal-open');

    // Atribuir o caminho da imagem à variável global
    enderecoImagem = imagePath;
}

// Função para remover a imagem selecionada
function removerImagem() {
    var placeholder = document.querySelector('.foto-placeholder');
    placeholder.style.backgroundImage = 'none';
    document.getElementById('fotoInput').value = '';
    document.getElementById('removerImagemBtn').style.display = 'none';
}

// Função para salvar os valores do formulário em um objeto JSON
function salvarFormulario(event) {
    event.preventDefault();

    var dataInput = document.getElementById("data");
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    var partesData = dataInput.value.split("-");
    var dataSelecionada = new Date(partesData[0], partesData[1] - 1, partesData[2]);

    if (dataSelecionada < hoje) {
        document.getElementById("avisoDataInvalida").style.display = "block";
        return;
    }

    var nome = document.getElementById('nome').value;
    var esporte = document.getElementById('esporte').value;
    var horario = document.getElementById('horario').value;
    var local = document.getElementById('local').value;
    var jogadoresInput = document.getElementById('jogadores');
    var descricao = document.getElementById('descricao').value;
    var fotoInput = document.getElementById('fotoInput').value;
    var Criador = JSON.parse(localStorage.getItem('usuarioLogado')).usuario;

    if (!nome || !esporte || !dataInput.value || !horario || !jogadores || !local || !descricao || !fotoInput) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    // Verifica qual esporte foi selecionado e define o id_esporte
    var id_esporte;
    if (esporte === 'futebol') {
        id_esporte = 1;
    } else if (esporte === 'basquete') {
        id_esporte = 2;
    } else if (esporte === 'volei') {
        id_esporte = 3;
    } else {
        alert("Esporte inválido. Selecione um esporte.");
        return;
    }

    if (!nome || !esporte || !dataInput.value || !horario || !jogadoresInput.value || !local || !descricao || !fotoInput) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }


    var jogadoresValue = parseInt(jogadoresInput.value);

    // Criação do objeto JSON com os dados do formulário
    var formulario = {
        "nome": nome,
        "data": dataInput.value,
        "horario": horario,
        "descricao": descricao,
        "local": local,
        "id_esporte": id_esporte,
        "jogadoresMax": jogadoresValue,
        "criador": Criador
    };

    // Enviando os dados para o backend
    fetch('http://localhost:4567/cadastrarGrupo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formulario)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro ao salvar grupo.');
            }
        })
        .then(data => {

            alert("Grupo criado com sucesso!");

            const id_grupo = data.id;

            associarImagemAoGrupo(id_grupo);

            // Limpa os campos do formulário
            document.getElementById('nome').value = '';
            document.getElementById('esporte').value = '';
            dataInput.value = '';
            document.getElementById('horario').value = '';
            document.getElementById('jogadores').value = '';
            document.getElementById('local').value = '';
            document.getElementById('descricao').value = '';
            removerImagem();
            window.location.href = '/MeusGrupos.html';
        })
        .catch(error => {
            alert("Erro: " + error.message);
        });
}


function exibirMensagemLimiteMaximo() {
    var limiteMaximoMensagem = document.getElementById('limiteMaximoMensagem');
    limiteMaximoMensagem.style.display = '';
}
function verMeusGrupos() {
    // Altera o URL para a página desejada
    window.location.href = 'MeusGrupos.html';
}
// Função para exibir o contêiner com a imagem do local
function exibirImagemLocal() {
    var localImageContainer = document.getElementById('localImageContainer');
    localImageContainer.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
    var localInput = document.getElementById('local');

    localInput.addEventListener('click', function () {
        exibirImagemLocal();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const areas = document.querySelectorAll(".hover-area");
    areas.forEach(area => {
        area.addEventListener("click", function (event) {
            event.preventDefault();
            areas.forEach(a => a.classList.remove("selected"));
            this.classList.add("selected");

            const localSelecionado = this.getAttribute("data-local");
            document.getElementById('local').value = localSelecionado;
        });
    });
});
function ocultarLocalContainer() {
    document.getElementById('localImageContainer').style.display = 'none';
}

function associarImagemAoGrupo(id_grupo) {
    
    const idGrupoInt = parseInt(id_grupo, 10);

    const url = `http://localhost:4567/associarImagem`;

    const data = {
        id_grupo: idGrupoInt,
        imagePath: enderecoImagem
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(response => {
        console.log("Status da resposta:", response.status);
        console.log("Headers da resposta:", response.headers);

        return response.json()
            .then(data => {
                console.log("Resposta JSON do servidor:", data);
                return data;
            })
            .catch(err => {
                console.error("Erro ao processar JSON:", err);
                throw new Error("Resposta não está em formato JSON.");
            });
    })
    .then(data => {
        alert("Imagem associada ao grupo com sucesso!");
        console.log("Dados retornados:", data);
    })
    .catch(error => {
        console.log("Erro ao associar imagem:", error.message);
    });
}
