document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.querySelector('.menuBtn');
    const navBox = document.querySelector('#navBox');
    menuBtn.addEventListener('click', function () {
        if (!menuBtn.classList.contains('active')) {
            navBox.classList.add('mobile-nav-box-active')
            menuBtn.classList.add('active')
        } else {
            menuBtn.classList.remove('active');
            navBox.classList.remove('mobile-nav-box-active');
        }
    })
})