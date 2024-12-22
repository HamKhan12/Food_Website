// Function to retrieve cart items from localStorage
function getCartItems() {
  const cartData = localStorage.getItem("cart"); // Replace with actual cart data fetching method
  return cartData ? JSON.parse(cartData) : [];
}

// Function to populate the order summary with cart items and total
function populateOrderSummary() {
  const cartItems = getCartItems();
  const orderSummaryContainer = document.getElementById("order-summary");
  let total = 0;
  orderSummaryContainer.innerHTML = ""; // Clear any previous order summary

  if (cartItems.length === 0) {
    orderSummaryContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartItems.forEach((item) => {
    orderSummaryContainer.innerHTML += `<div class="d-flex justify-content-between"><span>${item.name}</span><span>Rs ${item.price}</span></div>`;
    total += item.price;
  });

  orderSummaryContainer.innerHTML += `
                  <hr>
                  <div class="d-flex justify-content-between">
                      <span><strong>Total</strong></span>
                      <span><strong>Rs ${total}</strong></span>
                  </div>
              `;
}

// Call the function to populate the order summary when the page loads
window.onload = populateOrderSummary;
