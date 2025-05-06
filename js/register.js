document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const plantingForm = document.getElementById('plantingForm');
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Aplicar tema
    applyTheme(currentUser.treeType);
    
    // Configurar data padrão para hoje
    document.getElementById('date').valueAsDate = new Date();
    
    plantingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const treeType = document.getElementById('treeType').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const date = document.getElementById('date').value;
        const location = document.getElementById('location').value;
        const notes = document.getElementById('notes').value;
        
        // Criar objeto de plantio
        const planting = {
            treeType,
            quantity,
            date,
            location: location || '',
            notes: notes || '',
            userId: currentUser.username
        };
        
        // Atualizar usuário no localStorage
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        
        if (userIndex !== -1) {
            users[userIndex].plantings.push(planting);
            users[userIndex].treesPlanted += quantity;
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            
            alert('Ação cadastrada com sucesso!');
            window.location.href = 'dashboard.html';
        }
    });

     // Logout
     logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    function applyTheme(treeType) {
        const body = document.body;
        body.classList.remove('pau-brasil', 'castanheira', 'peroba-rosa');
        
        switch(treeType) {
            case 'pau-brasil':
                body.classList.add('pau-brasil');
                break;
            case 'castanheira':
                body.classList.add('castanheira');
                break;
            case 'peroba-rosa':
                body.classList.add('peroba-rosa');
                break;
        }
    }
});