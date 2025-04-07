document.addEventListener("DOMContentLoaded", function () {
    const stadiumSections = document.querySelectorAll(".section");
    const selectedSeatsDisplay = document.getElementById("selected-seats");
    const totalPriceDisplay = document.getElementById("total-price");
    const confirmButton = document.getElementById("confirm-booking");

    const seatPrices = {
        "mid-102": 120, "mid-104": 120, "mid-106": 120,
        "mid-108": 100, "mid-110": 100, "mid-112": 80, "mid-114": 80
    };

    let selectedSeats = [];
    let totalPrice = 0;

    stadiumSections.forEach(section => {
        section.addEventListener("click", function () {
            const seatId = this.id;
            const seatPrice = seatPrices[seatId] || 50; // Default price

            if (this.classList.contains("selected")) {
                this.classList.remove("selected");
                selectedSeats = selectedSeats.filter(s => s.id !== seatId);
                totalPrice -= seatPrice;
            } else {
                this.classList.add("selected");
                selectedSeats.push({ id: seatId, price: seatPrice });
                totalPrice += seatPrice;
            }

            updateSelectedSeats();
        });
    });

    function updateSelectedSeats() {
        selectedSeatsDisplay.textContent = selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(", ") : "None";
        totalPriceDisplay.textContent = `$${totalPrice}`;
    }

    confirmButton.addEventListener("click", function () {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat!");
        } else {
            alert(`You have booked: ${selectedSeats.map(s => s.id).join(", ")}\nTotal Price: $${totalPrice}`);
            selectedSeats = [];
            totalPrice = 0;
            updateSelectedSeats();
        }
    });
});
