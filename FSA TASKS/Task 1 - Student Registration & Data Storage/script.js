function login() {
  const Username = document.getElementById("username").value;
  const Email=document.getElementById("email").value;
  const DOB=document.getElementById("DOB").value;
  const Department=document.getElementById("Department").value;
  const Phone=document.getElementById("Phone").value;


  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      Username: Username,
      Email:Email,
      DOB:DOB,
      Department:Department,
      Phone:Phone
    })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById("Register").innerText = data.message;
  })
  .catch(error => {
    console.log(error);
  });
}