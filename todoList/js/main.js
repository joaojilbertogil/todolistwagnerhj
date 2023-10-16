// Declaração da array 'banco' para armazenar tarefas.
let banco = [];

// Variável para armazenar o estado da edição.
let edicaoAtiva = null;

// Função para obter o banco de dados de tarefas a partir do armazenamento local.
const getBanco = () => JSON.parse(localStorage.getItem('todoList')) ?? [];

// Função para definir o banco de dados no armazenamento local.
const setBanco = (banco) => localStorage.setItem('todoList', JSON.stringify(banco));

// Função para criar um novo item de tarefa na interface.
const inputItem = (tarefa, status, cor, indice) => {
    // Cria um elemento de tarefa.
    const item = document.createElement('div');
    item.classList.add('todo_item');
    
    // Define a estrutura HTML do item da tarefa.
    item.innerHTML = `
        <input type="checkbox" ${status} data-indice=${indice}></input>
        <div style="background-color: ${cor}">${tarefa}</div>
        <button class="edit-button">✍️</button>
        <input type="color" class="color-picker" value="${cor}">
        <button class="clear-color" data-indice=${indice}>Limpar Cor</button>
        <button class="delete-button" data-indice=${indice}>X</button>
    `;

    // Adiciona eventos para atualizar a tarefa.
    
    // Adiciona evento de mudança para marcar/desmarcar a tarefa.
    const div = item.querySelector('div');
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (status === 'checked') {
        div.style.textDecoration = 'line-through';
    }
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            div.style.textDecoration = 'line-through';
        } else {
            div.style.textDecoration = 'none';
        }
        atualizaItem(indice, checkbox.checked ? 'checked' : '');
        atualizaContadores();
    });

    // Adiciona o item à lista de tarefas.
    document.getElementById('todoList').appendChild(item);
    
    // Adiciona eventos para os botões.
    const deleteButton = item.querySelector('.delete-button');
    const editButton = item.querySelector('.edit-button');
    const clearButton = item.querySelector('.clear-color');
    const colorPicker = item.querySelector('.color-picker');

    // Evento de clique para excluir a tarefa.
    deleteButton.addEventListener('click', () => {
        removeItem(indice);
        atualizaContadores();
    });

    // Evento de clique para editar o texto da tarefa.
    editButton.addEventListener('click', () => {
        div.contentEditable = true;
        div.focus();
        const textLength = div.innerText.length;
        div.setSelectionRange(textLength, textLength);
        // Armazena o índice da tarefa atualmente em edição.
        edicaoAtiva = indice;
    });

    // Evento de clique para limpar a cor da tarefa.
    clearButton.addEventListener('click', () => {
        cor = '';
        div.style.backgroundColor = cor;
        colorPicker.value = cor;
    });

    // mudança para escolher uma nova cor para a tarefa.
    colorPicker.addEventListener('change', () => {
        cor = colorPicker.value;
        div.style.backgroundColor = cor;
    });

    // Enter para salvar a edição do texto.
    div.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            div.contentEditable = false;
            // Verifica se a edição foi concluída na tarefa ativa.
            if (indice === edicaoAtiva) {
                edicaoAtiva = null;
            }
        }
    });
    
    // Restaura o estado de edição, se aplicável.
    if (indice === edicaoAtiva) {
        div.contentEditable = true;
        div.focus();
    }
}

// Função para atualizar a visualização das tarefas na página.
const atualizaView = () => {
    // Limpa a tela.
    limpaTela();

    // Obtém o banco de tarefas e cria os itens na interface.
    const banco = getBanco();
    banco.forEach((item, indice) => inputItem(item.tarefa, item.status, item.cor, indice));

    // Atualiza os contadores.
    atualizaContadores();
}

// Função para limpar a lista de tarefas na página.
const limpaTela = () => {
    const lista = document.getElementById('todoList');
    while (lista.firstChild) {
        lista.removeChild(lista.lastChild);
    }
}

// Função para inserir uma nova tarefa.
const insereItem = (event) => {
    // Verifica se a tecla pressionada é 'Enter' e se o valor não está vazio.
    // Adiciona a nova tarefa ao banco, atualiza a visualização e os contadores.
    const tecla = event.key;
    const value = event.target.value;
    let cor = '';

    if (tecla === 'Enter' && value.trim() !== '') {
        const banco = getBanco();
        banco.push({ 'tarefa': value, 'status': '', 'cor': cor });
        setBanco(banco);
        atualizaView();
        event.target.value = '';
        atualizaContadores();
    }
}

// Função para remover uma tarefa com base no índice.
const removeItem = (indice) => {
    // Remove a tarefa do banco, atualiza a visualização e os contadores.
    const banco = getBanco();
    banco.splice(indice, 1);
    setBanco(banco);
    atualizaView();
}

// Função para atualizar o status de uma tarefa.
const atualizaItem = (indice, status) => {
    // Atualiza o status da tarefa no banco de dados.
    const banco = getBanco();
    banco[indice].status = status;
    setBanco(banco);
}

// Função para atualizar os contadores de tarefas.
const atualizaContadores = () => {
    // Calcula o número total de tarefas e tarefas concluídas e exibe-os na página.
    const banco = getBanco();
    const totalTasks = banco.length;
    const completedTasks = banco.filter((item) => item.status === 'checked').length;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
}

// Função de inicialização.
const init = () => {
    // Inicializa a visualização, os contadores e os eventos.
    atualizaView();
    atualizaContadores();
    document.getElementById('newItem').addEventListener('keydown', insereItem);

    // Adiciona evento para abrir/fechar o menu.
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Chama a função de inicialização quando a página é carregada.
init();
