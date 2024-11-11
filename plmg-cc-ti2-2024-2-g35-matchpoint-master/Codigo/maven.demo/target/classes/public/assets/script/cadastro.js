// Verifica e inicializa os dados no localStorage, se necessário
if (!localStorage.getItem('login')) {
  localStorage.setItem('login', JSON.stringify({ contatos: [] }));
}

let campoNome = document.querySelector('#campoNome');
let labelNome = document.querySelector('#labelNome');
let validNome = false;

let campoEmail = document.querySelector('#campoEmail');
let labelEmail = document.querySelector('#labelEmail');
let validEmail = false;

let campoSenha = document.querySelector('#campoSenha');
let labelSenha = document.querySelector('#labelSenha');
let validSenha = false;

campoNome.addEventListener('keyup', () => {
  if (campoNome.value.trim().length < 3) {
    labelNome.setAttribute('style', 'color: red');
    labelNome.innerHTML = 'Nome * Insira no mínimo 3 caracteres';
    validNome = false;
  } else {
    labelNome.setAttribute('style', 'color: white');
    labelNome.innerHTML = 'Nome';
    validNome = true;
  }
});

campoEmail.addEventListener('keyup', () => {
  let emailFormatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campoEmail.value);
  if (!emailFormatoValido) {
    labelEmail.setAttribute('style', 'color: red');
    labelEmail.innerHTML = 'Email * Insira um email válido';
    validEmail = false;
  } else {
    labelEmail.setAttribute('style', 'color: white');
    labelEmail.innerHTML = 'E-mail';
    validEmail = true;
  }
});

campoSenha.addEventListener('keyup', () => {
  if (campoSenha.value.trim().length < 6) {
    labelSenha.setAttribute('style', 'color: red');
    labelSenha.innerHTML = 'Senha * Insira no mínimo 6 caracteres';
    validSenha = false;
  } else {
    labelSenha.setAttribute('style', 'color: white');
    labelSenha.innerHTML = 'Senha';
    validSenha = true;
  }
});

function leDados() {
  let strDados = localStorage.getItem('login');
  let objDados = { contatos: [] }; // Inicializa com estrutura padrão

  if (strDados) {
    objDados = JSON.parse(strDados);
  }

  return objDados;
}

function salvaDados(dados) {
  localStorage.setItem('login', JSON.stringify(dados));
}

function incluirContato() {
  // Verifica se todos os campos obrigatórios estão preenchidos corretamente
  if (!validNome || !validEmail || !validSenha) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  let objDados = leDados();

  let strNome = campoNome.value.trim();
  let strEmail = campoEmail.value.trim();
  let strSenha = campoSenha.value.trim();

  // Verifica se o nome de usuário já está em uso
  let cadastroExistente = objDados.contatos.find(contato => contato.nome === strNome);
  if (cadastroExistente) {
    alert("Nome de usuário já existe");
    return;
  }

  // Verifica se o email já está em uso
  let emailExistente = objDados.contatos.find(contato => contato.email === strEmail);
  if (emailExistente) {
    alert("Email já está em uso");
    return;
  }

  // Cria um novo objeto contato com os dados do formulário
  let novoContato = {
    nome: strNome,
    email: strEmail,
    senha: strSenha,
    foto: 0,
    bio: "",
    seguidores: [],
    seguindo: [],
  };

  // Adiciona o novo contato ao array de contatos
  objDados.contatos.push(novoContato);

  // Salva os dados atualizados no localStorage
  salvaDados(objDados);

  // Mensagem de sucesso e redirecionamento para a página de login
  alert("Cadastro realizado com sucesso!");
  window.location.href = "Login.html";
}

document.getElementById('btnCadastro').addEventListener('click', incluirContato);
