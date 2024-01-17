window.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("checkout-form").addEventListener("submit", function(event) {
        // Obtén la fecha y hora del campo datetime-local
        const dateInput = document.getElementById("date-input");
        const selectedDate = dateInput.value;
    
        // Asigna la fecha y hora al campo hidden
        document.getElementsByName("date")[0].value = selectedDate;
    });
});
