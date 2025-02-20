function showPlan(serviceId) {
    let plan = document.querySelector(`#${serviceId} .setup-plan`);
    if (plan.classList.contains('hidden')) {
        plan.classList.remove('hidden');
    } else {
        plan.classList.add('hidden');
    }
}
// Slideshow Functionality
let slideIndex = 0;
function showSlides() {
    let slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 3000);
}
document.addEventListener("DOMContentLoaded", showSlides);

// Open Order Form
function openOrderForm() {
    document.getElementById("order-form").classList.toggle("hidden");
}

// Send Order Request & Redirect to Quotation Page
function submitOrder(service) {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let orderButton = document.getElementById("order-button");
    let successMessage = document.getElementById("success-message");

    if (name === "" || email === "") {
        alert("Please enter your name and email.");
        return;
    }

    // Show Loading State
    orderButton.innerText = "Placing Order...";
    orderButton.classList.add("loading");
    orderButton.disabled = true;

    fetch('https://terabalance-production.up.railway.app/order', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, service })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            successMessage.innerText = "Your order has been placed successfully! Redirecting to the quotation page,commitment fee payment...";
            successMessage.classList.remove("hidden");

            // Redirect to Quotation Page After 3 Seconds
            setTimeout(() => {
                window.location.href = `../quotations/${service.toLowerCase().replace(" ", "-")}-quotation.html`;
            }, 3000);
        } else {
            alert("Something went wrong. Please try again.");
            orderButton.innerText = "Order";
            orderButton.classList.remove("loading");
            orderButton.disabled = false;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to place order. Please try again.");
        orderButton.innerText = "Order";
        orderButton.classList.remove("loading");
        orderButton.disabled = false;
    });
}

// Scroll the services slideshow left
function scrollLeft() {
    let slider = document.querySelector(".services-slideshow");
    slider.scrollBy({ left: -300, behavior: "smooth" });
}

// Scroll the services slideshow right
function scrollRight() {
    let slider = document.querySelector(".services-slideshow");
    slider.scrollBy({ left: 300, behavior: "smooth" });
}

// Auto-slide functionality
function autoSlide() {
    let slider = document.querySelector(".services-slideshow");
    let maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    if (slider.scrollLeft >= maxScrollLeft) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
    } else {
        slider.scrollBy({ left: 300, behavior: "smooth" });
    }
}

// Start auto-slide every 4 seconds
setInterval(autoSlide, 4000);
