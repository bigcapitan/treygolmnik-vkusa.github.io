document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    header.addEventListener('mouseenter', () => {
        header.classList.add('header-active');
    });
    header.addEventListener('mouseleave', () => {
        header.classList.remove('header-active');
    });
});

