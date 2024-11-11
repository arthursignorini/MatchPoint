// Verifica se existe um usuário logado no localStorage
const usuarioLogado = localStorage.getItem('usuarioLogado');

if (usuarioLogado) {
    // Converte a string JSON de volta em objeto
    const user = JSON.parse(usuarioLogado).usuario;

    // Atualiza o nome do usuário no dropdown, se houver um usuário logado
    document.getElementById('userNameDropdown').textContent = user;
} else {
    // Se não houver um usuário logado, redireciona para a página de login ou exibe uma mensagem
    console.warn('Nenhum usuário logado encontrado.');
    window.location.href = '/Login.html'; // Redireciona para a página de login
}

// Exemplo de script para limpar localStorage no logout
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = '/index.html';  // Redireciona para a página inicial ou de login
});
