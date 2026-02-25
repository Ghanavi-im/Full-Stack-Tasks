const API = "http://localhost:3000";

/* Orders */
fetch(API+"/orders")
.then(res=>res.json())
.then(data=>{
    let rows="";
    data.forEach(o=>{
        rows+=`
        <tr>
        <td>${o.name}</td>
        <td>${o.product_name}</td>
        <td>${o.quantity}</td>
        <td>${o.price}</td>
        <td>${o.total}</td>
        <td>${o.order_date}</td>
        </tr>`;
    });
    document.getElementById("orders").innerHTML=rows;
});

/* Highest Order */
fetch(API+"/highest")
.then(res=>res.json())
.then(d=>{
    document.getElementById("highest").innerHTML=
    `<b>Highest Order</b><br>${d[0].name}<br>₹${d[0].total}`;
});

/* Active Customer */
fetch(API+"/active")
.then(res=>res.json())
.then(d=>{
    document.getElementById("active").innerHTML=
    `<b>Most Active Customer</b><br>${d[0].name}<br>${d[0].orders} Orders`;
});
