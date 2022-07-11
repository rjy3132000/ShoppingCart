/* Author: 

*/


let pageCheck = document.querySelector("body > div");
let cartIcon = document.querySelector(".cartIcon")

// Javascript For Index Page
if (pageCheck.className == "container index_page") {
    let cartItem = document.querySelector(".cartItem");
    let btn = document.querySelector(".load-more");
    let basket = JSON.parse(localStorage.getItem("data")) || [];
    let count = 3;


    
    // function loadMoreData
    function loadMoreData() {
        fetch("https://fakestoreapi.com/products")
        .then(function (resp) {return resp.json();})
        .then(function (datanew) {apiData(datanew)});
    }
    

    // EventListener on Button
    btn.addEventListener("click",loadMoreData);

    // Function for apiData
    function apiData(data) {

        let cart = "";
        for (let i = 0; i <= count; i++) {
            if (i < data.length) {
                cart += `
                <li class="item">
                    <figure><img src="${data[i].image}" alt="01"></figure>
                    <div class="details">
                        <h3>${data[i].category}</h3>
                        <div class="price-quantity">
                            <h4>$ ${data[i].price}</h4>
                            <div class="btn">
                                <button class="minus" onclick="decrement(${data[i].id})">-</button>
                                <span id=${data[i].id} class="quantity">0</span>
                                <button class="plus" onclick="increment(${data[i].id})">+</button>
                            </div>
                        </div>
                    </div>
                </li>
                `;
            }
            if (i === data.length-1) {
                btn.classList.add("hide");
            }
            cartItem.innerHTML = cart;
        }
        count += 4;
    }
    // Calling a function loadMoreData
    loadMoreData();



    function increment(id) {
        
        let selectItem = document.getElementById(id);        
        let search = basket.find(function(x) {
            return x.id == selectItem.id;
        })

        if (search === undefined) {
            basket.push({
                id : selectItem.id,
                item : 1,
            })
        }
        else {
            search.item += 1;
        }
        
        cartValue(id);
        localStorage.setItem("data",JSON.stringify(basket));
    }

    function decrement(id) {
        let selectItem = document.getElementById(id);        
        let search = basket.find(function(x) {
            return x.id == selectItem.id
        })

        if (search === undefined) return;
        else if (search.item === 0) return;
        else {
            search.item -= 1;
        }
        
        cartValue(id);
        basket = basket.filter(function(x) { return x.item !==0 })  
        localStorage.setItem("data",JSON.stringify(basket));
    }

    function cartValue(id) {
        let search = basket.find(function(x) {
            return x.id == id;
        })
        document.getElementById(id).innerHTML = search.item;
        calculate();
    }

    // calculations Function
    function calculate() {
        let cal = basket.map(function(x) {return x.item}).reduce(function(x,y){return x+y})
        cartIcon.innerHTML = cal;
    }
    calculate();
}


if (pageCheck.className == "container cart_page") {
    let basket = JSON.parse(localStorage.getItem("data")) || [];
    let cart = document.querySelector(".cartItemData");
    let labels = document.querySelector(".labels");
    let clearCart = document.querySelector(".clearCart");
    let pid = basket.map(function(x) {return x;});
    let totalItemPrice = "";
    let price = 0;


    // EventListener On Clear Cart Button
    clearCart.addEventListener("click", function() {
        cart.innerHTML = "";
        labels.innerHTML = "";
        clearCart.classList.add("hide");
        cartIcon.innerHTML = "";
        localStorage.clear();
    })
    
    pid.forEach(function(i) {
        
        fetch(`https://fakestoreapi.com/products/${i.id}`)
        .then(function (resp) {return resp.json();})
        .then(function (datanew) {
            cart.innerHTML += `
            <li>
                <div>
                    <h3>${datanew.category}</h3>
                    <figure><img src="${datanew.image}" alt="01"></figure>
                    <h4>Price: $${datanew.price} / Quantity: ${i.item}</h4>
                    <h5>Rating:  ${datanew.rating.rate}</h5>
                    <h6>Item Value <span class="totalItemPrice">${ (datanew.price * i.item).toFixed(2)}</span></h6>
                </div>
            </li>`;
            totalItemPrice = document.querySelectorAll(".totalItemPrice");
            price=0;
            totalItemPrice.forEach(function(e) {
                price = price + parseFloat(e.innerHTML);
            })
            labels.innerHTML = "Total Cart Value is: "+price.toFixed(2);
        });
    })



    // calculations Function
    function calculate() {
        let cal = basket.map(function(x) {return x.item}).reduce(function(x,y){return x+y})
        cartIcon.innerHTML = cal;
    }
    calculate()
    
}