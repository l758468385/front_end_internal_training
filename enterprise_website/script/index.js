document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll('.hide-ele');

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

});
