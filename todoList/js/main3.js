// Obtém uma referência para o botão do menu e o menu lateral
const menuButton = document.getElementById('menuButton');
const sidebar = document.getElementById('sidebar');

// Adiciona um evento de clique ao botão do menu
menuButton.addEventListener('click', () => {
    // Alterna a classe 'active' no menu lateral e no botão do menu
    sidebar.classList.toggle('active');
    menuButton.classList.toggle('active');
});
