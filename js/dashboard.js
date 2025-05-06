document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Aplicar tema baseado na árvore escolhida
    applyTheme(currentUser.treeType);
    
    // Exibir informações do usuário
    document.getElementById('usernameDisplay').textContent = currentUser.username;
    document.getElementById('treesPlanted').textContent = currentUser.treesPlanted;
    
    // Carregar avatar
    loadAvatar(currentUser);
    
    // Carregar atividades recentes
    loadRecentActivities(currentUser);
    
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
    
    function loadAvatar(user) {
        const avatarImg = document.getElementById('userAvatar');
        let avatarSrc = '';
        
        // Determinar estágio da árvore
        if (user.treesPlanted >= 1500) {
            avatarSrc = `assets/${user.treeType}-mature.png`;
        } else if (user.treesPlanted >= 700) {
            avatarSrc = `assets/${user.treeType}-young.png`;
        } else if (user.treesPlanted >= 300) {
            avatarSrc = `assets/${user.treeType}-sprout.png`;
        } else if (user.treesPlanted >= 100) {
            avatarSrc = `assets/${user.treeType}-seedling.png`;
        } else {
            avatarSrc = `assets/${user.treeType}-seed.png`;
        }
        
        avatarImg.src = avatarSrc;
    }
    
    function loadRecentActivities(user) {
        const activityList = document.getElementById('activityList');
        const recentActivities = user.plantings.slice(-3).reverse();
        
        if (recentActivities.length === 0) {
            activityList.innerHTML = '<p>Nenhuma atividade recente</p>';
            return;
        }
        
        activityList.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <p>${activity.date}: Plantou ${activity.quantity} ${activity.treeType}</p>
            </div>
        `).join('');
    }
});