document.addEventListener('DOMContentLoaded', () => {
    // Filter functionality
    const filterCategory = document.getElementById('filterCategory');
    const filterStatus = document.getElementById('filterStatus');
    
    function filterTable() {
        const catValue = filterCategory.value.toLowerCase();
        const statValue = filterStatus.value.toLowerCase();
        
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowCat = row.dataset.category.toLowerCase();
            const rowStat = row.dataset.status.toLowerCase();
            
            const matchCat = catValue === '' || rowCat === catValue;
            const matchStat = statValue === '' || rowStat === statValue;
            
            if (matchCat && matchStat) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    if (filterCategory) filterCategory.addEventListener('change', filterTable);
    if (filterStatus) filterStatus.addEventListener('change', filterTable);

    // Status update functionality
    const statusSelects = document.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
        select.addEventListener('change', async (e) => {
            const complaintId = e.target.dataset.id;
            const newStatus = e.target.value;
            
            const formData = new FormData();
            formData.append('action', 'update_status');
            formData.append('id', complaintId);
            formData.append('status', newStatus);
            
            try {
                const response = await fetch('php/complaint.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                
                if (result.success) {
                    // Update dataset and badge text
                    const tr = e.target.closest('tr');
                    tr.dataset.status = newStatus;
                    const badge = tr.querySelector('.badge');
                    if(badge) {
                        badge.className = `badge badge-${newStatus.replace(' ', '-')}`;
                        badge.textContent = newStatus;
                    }
                } else {
                    alert('Failed to update status.');
                }
            } catch (err) {
                console.error(err);
                alert('Error updating status.');
            }
        });
    });

    // Delete functionality
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (!confirm('Are you sure you want to delete this complaint?')) return;
            
            const complaintId = e.target.dataset.id;
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('id', complaintId);
            
            try {
                const response = await fetch('php/complaint.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                
                if (result.success) {
                    const tr = e.target.closest('tr');
                    tr.remove();
                } else {
                    alert('Failed to delete complaint.');
                }
            } catch (err) {
                console.error(err);
                alert('Error deleting complaint.');
            }
        });
    });
});
