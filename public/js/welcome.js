document.addEventListener('DOMContentLoaded', function () {
    console.log('Welcome to Halocoko Route 🚀');

    document.querySelectorAll('a').forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Button clicked:', btn.textContent.trim());
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".feature-card");

    cards.forEach((card, i) => {
        card.style.opacity = 0;
        card.style.transform = "translateY(30px)";

        setTimeout(() => {
            card.style.transition = "0.6s ease";
            card.style.opacity = 1;
            card.style.transform = "translateY(0)";
        }, 200 + i * 180);
    });

});
