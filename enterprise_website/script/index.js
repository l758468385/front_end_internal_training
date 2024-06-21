document.addEventListener("DOMContentLoaded", function () {

    function addAnimation() {
        const elements = document.querySelectorAll('.hide-ele');

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if(element.dataset.aname) {
                        element.classList.add(element.dataset.aname)
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
    }


    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY;
        const parallaxElement = document.querySelector('.culture-wrap');
        parallaxElement.style.backgroundPositionY = scrollTop * 0.5 + 'px';
    });


    function lazyLoadImg() {
        let lazyImages = [].slice.call(document.querySelectorAll("picture.lazy, img.lazy"));

        function loadImage(lazyElement) {
            if (lazyElement.tagName.toLowerCase() === 'picture') {
                const sources = lazyElement.querySelectorAll("source");
                sources.forEach(source => {
                    source.srcset = source.dataset.srcset;
                });
                const img = lazyElement.querySelector("img");
                img.src = img.dataset.src;
            } else if (lazyElement.tagName.toLowerCase() === 'img') {
                lazyElement.src = lazyElement.dataset.src;
            }
            lazyElement.classList.remove("lazy");
        }

        if ("IntersectionObserver" in window) {
            let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        let lazyElement = entry.target;
                        loadImage(lazyElement);
                        lazyImageObserver.unobserve(lazyElement);
                    }
                });
            });

            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // 退回到事件监听（旧浏览器支持）
            let lazyLoad = function() {
                lazyImages.forEach(function(lazyElement) {
                    if (lazyElement.getBoundingClientRect().top <= window.innerHeight && lazyElement.getBoundingClientRect().bottom >= 0 && getComputedStyle(lazyElement).display !== "none") {
                        loadImage(lazyElement);
                    }
                });

                lazyImages = lazyImages.filter(img => img.classList.contains("lazy"));

                if (lazyImages.length === 0) {
                    document.removeEventListener("scroll", lazyLoad);
                    window.removeEventListener("resize", lazyLoad);
                    window.removeEventListener("orientationchange", lazyLoad);
                }
            };

            document.addEventListener("scroll", lazyLoad);
            window.addEventListener("resize", lazyLoad);
            window.addEventListener("orientationchange", lazyLoad);
        }
    }

    function fetchHotNews() {
        // fetch('http://127.0.0.1:3000/hot-news', {
        fetch('http://47.237.104.19:3000/hot-news', {
            method: 'get',
            mode: 'cors',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);  // 查看响应数据
                if (data.code === 200) {
                    renderHotNews(data.data);
                } else {
                    console.error('Unexpected response code:', data.code);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }

    function renderHotNews(hotNews) {
        console.log('hotNews:', hotNews);  // 确认 hotNews 数据
        const hotNewsContainer = document.getElementById('hot-news-container');
        if (!hotNewsContainer) {
            console.error('No element with id "hot-news-container" found.');
            return;
        }
        hotNews.forEach(news => {
            const newsElement = document.createElement('div');
            newsElement.classList.add('mb-6', 'md:mb-2');
            newsElement.innerHTML = `
          <a href="news-detail.html?id=${news.id}">
                <img data-aName = 'animate-fadeIn' data-src="${news.cover}" class="w-full h-[300px] md:h-[506px] hide-ele lazy hot-news-img"  alt="">
                <h2 data-aName = 'animate-fadeIn' class="text-xl leading-9 block mt-9 mb-7 hide-ele" style="color: #fafafa">${news.title}</h2>
                <h2 data-aName = 'animate-fadeIn' class="text-sm hide-ele">${news.summary}</h2>
            </a>
        `;
            hotNewsContainer.appendChild(newsElement);
        });
        lazyLoadImg()
        addAnimation()
    }

    fetchHotNews();




});
