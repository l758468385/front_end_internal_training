document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.querySelector('.menuBtn');
    const navBox = document.querySelector('#navBox');
    menuBtn.addEventListener('click', function () {
        if (!navBox.classList.contains('active')) {
            navBox.classList.add('active')
            menuBtn.classList.add('active')
        } else {
            menuBtn.classList.remove('active');
            navBox.classList.remove('active');
        }
    })
})