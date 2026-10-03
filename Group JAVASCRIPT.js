//PAGE NAVIGATION
function showpage(pageId) {
    let pages = document.querySelectorAll(".page");
    pages.forEach(page => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}


//LIKE FUNCTION
let likes = localStorage.getItem("likes") || 0;
document.getElementById("likeCount").innerText = "Likes: " + likes;

function likeWebsite() {
    likes++;
    localStorage.setItem("likes", likes);
    document.getElementById("likeCount").innerText = "Likes: " + likes;
}


//USER SYSTEM FUNCTION
function signup() {
    let name = document.getElementById("name").value;
    let surname = document.getElementById("surname").value;
    let id_no = document.getElementById("id_no").value;
    let dob = document.getElementById("dob").value;
    let email = document.getElementById("email").value;
    let number = document.getElementById("number").value;
    let password = document.getElementById("password").value;
    let address = document.getElementById("address").value;

    let gender = document.querySelector('input[name="gender"]:checked');

    if (!name || !surname || !email || !password) {
        alert("Fill all required fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.email === email)) {
        alert("User already exists");
        return;
    }

    let newUser = {
        name, surname, id_no, dob, email, number, password, address,
        gender: gender ? gender.value : ""
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful");
    showpage("login");
}


function login() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));

        document.getElementById("welcomeUser").innerText =
            "Welcome, " + user.name;

        loadCart();
        showpage("home");
    } else {
        alert("Invalid login");
    }
}


function logout() {
    localStorage.removeItem("currentUser");
    alert("Logged out");
    location.reload();
}


//PROFILE DISPLAY
function loadProfile() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    alert(
        "Name: " + user.name +
        "\nSurname: " + user.surname +
        "\nEmail: " + user.email +
        "\nPhone: " + user.number +
        "\nAddress: " + user.address
    );
}


//CART SYSTEM
let cart = [];

function getCurrentUserKey() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    return user ? "cart_" + user.email : "cart_guest";
}

function addCart(name, price) {
    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart();
    updateCart();
}


function updateCart() {
    let cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        let li = document.createElement("li");

        li.innerHTML = `
            ${item.name} - R${item.price} x ${item.quantity}
            <button onclick="changeQty(${index}, 1)">+</button>
            <button onclick="changeQty(${index}, -1)">-</button>
            <button onclick="removeItem(${index})">Remove</button>
        `;

        cartItems.appendChild(li);

        total += item.price * item.quantity;
    });

    let totalDisplay = document.createElement("h3");
    totalDisplay.innerText = "Total: R" + total.toFixed(2);
    cartItems.appendChild(totalDisplay);

    document.getElementById("amount").value = total.toFixed(2);
}


function changeQty(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCart();
}


function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}


function saveCart() {
    localStorage.setItem(getCurrentUserKey(), JSON.stringify(cart));
}


function loadCart() {
    cart = JSON.parse(localStorage.getItem(getCurrentUserKey())) || [];
    updateCart();
}


//ORDER HISTORY
function saveOrder() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        alert("Login first");
        return;
    }

    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders_" + user.email)) || [];

    orders.push({
        items: cart,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("orders_" + user.email, JSON.stringify(orders));

    cart = [];
    saveCart();
    updateCart();

    alert("Order placed successfully");
}


function viewOrders() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    let orders = JSON.parse(localStorage.getItem("orders_" + user.email)) || [];

    if (orders.length === 0) {
        alert("No orders yet");
        return;
    }

    let text = "Order History:\n\n";

    orders.forEach(order => {
        text += "Date: " + order.date + "\n";

        order.items.forEach(item => {
            text += item.name + " x" + item.quantity + "\n";
        });

        text += "\n";
    });

    alert(text);
}


//SEARCH FUNTION
function searchProducts() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        let title = card.querySelector("h4").innerText.toLowerCase();

        card.style.display = title.includes(input) ? "block" : "none";
    });
}


//AUTO LOAD
window.onload = function () {
    let user = JSON.parse(localStorage.getItem("currentUser"));

    if (user) {
        document.getElementById("welcomeUser").innerText =
            "Welcome back, " + user.name;
    }

    loadCart();
};


//HOME BUTTON
function validateSignup() {
    showpage("signUplogIn");
}

	
