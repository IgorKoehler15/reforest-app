document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const logoutBtn = document.getElementById('logoutBtn');
    const reportForm = document.getElementById('reportForm');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Aplicar tema
    applyTheme(currentUser.treeType);
    
    // Carregar dados iniciais
    loadReportData();
    
    // Configurar filtros
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        loadReportData();
    });
    
    resetFiltersBtn.addEventListener('click', function() {
        document.getElementById('userFilter').value = '';
        document.getElementById('treeFilter').value = '';
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        loadReportData();
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
    
    function loadReportData() {
        const userFilter = document.getElementById('userFilter').value.toLowerCase();
        const treeFilter = document.getElementById('treeFilter').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        
        // Obter todos os usuários e seus plantios
        const users = JSON.parse(localStorage.getItem('users')) || [];
        let allPlantings = [];
        
        users.forEach(user => {
            user.plantings.forEach(planting => {
                planting.username = user.username; // Adicionar nome do usuário ao registro
                allPlantings.push(planting);
            });
        });
        
        // Aplicar filtros
        let filteredData = allPlantings.filter(planting => {
            // Filtro por usuário
            if (userFilter && !planting.username.toLowerCase().includes(userFilter)) {
                return false;
            }
            
            // Filtro por tipo de árvore
            if (treeFilter && planting.treeType !== treeFilter) {
                return false;
            }
            
            // Filtro por data
            if (dateFrom && planting.date < dateFrom) {
                return false;
            }
            
            if (dateTo && planting.date > dateTo) {
                return false;
            }
            
            return true;
        });
        
        // Ordenar por data (mais recente primeiro)
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Exibir resultados
        displayReportData(filteredData);
    }
    
    function displayReportData(data) {
        const tableBody = document.getElementById('reportData');
        const totalRecords = document.getElementById('totalRecords');
        const totalTrees = document.getElementById('totalTrees');
        
        // Calcular totais
        const treesCount = data.reduce((sum, planting) => sum + planting.quantity, 0);
        
        totalRecords.textContent = data.length;
        totalTrees.textContent = treesCount;
        
        // Preencher tabela
        tableBody.innerHTML = data.map(planting => `
            <tr>
                <td>${formatDate(planting.date)}</td>
                <td>${planting.username}</td>
                <td>${planting.treeType}</td>
                <td>${planting.quantity}</td>
                <td>${planting.location || '-'}</td>
            </tr>
        `).join('');
        
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">Nenhum registro encontrado</td></tr>';
        }
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }
});