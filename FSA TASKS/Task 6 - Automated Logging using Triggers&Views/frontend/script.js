document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/daily-activity')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#activityTable tbody');
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.activity_date}</td>
                    <td>${row.action_type}</td>
                    <td>${row.total_actions}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error(err));
});
