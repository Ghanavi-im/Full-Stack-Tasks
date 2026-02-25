async function login(){
  const email=document.getElementById("email").value.trim();
  const password=document.getElementById("password").value.trim();
  const msg=document.getElementById("msg");

  msg.innerText="";

  /* FRONTEND VALIDATION */
  const emailPattern=/^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if(email==="" || password===""){
    msg.style.color="red";
    msg.innerText="All fields required";
    return;
  }

  if(!email.match(emailPattern)){
    msg.style.color="red";
    msg.innerText="Invalid email format";
    return;
  }

  /* SEND TO SERVER */
  const res=await fetch("http://localhost:3000/login",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify({email,password})
  });

  const data=await res.json();

  if(data.status==="success"){
    msg.style.color="green";
    msg.innerText="Login Successful";
  }else{
    msg.style.color="red";
    msg.innerText=data.message;
  }
}
