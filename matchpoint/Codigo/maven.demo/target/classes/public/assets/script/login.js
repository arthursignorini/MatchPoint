function logar() {
  // Captura os valores do formulário de login
  var pegaUsuario = document.getElementById('usuario').value.trim(); // Remove espaços em branco
  var pegaSenha = document.getElementById('senha').value.trim();

  // Verifica se os campos foram preenchidos
  if (!pegaUsuario || !pegaSenha) {
      alert("Por favor, preencha todos os campos.");
      return;
  }

  // Envia a requisição de login para o servidor
  fetch('/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `usuario=${encodeURIComponent(pegaUsuario)}&senha=${encodeURIComponent(pegaSenha)}`
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Login falhou');
      }
      return response.json(); // Converte a resposta para JSON
  })
  .then(data => {
      if (data.usuario) {
          // Salva os dados do usuário no localStorage
          localStorage.setItem('usuarioLogado', JSON.stringify(data));

          // Redireciona para a HomePage após salvar o usuário
          window.location.href = 'HomePage.html';
      } else {
          alert('Usuário ou senha incorretos.');
      }
  })
  .catch(error => {
      alert('Falha no login: ' + error.message);
  });
}

// Adiciona o evento de submit ao formulário
document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault(); // Previne o comportamento padrão de envio do formulário
  logar(); // Chama a função de login
});
