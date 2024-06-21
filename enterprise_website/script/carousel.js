document.addEventListener("DOMContentLoaded", function() {
    const carousel = document.getElementById("carousel");
    const carouselInner = carousel.querySelector(".carousel-inner");
    const indicatorsContainer = carousel.querySelector(".indicators");

    const slidesData = [
        {
            src: "static/slide1.jpg",
            alt: "Slide 1",
            small: "static/slide1-small.jpg",
            medium: "static/slide1-medium.jpg",
            large: "static/slide1-large.jpg"
        },
        {
            src: "static/slide2.jpg",
            alt: "Slide 2",
            small: "static/slide2-small.jpg",
            medium: "static/slide2-medium.jpg",
            large: "static/slide2-large.jpg"
        },
        {
            src: "static/slide3.jpg",
            alt: "Slide 3",
            small: "static/slide3-small.jpg",
            medium: "static/slide3-medium.jpg",
            large: "static/slide3-large.jpg"
        },
    ];

    let currentIndex = 0;
    const totalSlides = slidesData.length;
    let intervalId = null; // 初始化为 null
    const slideDuration = 5000; // 幻灯片切换间隔时间，单位：毫秒

    // 创建所有幻灯片和指示器
    slidesData.forEach((slide, index) => {
        const slideElement = document.createElement("div");
        slideElement.classList.add("carousel-item");
        if (index === 0) {
            slideElement.classList.add("active");
        }
        slideElement.innerHTML = `
            <picture  class="lazy">
                <source src="static/placeholder.png" media="(max-width: 600px)" data-srcset="${slide.small}">
                <source src="static/placeholder.png" media="(min-width: 601px)" data-srcset="${slide.medium}">
                <img  src="static/placeholder.png" data-src="${slide.large}" alt="${slide.alt}">
            </picture>
        `;
        carouselInner.appendChild(slideElement);

        const indicator = document.createElement("div");
        indicator.classList.add("indicator");

        // 创建 SVG 元素作为指示器
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");

        const circleBackground = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circleBackground.setAttribute("cx", "12");
        circleBackground.setAttribute("cy", "12");
        circleBackground.setAttribute("r", "10");
        circleBackground.classList.add("progress-background");
        svg.appendChild(circleBackground);

        const circleProgress = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circleProgress.setAttribute("cx", "12");
        circleProgress.setAttribute("cy", "12");
        circleProgress.setAttribute("r", "10");
        circleProgress.classList.add("progress-circle");
        svg.appendChild(circleProgress);

        indicator.appendChild(svg);

        indicatorsContainer.appendChild(indicator);

        // 添加点击事件监听器
        indicator.addEventListener("click", () => {
            if (index !== currentIndex) {
                pauseCarousel();
                showSlide(index);
                startCarousel(); // 在手动切换后重新启动轮播
            }
        });
    });

    const indicators = carousel.querySelectorAll(".indicator");
    const slides = carousel.querySelectorAll(".carousel-item");

    // 函数：显示指定索引的幻灯片
    function showSlide(index) {
        // 切换指示器状态
        indicators[currentIndex].classList.remove("active");
        indicators[index].classList.add("active");

        slides[currentIndex].classList.remove("active");
        slides[index].classList.add("active");

        // 移动幻灯片容器以显示指定幻灯片
        const slideWidth = slides[0].clientWidth;
        carouselInner.style.transform = `translateX(-${index * slideWidth}px)`;

        // 重置倒计时动画
        resetProgressAnimation();
        currentIndex = index;
    }

    // 函数：重置倒计时动画
    function resetProgressAnimation() {
        const activeIndicator = carousel.querySelector(".indicator.active");
        const progressCircle = activeIndicator.querySelector(".progress-circle");

        // 获取环形的周长
        const radius = parseFloat(progressCircle.getAttribute("r"));
        const circumference = 2 * Math.PI * radius;

        // 重置动画
        progressCircle.style.transition = "none";
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = `${circumference}`;
        progressCircle.getBoundingClientRect(); // 强制重绘
        progressCircle.style.transition = `stroke-dashoffset ${slideDuration}ms linear`;
        progressCircle.style.strokeDashoffset = "0"; // 顺时针绘制，动画结束时的状态
    }

    // 函数：自动播放下一张幻灯片
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % totalSlides;
        showSlide(nextIndex);
    }

    // 启动自动播放
    function startCarousel() {
        if (!intervalId) { // 避免重复启动定时器
            intervalId = setInterval(nextSlide, slideDuration); // 每隔指定时间自动切换幻灯片
        }
    }

    // 暂停自动播放
    function pauseCarousel() {
        clearInterval(intervalId);
        intervalId = null; // 清除定时器 ID

        // 暂停当前指示器动画
        const activeIndicator = carousel.querySelector(".indicator.active .progress-circle");
        if (activeIndicator) {
            const computedStyle = window.getComputedStyle(activeIndicator);
            const dashOffset = computedStyle.strokeDashoffset;
            activeIndicator.style.transition = "none";
            activeIndicator.style.strokeDashoffset = dashOffset;
        }
    }

    // 重新启动指示器动画
    function resumeProgressAnimation() {
        const activeIndicator = carousel.querySelector(".indicator.active .progress-circle");
        if (activeIndicator) {
            const radius = parseFloat(activeIndicator.getAttribute("r"));
            const circumference = 2 * Math.PI * radius;
            activeIndicator.style.transition = `stroke-dashoffset ${slideDuration}ms linear`;
            activeIndicator.style.strokeDashoffset = "0";
        }
    }

    // 鼠标悬停暂停自动播放
    carousel.addEventListener("mouseenter", () => {
        pauseCarousel();
    });

    carousel.addEventListener("mouseleave", () => {
        resumeProgressAnimation();
        startCarousel();
    });

    // 初始显示第一张幻灯片并启动自动播放
    showSlide(currentIndex); // 显示第一张幻灯片
    resetProgressAnimation(); // 启动倒计时动画
    startCarousel(); // 启动自动播放
});
