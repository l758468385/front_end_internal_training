;(function(global) {

    class MyPage {
        constructor(el, options) {
            this.el = typeof el === "string" ? document.querySelector(el) : el;
            const defaultOptions = {
                total: 1876,
                pageSize: 10,
                pageNum: 1,
                count: 7,
                inputJumpPage: true,
                selectPageSize: true,
                changePage: function(pageNum) {},
                changePageSize: function(pageSize) {}
            };

            this.options = { ...defaultOptions, ...options };

            if (this.options.count < 5) {
                throw new Error('显示按钮个数必须大于等于5啦！！！！！');
            }

            this.currentPage = this.options.pageNum;
            this.totals = Math.ceil(parseInt(this.options.total) / parseInt(this.options.pageSize));
            this.init();
        }

        init() {
            this.destroy();
            this.renderPage(this.currentPage);
        }

        prevPage() {
            this.currentPage--;
            this.renderPage(this.currentPage);
            this.options.changePage(this.currentPage);
        }

        nextPage() {
            this.currentPage++;
            this.renderPage(this.currentPage);
            this.options.changePage(this.currentPage);
        }

        prevJumpPage() {
            const jumpPage = this.options.count - 2;
            this.currentPage -= jumpPage;
            this.renderPage(this.currentPage);
            this.options.changePage(this.currentPage);
        }

        nextJumpPage() {
            const jumpPage = this.options.count - 2;
            this.currentPage += jumpPage;
            this.renderPage(this.currentPage);
            this.options.changePage(this.currentPage);
        }

        clickInputJump(el) {
            el.addEventListener('click', () => {
                this.currentPage = Number(this.el.querySelector('.page_input').value);
                this.renderPage(this.currentPage);
            });

            const input = this.el.querySelector('.page_input');
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    this.currentPage = Number(input.value);
                    this.renderPage(this.currentPage);
                    this.options.changePage(this.currentPage);
                }
            });
        }

        selectChangeSize(el) {
            el.addEventListener('change', (e) => {
                this.options.pageSize = Number(el.value);
                this.totals = Math.ceil(parseInt(this.options.total) / parseInt(this.options.pageSize));
                this.renderPage(this.currentPage);
                this.options.changePageSize(this.options.pageSize);
            });
        }

        bindJumpPageMoreShow(el, direction) {
            const text = direction === 'prev' ? '<<' : '>>';

            el.addEventListener('mouseenter', () => {
                el.innerText = text;
            });

            el.addEventListener('mouseleave', () => {
                el.innerText = '•••';
            });
        }

        bindClickPage() {
            const ul = this.el.querySelector("ul");
            const lis = Array.from(ul.querySelectorAll("li"));

            lis.forEach((li) => {
                if (!li.classList.contains('prev-page') &&
                    !li.classList.contains('next-page') &&
                    !li.classList.contains('ellipsis') &&
                    !li.classList.contains('page-to') &&
                    !li.classList.contains('select-pagesize')) {
                    li.addEventListener('click', (e) => {
                        this.currentPage = Number(e.target.innerText);
                        this.renderPage(this.currentPage);
                        this.options.changePage(this.currentPage);
                    });
                }
            });
        }

        disablePreNext() {
            const prev = this.el.querySelector(".prev-page");
            const next = this.el.querySelector('.next-page');

            if (this.currentPage === 1) {
                prev.style.cssText = "cursor: not-allowed;color: #666666;color: #dcdcdc;background-color: #fafafa;";
                prev.setAttribute("disabled", true);
            } else {
                prev.removeAttribute("style");
                prev.removeAttribute("disabled");
            }

            if (this.currentPage === this.totals) {
                next.style.cssText = "cursor: not-allowed;color: #666666;color: #dcdcdc;background-color: #fafafa;";
                next.setAttribute("disabled", true);
            } else {
                next.removeAttribute("style");
                next.removeAttribute("disabled");
            }
        }

        renderInputJump() {
            return `<li class="page-to">跳至<input type="text" class="page_input" />页<span style="visibility: hidden;position: absolute" class="go">GO</span></li>`;
        }

        renderPageSize() {
            return `<li class="select-pagesize">
            <select class="select-size">
                <option value="8">8条/页</option>
                <option value="16">16条/页</option>
                <option value="32">32条/页</option>
            </select>
        </li>`;
        }

        renderPage(currentPage) {
            let prevHtml = `<li class="prev-page"><a> < </a></li>`;
            let nextHtml = `<li class="next-page"><a> > </a></li>`;
            let firstPageHtml = `<li><a>1</a></li>`;
            let lastPageHtml = `<li><a>${this.totals}</a></li>`;
            let showPagesHtml = "";

            if (this.totals > 1) {
                if (currentPage === 1) {
                    firstPageHtml = `<li class="current-page"><a>1</a></li>`;
                }
                if (currentPage >= this.totals) {
                    this.currentPage = this.totals;
                    lastPageHtml = `<li class="current-page"><a>${this.totals}</a></li>`;
                }
            }

            if (this.totals > this.options.count) {
                if (currentPage <= Math.ceil(this.options.count / 2)) {
                    for (let i = 2; i < this.options.count; i++) {
                        showPagesHtml += `<li${currentPage === i ? ' class="current-page"' : ''}><a>${i}</a></li>`;
                    }
                    showPagesHtml += `<li class="ellipsis pageJumpNext" title="向后${this.options.count - 2}页">•••</li>${lastPageHtml}`;
                } else if (currentPage > this.totals - Math.ceil(this.options.count / 2)) {
                    for (let i = this.totals - (this.options.count - 2); i < this.totals; i++) {
                        showPagesHtml += `<li${currentPage === i ? ' class="current-page"' : ''}><a>${i}</a></li>`;
                    }
                    showPagesHtml = `<li class="ellipsis pageJumpPrev" title="向前${this.options.count - 2}页">•••</li>${showPagesHtml}${lastPageHtml}`;
                } else {
                    for (let i = currentPage - Math.floor((this.options.count - 2) / 2); i <= currentPage + Math.floor((this.options.count - 2) / 2); i++) {
                        showPagesHtml += `<li${currentPage === i ? ' class="current-page"' : ''}><a>${i}</a></li>`;
                    }
                    showPagesHtml = `<li class="ellipsis pageJumpPrev" title="向前${this.options.count - 2}页">•••</li>${showPagesHtml}<li class="ellipsis pageJumpNext" title="向后${this.options.count - 2}页">•••</li>${lastPageHtml}`;
                }
            } else {
                for (let i = 2; i < this.totals; i++) {
                    showPagesHtml += `<li${currentPage === i ? ' class="current-page"' : ''}><a>${i}</a></li>`;
                }
                showPagesHtml += lastPageHtml;
            }

            let customPaginationHtml = `<ul class="pageWrap">${this.options.selectPageSize ? this.renderPageSize() : ''}${prevHtml}${firstPageHtml}${showPagesHtml}${nextHtml}${this.options.inputJumpPage ? this.renderInputJump() : ''}</ul>`;
            this.el.innerHTML = customPaginationHtml;

            this.addEvent(this.el.querySelector('.prev-page'), 'click', () => {
                if (!this.el.querySelector('.prev-page').hasAttribute("disabled")) {
                    this.prevPage();
                }
            });

            this.addEvent(this.el.querySelector('.next-page'), 'click', () => {
                if (!this.el.querySelector('.next-page').hasAttribute("disabled")) {
                    this.nextPage();
                }
            });

            if (this.el.querySelector('.pageJumpPrev')) {
                this.bindJumpPageMoreShow(this.el.querySelector('.pageJumpPrev'), 'prev');
                this.addEvent(this.el.querySelector('.pageJumpPrev'), 'click', () => {
                    this.prevJumpPage();
                });
            }

            if (this.el.querySelector('.pageJumpNext')) {
                this.bindJumpPageMoreShow(this.el.querySelector('.pageJumpNext'), 'next');
                this.addEvent(this.el.querySelector('.pageJumpNext'), 'click', () => {
                    this.nextJumpPage();
                });
            }

            if (this.options.inputJumpPage) {
                this.clickInputJump(this.el.querySelector('.go'));
            }

            if (this.options.selectPageSize) {
                this.el.querySelector('.select-size').value = this.options.pageSize;
                this.selectChangeSize(this.el.querySelector('.select-size'));
            }

            this.bindClickPage();
            this.disablePreNext();
        }

        addEvent(elem, type, fn) {
            if (elem.attachEvent) {
                elem.attachEvent("on" + type, fn);
            } else if (elem.addEventListener) {
                elem.addEventListener(type, fn, false);
            }
        }

        destroy() {
            this.el.innerHTML = "";
        }
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = MyPage;
    }

    if (typeof define === "function") {
        define(() => MyPage);
    }

    global.MyPage = MyPage
}(this))