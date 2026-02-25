const API = "http://localhost:3000";

async function loadStudents() {
  const sort = document.getElementById("sort").value;
  const dept = document.getElementById("dept").value;

  const res = await fetch(`${API}/students?sort=${sort}&dept=${dept}`);
  const data = await res.json();

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach(s => {
    tbody.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.department}</td>
        <td>${s.join_date.substring(0,10)}</td>
      </tr>`;
  });

  loadCounts();
}

async function loadCounts(){
  const res = await fetch(`${API}/counts`);
  const data = await res.json();

  const list = document.getElementById("counts");
  list.innerHTML="";

  data.forEach(d=>{
    list.innerHTML += `<li>${d.department} : ${d.total}</li>`;
  });
}

loadStudents();
