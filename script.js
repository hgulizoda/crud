let items = [];
let updatedId = null;

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

  renderItems();
}

addBtn.addEventListener("click", addItem);
aside.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addItem();
});

window.addEventListener("DOMContentLoaded", () => {
  renderItems();
});

console.log(items);

function renderItems() {
  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="not">Mahsulot topilmadi!</td>
      </tr>`;
  } else {
    tbody.innerHTML = items
      .map((item) => {
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
            <td>${item.discount}%</td>
            <td>
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
      (a, b) => a.price * (a.discount / 100) - b.price * (b.discount / 100)
    );
  } else {
    items.sort(
      (a, b) => b.price * (b.discount / 100) - a.price * (a.discount / 100)
    );
  }

  renderItems();
});
