//Aguarda o carregamento da página

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerBtn = document.getElementById('registerBtn');
    const registerModal = document.getElementById('registerModal');
    const closeBtn = document.querySelector('.close-btn');
    const registerForm = document.getElementById('registerForm');
    const treeOptions = document.querySelectorAll('.tree-option');
    const selectedTreeInput = document.getElementById('selectedTree');

    // Mostrar modal de cadastro
    registerBtn.addEventListener('click', function() {
        registerModal.style.display = 'block';
    });

    // Fechar modal
    closeBtn.addEventListener('click', function() {
        registerModal.style.display = 'none';
    });

    // Selecionar árvore avatar visualmente
    treeOptions.forEach(option => {
        option.addEventListener('click', function() {
            treeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedTreeInput.value = this.dataset.tree;
        });
    });

    // Valida o usuario comparando os dados com o localStorage
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Verificar no localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            alert('Usuário ou senha incorretos!');
        }
    });

    // Registra os novos usuarios e salvo os dados
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;
        const bio = document.getElementById('bio').value;
        const selectedTree = selectedTreeInput.value;
        
        if (!selectedTree) {
            alert('Por favor, selecione uma árvore avatar!');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Verificar se usuário já existe
        if (users.some(u => u.username === username)) {
            alert('Usuário já existe!');
            return;
        }
        
        // Criar novo usuário
        const newUser = {
            username,
            password,
            bio: bio || '',
            treeType: selectedTree,
            treesPlanted: 0,
            plantings: []
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        alert('Cadastro realizado com sucesso!');
        registerModal.style.display = 'none';
        window.location.href = 'dashboard.html';
    });
});