document.addEventListener('DOMContentLoaded', function () {
    console.log('Welcome to Halocoko Route 🚀');

    document.querySelectorAll('a').forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Button clicked:', btn.textContent.trim());
        });
    });
});
