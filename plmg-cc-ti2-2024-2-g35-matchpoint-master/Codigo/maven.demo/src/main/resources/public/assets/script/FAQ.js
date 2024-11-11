document.querySelector('button').addEventListener('click', function() {
    let textarea = document.querySelector('textarea');
    let question = textarea.value.trim(); // Obtém o valor do textarea e remove espaços em branco extras

    if (question === '') {
        alert('Por favor, digite sua pergunta.');
    } else {
        alert('Pergunta enviada!');
        textarea.value = ''; // Limpa o conteúdo da caixa de mensagem
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const questions = document.querySelectorAll('.faq-questions ul li');

    questions.forEach(question => {
        const questionText = question.querySelector('.question');
        const answer = question.querySelector('.answer');

        questionText.addEventListener('click', () => {
            question.classList.toggle('open'); // Adiciona ou remove a classe 'open' no elemento li

            if (question.classList.contains('open')) {
                answer.style.display = 'block';
            } else {
                answer.style.display = 'none';
            }
        });
    });
});
