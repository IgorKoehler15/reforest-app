document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Aplicar tema
    applyTheme(currentUser.treeType);
    
    // Carregar ranking
    loadRankings();
    
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
    
    function loadRankings() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Ordenar usuários por quantidade de árvores plantadas (decrescente)
        const sortedUsers = [...users].sort((a, b) => b.treesPlanted - a.treesPlanted);
        
        // Exibir top 3
        displayTopUsers(sortedUsers.slice(0, 3));
        
        // Exibir posição do usuário atual
        displayUserPosition(sortedUsers, currentUser.username);
    }
    
    function displayTopUsers(topUsers) {
        const topUsersContainer = document.getElementById('topUsers');
        
        if (topUsers.length === 0) {
            topUsersContainer.innerHTML = '<p>Nenhum usuário encontrado</p>';
            return;
        }
        
        topUsersContainer.innerHTML = topUsers.map(user => `
            <div class="top-user">
                <div class="user-avatar">
                    <img src="${getAvatarForUser(user)}" alt="${user.username}">
                </div>
                <div class="user-info">
                    <h3>${user.username}</h3>
                    <p>${user.treesPlanted} árvores plantadas</p>
                </div>
            </div>
        `).join('');
    }
    
    function displayUserPosition(allUsers, username) {
        const userRankContainer = document.getElementById('userRank');
        const userIndex = allUsers.findIndex(u => u.username === username);
        const user = allUsers[userIndex];
        
        if (userIndex === -1) {
            userRankContainer.innerHTML = '<p>Usuário não encontrado no ranking</p>';
            return;
        }
        
        userRankContainer.innerHTML = `
            <div class="rank-card">
                <div class="rank-number">${userIndex + 1}º</div>
                <div class="rank-user">
                    <div class="user-avatar">
                        <img src="${getAvatarForUser(user)}" alt="${user.username}">
                    </div>
                    <div class="user-info">
                        <h3>${user.username}</h3>
                        <p>${user.treesPlanted} árvores plantadas</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    function getAvatarForUser(user) {
        if (user.treesPlanted >= 1500) {
            return `assets/${user.treeType}-mature.png`;
        } else if (user.treesPlanted >= 700) {
            return `assets/${user.treeType}-young.png`;
        } else if (user.treesPlanted >= 300) {
            return `assets/${user.treeType}-sprout.png`;
        } else if (user.treesPlanted >= 100) {
            return `assets/${user.treeType}-seedling.png`;
        } else {
            return `assets/${user.treeType}-seed.png`;
        }
    }
});