let campoNome = document.querySelector("#campoNome");
let labelNome = document.querySelector("#labelNome");
let validNome = false;

let campoEmail = document.querySelector("#campoEmail");
let labelEmail = document.querySelector("#labelEmail");
let validEmail = false;

let campoSenha = document.querySelector("#campoSenha");
let labelSenha = document.querySelector("#labelSenha");
let validSenha = false;

campoNome.addEventListener("keyup", () => {
  if (campoNome.value.trim().length < 3) {
    labelNome.classList.add("erro");
    labelNome.textContent = "Nome * Insira no mínimo 3 caracteres";
    validNome = false;
  } else {
    labelNome.classList.remove("erro");
    labelNome.textContent = "Nome";
    validNome = true;
  }
});

campoEmail.addEventListener("keyup", () => {
  let emailFormatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campoEmail.value);
  if (!emailFormatoValido) {
    labelEmail.classList.add("erro");
    labelEmail.textContent = "Email * Insira um email válido";
    validEmail = false;
  } else {
    labelEmail.classList.remove("erro");
    labelEmail.textContent = "E-mail";
    validEmail = true;
  }
});

campoSenha.addEventListener("keyup", () => {
  if (campoSenha.value.trim().length < 6) {
    labelSenha.classList.add("erro");
    labelSenha.textContent = "Senha * Insira no mínimo 6 caracteres";
    validSenha = false;
  } else {
    labelSenha.classList.remove("erro");
    labelSenha.textContent = "Senha";
    validSenha = true;
  }
});

async function incluirContato() {
  if (!validNome || !validEmail || !validSenha) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  let strNome = campoNome.value.trim();
  let strEmail = campoEmail.value.trim();
  let strSenha = campoSenha.value.trim();

 

  try {
    const response = await salvaDados(strNome, strEmail, strSenha);
    if (response.ok) {
      alert("Cadastro realizado com sucesso!");
      window.location.href = "Login.html";
    } else {
      const errorText = await response.text();
      alert(`Erro ao cadastrar: ${errorText}`);
    }
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
    alert("Ocorreu um erro ao processar o cadastro.");
  }
}

async function salvaDados(nome, email, senha) {
  return await fetch("/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ nome, email, senha }),
  });
}

document.getElementById("btnCadastro").addEventListener("click", incluirContato);
