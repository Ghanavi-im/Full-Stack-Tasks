async function pay(){

    let amount = document.getElementById("amount").value;

    const res = await fetch("http://localhost:3000/api/pay",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            userId:1,
            merchantId:1,
            amount:parseFloat(amount)
        })
    });

    const data = await res.json();
    document.getElementById("msg").innerText = data.message;
}
