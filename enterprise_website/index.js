document.addEventListener("DOMContentLoaded", function() {
    var elements = document.querySelectorAll('.hidden');
    const serviceDom = document.getElementById('scope-of-services')
    console.log('elements',elements.length)
    function isElementInViewport(dom) {
        // 获取可视窗口的盖度。
        const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        // 获取滚动条滚动的高度
        const scrollTop = document.documentElement.scrollTop;
        // 获取元素偏移的高度。就是距离可视窗口的偏移量。
        const offsetTop = dom.offsetTop;
        return offsetTop - scrollTop <= screenHeight;
    }

    function checkElementsInView() {
        if(isElementInViewport(serviceDom)) {
            elements.forEach((element) => {
                if (isElementInViewport(element) && !element.dataset.animated) {
                    if (element.tagName === 'H2' || (element.tagName === 'DIV' && element.querySelector('span'))) {
                        element.classList.add('animate-slideInLeft');
                    } else if (element.tagName === 'IMG') {
                        element.classList.add('animate-fadeIn');
                    }
                    element.classList.remove('hidden');
                    element.dataset.animated = "true";
                }
            });
        }

    }

    window.addEventListener('scroll', checkElementsInView);
    window.addEventListener('resize', checkElementsInView);
    checkElementsInView(); // Initial check in case elements are already in view



    window.addEventListener('scroll', function() {
        var scrollTop = window.scrollY;
        var parallaxElement = document.querySelector('.culture-wrap');
        parallaxElement.style.backgroundPositionY = -scrollTop * 0.5 + 'px';
    });
});
