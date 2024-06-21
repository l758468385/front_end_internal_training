document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.querySelector('.menuBtn');
    const navBox = document.querySelector('#navBox');
    menuBtn.addEventListener('click', function () {
        console.log('navBox.style.display', navBox.style.display)
        if (navBox.style.display === 'none' || !navBox.style.display) {
            navBox.style.display = 'block';
            navBox.classList.add('active')
            menuBtn.classList.add('active')
        } else {
            navBox.style.display = 'none';
            menuBtn.classList.remove('active');
            navBox.classList.remove('active');
        }
    })
})