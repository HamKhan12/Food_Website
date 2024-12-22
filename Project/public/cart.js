document.addEventListener("DOMContentLoaded", function () {
  var addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
  var slidebar = document.getElementById("slidebar");
  var closeBtn = document.querySelector(".close-btn");
  var checkoutBtn = document.getElementById("checkout-btn");
  var itemNameDisplay = document.getElementById("item-name");
  var itemPriceDisplay = document.getElementById("item-price");
  var itemImage = document.getElementById("item-image");
  var quantityInput = document.getElementById("quantity");
  var flavorSelect = document.getElementById("flavor");
  var sliderAddToCartBtn = document.getElementById("slider-add-to-cart-btn");
  var cartCountDisplay = document.getElementById("cart-count");
  var cartItemsList = document.getElementById("cart-items-list");
  var cartBody = document.getElementById("cart-body");
  var cartTotal = document.getElementById("cart-total");

  // Retrieve cart data from localStorage or initialize as empty
  var cartData = JSON.parse(localStorage.getItem("cartData")) || [];

  var itemData = {
    "Family Combo": { price: 29.99, image: "pictures/d2.png" },
    "Pizza Party": { price: 15.99, image: "pictures/d1.png" },
    "Party Platter": { price: 12.99, image: "pictures/d3.png" },
    "Spring Rolls": { price: 4.99, image: "pictures/spring roll.jpg" },
    "Garlic Bread": { price: 3.99, image: "pictures/garlic bread.jpg" },
    Bruschetta: { price: 5.49, image: "pictures/burchetta.jpg" },
    "Cheese Burger": { price: 7.99, image: "pictures/crunch burger.png" },
    "Bacon Burger": { price: 8.99, image: "pictures/beef burger.png" },
    "Veggie Burger": { price: 6.99, image: "pictures/Vintage burger.png" },
    Margherita: { price: 9.99, image: "pictures/2.png" },
    Pepperoni: { price: 11.99, image: "pictures/1.png" },
    "Veggie Delight": { price: 10.99, image: "pictures/Pizza paradise.png" },
    "Spaghetti Bolognese": { price: 12.99, image: "pictures/Italian pasta.png" },
    "Fettuccine Alfredo": { price: 13.99, image: "pictures/ziggie pasta.png" },
    Carbonara: { price: 14.99, image: "pictures/spaghetti.png" },
    "Fried Rice": { price: 8.99, image: "pictures/egg fried rice.png" },
    "Chicken Biryani": { price: 10.99, image: "pictures/chicken biryani.png" },
    "Beef Pulao": { price: 7.99, image: "pictures/beef pulao.png" },
    "Chocolate Cake": { price: 5.99, image: "pictures/chocolate cake.png" },
    "Browny": { price: 4.99, image: "pictures/brownies.png" },
    Pancake: { price: 6.99, image: "pictures/pan cakes.png" },
    MintMargarita: { price: 2.99, image: "pictures/mint margarita.png" },
    "Ice-cream Shake": { price: 3.99, image: "pictures/Strwaberry icecream shake.png" },
    Juice: { price: 1.99, image: "pictures/Rasberry juice.png" },
    "BBQ Ribs": { price: 15.99, image: "pictures/bbq ribs.jpg" },
    "BBQ Chicken": { price: 12.99, image: "pictures/bbq chick.jpg" },
    "Grilled Veggies": { price: 10.99, image: "pictures/grilled veg.jpg" },
  };

  document.getElementById('slider-add-to-cart-btn').addEventListener('click', async () => {
    const itemId = 'item_id_here'; // Replace with actual item ID
    const quantity = 1; // Replace with selected quantity
  
    try {
      const response = await fetch('/add-to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Item added to cart successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart.');
    }
  });
  
  document.getElementById('checkout-btn').addEventListener('click', async () => {
    const cartItems = [
      { itemId: 'item1_id_here', quantity: 2 },
      { itemId: 'item2_id_here', quantity: 1 },
    ]; // Replace with actual cart data
  
    try {
      const response = await fetch('/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Order placed successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order.');
    }
  });
  
  // Update cart count display
  function updateCartCount() {
    cartCountDisplay.textContent = cartData.reduce(
      (acc, item) => acc + item.quantity,0
    );
  }

  // Save cart data to localStorage
  function saveCartData() {
    localStorage.setItem("cartData", JSON.stringify(cartData));
  }

  // Render cart items (for cart.html)
  function renderCart() {
    if (!cartBody || !cartTotal) return;

    cartBody.innerHTML = ""; // Clear cart body
    let total = 0;

    cartData.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.image}" alt="${item.name}" style="width: 50px;"></td>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td><button onclick="removeItem(${index})" style="color: white; background-color: red; border: none; padding: 5px 10px; cursor: pointer;">Remove</button></td>`;
      cartBody.appendChild(row);
      total += item.price * item.quantity;
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }

  // Remove item from cart (for cart.html)
  window.removeItem = function (index) {
    cartData.splice(index, 1);
    saveCartData();
    renderCart();
    updateCartCount();
  };

  addToCartBtns.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      var itemName = event.target.getAttribute("data-item");

      if (itemData[itemName]) {
        itemNameDisplay.textContent = itemName;
        itemPriceDisplay.textContent =
          "$" + itemData[itemName].price.toFixed(2);
        slidebar.style.width = "300px"; // Slidebar opens from the right
        itemImage.src = itemData[itemName].image;
        itemImage.alt = itemName;
      } else {
        console.error("Item data not found for: ", itemName);
      }
    });
  });

  if (sliderAddToCartBtn) {
    sliderAddToCartBtn.addEventListener("click", function () {
      var itemName = itemNameDisplay.textContent;
      var itemPrice = parseFloat(itemData[itemName].price);
      var itemQuantity = parseInt(quantityInput.value) || 1; // Default to 1 if empty
      var itemFlavor = flavorSelect.value || "Default";

      var cartItem = {
        name: itemName,
        price: itemPrice,
        quantity: itemQuantity,
        flavor: itemFlavor,
        image: itemData[itemName].image,
      };

      // Check if item already exists in cart and update quantity
      var existingItem = cartData.find((item) => item.name === itemName);
      if (existingItem) {
        existingItem.quantity += itemQuantity;
      } else {
        cartData.push(cartItem);
      }

      saveCartData();
      updateCartCount();
      slidebar.style.width = "0"; // Close the slidebar
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      slidebar.style.width = "0";
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      window.location.href = "/checkout";
    });
  }

  // Initialize the cart count on page load
  updateCartCount();

  // Render the cart if on cart.html
  renderCart();
});
