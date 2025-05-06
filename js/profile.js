document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Aplicar tema
    applyTheme(currentUser.treeType);
    
    // Carregar informações do perfil
    loadProfile(currentUser);
    
    // Configurar botões de edição de bio
    const editBioBtn = document.getElementById('editBioBtn');
    const saveBioBtn = document.getElementById('saveBioBtn');
    const currentBio = document.getElementById('currentBio');
    const editBio = document.getElementById('editBio');
    
    editBioBtn.addEventListener('click', function() {
        currentBio.style.display = 'none';
        editBio.style.display = 'block';
        editBio.value = currentBio.textContent;
        editBioBtn.style.display = 'none';
        saveBioBtn.style.display = 'inline-block';
    });
    
    saveBioBtn.addEventListener('click', function() {
        const newBio = editBio.value;
        
        // Atualizar no localStorage
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        
        if (userIndex !== -1) {
            users[userIndex].bio = newBio;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            
            currentBio.textContent = newBio;
            currentBio.style.display = 'block';
            editBio.style.display = 'none';
            editBioBtn.style.display = 'inline-block';
            saveBioBtn.style.display = 'none';
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
    
    function loadProfile(user) {
        document.getElementById('profileUsername').textContent = user.username;
        document.getElementById('profileTreesPlanted').textContent = user.treesPlanted;
        document.getElementById('currentBio').textContent = user.bio || 'Nenhuma bio cadastrada';
        
        // Carregar avatar
        loadAvatar(user);
        
        // Configurar barra de progresso
        setupProgressBar(user.treesPlanted);
        
        // Carregar conquistas
        loadAchievements(user.treesPlanted);
    }
    
    function loadAvatar(user) {
        const avatarImg = document.getElementById('profileAvatar');
        let avatarSrc = '';
        let stage = '';
        
        if (user.treesPlanted >= 1500) {
            avatarSrc = `assets/${user.treeType}-mature.png`;
            stage = 'madura';
        } else if (user.treesPlanted >= 700) {
            avatarSrc = `assets/${user.treeType}-young.png`;
            stage = 'jovem';
        } else if (user.treesPlanted >= 300) {
            avatarSrc = `assets/${user.treeType}-sprout.png`;
            stage = 'broto';
        } else if (user.treesPlanted >= 100) {
            avatarSrc = `assets/${user.treeType}-seed.png`;
            stage = 'plantada';
        } else {
            avatarSrc = `assets/${user.treeType}-seed.png`;
            stage = 'semente';
        }
        
        avatarImg.src = avatarSrc;
        avatarImg.alt = `${user.treeType} - ${stage}`;
    }
    
    function setupProgressBar(treesPlanted) {
        const progressLevel = document.getElementById('progressLevel');
        const treesToNextLevel = document.getElementById('treesToNextLevel');
        
        let progress = 0;
        let nextLevel = 100;
        
        if (treesPlanted < 100) {
            progress = (treesPlanted / 100) * 100;
            nextLevel = 100 - treesPlanted;
        } else if (treesPlanted < 300) {
            progress = ((treesPlanted - 100) / 200) * 100;
            nextLevel = 300 - treesPlanted;
        } else if (treesPlanted < 700) {
            progress = ((treesPlanted - 300) / 400) * 100;
            nextLevel = 700 - treesPlanted;
        } else if (treesPlanted < 1500) {
            progress = ((treesPlanted - 700) / 800) * 100;
            nextLevel = 1500 - treesPlanted;
        } else {
            progress = 100;
            nextLevel = 0;
        }
        
        progressLevel.style.width = `${progress}%`;
        treesToNextLevel.textContent = nextLevel > 0 ? nextLevel : 'Você alcançou o nível máximo!';
    }
    
    function loadAchievements(treesPlanted) {
        const badgesContainer = document.getElementById('badgesContainer');
        const achievements = [
            { id: 'first-plant', name: 'Primeiro Plantio', description: 'Plantou a primeira árvore', earned: treesPlanted >= 1 },
            { id: '100-club', name: 'Clube 100', description: 'Plantou 100 árvores', earned: treesPlanted >= 100 },
            { id: '300-club', name: 'Clube 300', description: 'Plantou 300 árvores', earned: treesPlanted >= 300 },
            { id: '700-club', name: 'Clube 700', description: 'Plantou 700 árvores', earned: treesPlanted >= 700 },
            { id: 'master', name: 'Mestre Reflorestador', description: 'Plantou 1500+ árvores', earned: treesPlanted >= 1500 }
        ];
        
        badgesContainer.innerHTML = achievements.map(ach => `
            <div class="badge ${ach.earned ? 'earned' : 'locked'}">
                <img src="assets/badge-${ach.id}.png" alt="${ach.name}">
                <h4>${ach.name}</h4>
                <p>${ach.description}</p>
            </div>
        `).join('');
    }
});