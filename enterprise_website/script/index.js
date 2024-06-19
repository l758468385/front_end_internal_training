document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll('.hide-ele');
    console.log('hide-ele', elements.length);

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.tagName === 'H2' || element.tagName === 'SPAN' || element.tagName === 'H3' || (element.tagName === 'DIV' && element.querySelector('span'))) {
                    element.classList.add('animate-slideInLeft');
                } else if (element.tagName === 'IMG') {
                    element.classList.add('animate-fadeIn');
                }
                element.classList.remove('hide-ele');
                element.dataset.animated = "true";
                observer.unobserve(element); // 停止观察已动画的元素
            }
        });
    });

    elements.forEach(element => {
        observer.observe(element);
    });


    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const parallaxElement = document.querySelector('.culture-wrap');
        parallaxElement.style.backgroundPositionY = -scrollTop * 0.5 + 'px';
    });

    const menuBtn = document.querySelector('.menuBtn');
    const navBox = document.querySelector('#navBox');
    console.log('navBox',navBox)
    menuBtn.addEventListener('click', function() {
        console.log('navBox.style.display',navBox.style.display)
      if(navBox.style.display === 'none' || !navBox.style.display ) {
          navBox.style.display = 'block';
          menuBtn.classList.add('active')
      }else {
          navBox.style.display = 'none';
          menuBtn.classList.remove('active');
      }
    })

});
