let items = [];
let updatedId = null;
let cartItems = [];

const addBtn = document.querySelector(".add");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const urlInput = document.getElementById("url");
const countInput = document.getElementById("count");
const onSale = document.getElementById("check");
const discountInput = document.getElementById("discount");
const tbody = document.getElementById("tbody");
const aside = document.getElementById("aside");
const discountGroup = document.querySelector(".discount");
const filterInput = document.getElementById("filter");
const discountPrice = document.querySelector(".discountPrice");

function addItem() {
  if (
    nameInput.value.trim() === "" ||
    priceInput.value.trim() === "" ||
    urlInput.value.trim() === "" ||
    countInput.value.trim() === ""
  ) {
    alert("All the inputs should be filled!");
    return;
  }

  if (
    onSale.checked &&
    (discountInput.value === "" || discountInput.value == 0)
  ) {
    alert("Discount amount is required");
    return;
  }

  if (updatedId) {
    items = items.map((item) => {
      if (item.id === updatedId) {
        return {
          ...item,
          name: nameInput.value,
          price: priceInput.value,
          url: urlInput.value,
          onSale: onSale.checked,
          count: countInput.value,
          discount: discountInput.value,
        };
      }
      return item;
    });

    updatedId = null;
    addBtn.innerHTML = "Add";
  } else {
    items.push({
      name: nameInput.value,
      price: priceInput.value,
      url: urlInput.value,
      onSale: onSale.checked,
      count: countInput.value,
      discount: discountInput.value,
      id: Date.now(),
    });
  }
  saveToStorage();
  renderItems();
}

addBtn.addEventListener("click", addItem);
aside.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addItem();
});

window.addEventListener("DOMContentLoaded", () => {
  loadItems();
  renderItems();
  renderCart();
});

function renderItems() {
  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="not">No products added!</td>
      </tr>`;
  } else {
    tbody.innerHTML = items
      .map((item) => {
        const isInCart = cartItems.findIndex((c) => c.id === item.id);
        const priceHTML =
          item.onSale && item.discount > 0
            ? `
            $${item.price}
            <span class="minusPrice">
              $${(item.price * (1 - item.discount / 100)).toFixed(2)}
            </span>
          `
            : `$${item.price}`;

        return `
          <tr data-id="${item.id}">
            <td><img src="${item.url}" alt="" /></td>
            <td>${item.name}</td>
            <td>${priceHTML}</td>
            <td>${item.count}</td>
            ${
              item.discount === 0 || item.discount === ""
                ? `<td>0%</td>`
                : `<td>${item.discount}%</td>`
            }
            <td>
        
            ${isInCart === -1 ? `<button class="buy">Buy</button>` : ""}
              <button class="edit">Edit</button>
              <button class="delete">Delete</button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  nameInput.value = "";
  priceInput.value = "";
  urlInput.value = "";
  onSale.checked = false;
  countInput.value = "";
  discountInput.value = "0";
  discountGroup.style.display = "none";
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  renderItems();
  saveToStorage();
  loadItems();
}

tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const row = e.target.closest("tr");
    const id = +row.dataset.id;
    deleteItem(id);
  }
  if (e.target.classList.contains("edit")) {
    const row = e.target.closest("tr");
    const id = +row.dataset.id;
    editItem(id);
  }
  if (e.target.classList.contains("buy")) {
    const row = e.target.closest("tr");
    const id = +row.dataset.id;
    addToCart(id);
  }
});

function editItem(id) {
  updatedId = id;
  const updated = items.find((item) => item.id === id);
  nameInput.value = updated.name;
  priceInput.value = updated.price;
  urlInput.value = updated.url;
  onSale.checked = updated.onSale;
  countInput.value = updated.count;
  discountInput.value = updated.discount;
  addBtn.innerHTML = "Edit";
}

function addToCart(id) {
  const cartItem = items.find((item) => item.id === id);
  cartItems.push(cartItem);
  uploadNumber();
  renderItems();
  renderCart();
  saveToStorage();
}

onSale.addEventListener("change", () => {
  if (onSale.checked) {
    discountGroup.style.display = "flex";
  } else {
    discountGroup.style.display = "none";
    discountInput.value = "";
  }
});

filterInput.addEventListener("change", () => {
  if (filterInput.value == 1) {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filterInput.value == 2) {
    items.sort((a, b) => b.name.localeCompare(a.name));
  } else if (filterInput.value == 3) {
    items.sort(
      (a, b) =>
        a.price * (1 - a.discount / 100) - b.price * (1 - b.discount / 100)
    );
  } else {
    items.sort(
      (a, b) =>
        b.price * (1 - b.discount / 100) - a.price * (1 - a.discount / 100)
    );
  }

  renderItems();
});

const drawerOverlay = document.getElementById("drawer-overlay");
const drawer = document.getElementById("drawer-bar");
const closeDrawer = document.getElementById("close-drawer");
const drawerBtn = document.querySelector(".cart");
drawerBtn.style.cursor = "pointer";
closeDrawer.style.cursor = "pointer";
const numberOfItems = document.querySelector(".number");

drawer.addEventListener("click", (e) => {
  e.stopPropagation();
});

drawerBtn.addEventListener("click", () => {
  drawerOverlay.classList.add("openedX");
  drawer.classList.add("openedX");
  document.body.style.overflow = "hidden";
});

closeDrawer.addEventListener("click", () => {
  drawerOverlay.classList.remove("openedX");
  drawer.classList.remove("openedX");
  document.body.style.overflowY = "visible";
});

drawerOverlay.addEventListener("click", () => {
  drawerOverlay.classList.remove("openedX");
  drawer.classList.remove("openedX");
  document.body.style.overflowY = "visible";
});

function uploadNumber() {
  numberOfItems.innerHTML = `(${cartItems.length})`;
}
const productList = document.querySelector(".product-list");
const numberInside = document.querySelector(".numberInside");
const totalPrice = document.querySelector(".total-price");
const actualPrice = document.querySelector(".actual-price");
const countOfProducts = document.querySelector(".countOfProducts");

function renderCart() {
  if (cartItems.length === 0) {
    productList.innerHTML = "<p>Cart is empty!</p>";
  } else {
    productList.innerHTML = cartItems
      .map((item) => {
        return `<div class="drawer-bar" data-id="${item.id}">
              <img src="${item.url}" alt="" />
              <div>
                <p>${item.name}</p>
                <b>1 kg x <span>$${item.price}</span> <span class="newPrice">$${
          item.price * (1 - item.discount / 100)
        }</span> </b>
              </div>
              <button class="deleteCartItem">x</button>
            </div>`;
      })
      .join("");
  }
  numberInside.innerHTML = `(${cartItems.length})`;
  countOfProducts.innerHTML = `${cartItems.length} Product${
    cartItems.length === 1 ? "" : "s"
  }`;
  totalPrice.innerHTML = `$${cartItems.reduce(
    (sum, cur) => sum + cur.price * (1 - cur.discount / 100),
    0
  )}.00`;
  actualPrice.innerHTML = `$${cartItems.reduce(
    (sum, cur) => sum + cur.price,
    0
  )}`;
}

const deleteCartItem = document.querySelector(".deleteCartItem");

productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteCartItem")) {
    const row = e.target.closest(".drawer-bar");
    const id = +row.dataset.id;
    removeFromCart(id);
  }
});

function removeFromCart(id) {
  cartItems = cartItems.filter((item) => item.id !== id);
  renderCart();
  renderItems();
  console.log(numberInside);

  numberInside.innerHTML = `(${cartItems.length})`;
  console.log(numberInside);
  uploadNumber();
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("items", JSON.stringify(items));
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function loadItems() {
  items = JSON.parse(localStorage.getItem("items")) || [];
  cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
}
