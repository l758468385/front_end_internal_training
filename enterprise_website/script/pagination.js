(function(global) {
    class MyPage {
        constructor(el, options) {
            this.el = typeof el === "string" ? document.querySelector(el) : el;
            this.options = {
                total: 1876,
                pageSize: 10,
                pageNum: 1,
                count: 7,
                inputJumpPage: true,
                selectPageSize: true,
                changePage: (pageNum) => {},
                changePageSize: (pageSize) => {},
                ...options
            };

            if (this.options.count < 5) {
                throw new Error('显示按钮个数必须大于等于5');
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
            el.addEventListener('mouseenter', (e) => {
                e.target.innerText = text;
            });
            el.addEventListener('mouseleave', (e) => {
                e.target.innerText = '•••';
            });
        }

        bindClickPage() {
            const ul = this.el.querySelector("ul");
            const lis = ul.querySelectorAll("li");

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
            if (this.totals && this.options.count) {
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
            const prevHtml = `<li class="prev-page"><a> < </a></li>`;
            const nextHtml = `<li class="next-page"><a> > </a></li>`;
            const totals = this.totals;
            const counts = Number(this.options.count);
            const halfPagerCount = Math.floor((counts - 2) / 2);
            let firstPageHtml = "";
            let lastPageHtml = "";
            let showPagesHtml = "";
            let showInputJump = "";
            let showSelectSize = "";

            if (this.options.inputJumpPage) {
                showInputJump = this.renderInputJump();
            }

            if (this.options.selectPageSize) {
                showSelectSize = this.renderPageSize();
            }

            if (totals) {
                firstPageHtml = `<li><a>1</a></li>`;
                if (currentPage === 1) {
                    firstPageHtml = `<li class="current-page"><a>1</a></li>`;
                }
                if (totals > 1) {
                    lastPageHtml = `<li><a>${totals}</a></li>`;
                    if (currentPage >= totals) {
                        this.currentPage = totals;
                        lastPageHtml = `<li class="current-page"><a>${totals}</a></li>`;
                    }
                }
                if (totals > counts) {
                    if (currentPage <= Math.ceil(counts / 2)) {
                        for (let i = 2; i < counts; i++) {
                            showPagesHtml += i === currentPage ? `<li class="current-page"><a>${i}</a></li>` : `<li><a>${i}</a></li>`;
                        }
                        showPagesHtml += `<li class="ellipsis pageJumpNext" title="向后${counts - 2}页">•••</li>${lastPageHtml}`;
                    } else {
                        if (currentPage > totals - Math.ceil(counts / 2)) {
                            for (let i = totals - (counts - 2); i < totals; i++) {
                                showPagesHtml += i === currentPage ? `<li class="current-page"><a>${i}</a></li>` : `<li><a>${i}</a></li>`;
                            }
                            showPagesHtml = `<li class="ellipsis pageJumpPrev" title="向前${counts - 2}页">•••</li>${showPagesHtml}${lastPageHtml}`;
                        } else {
                            for (let i = currentPage - halfPagerCount; i <= currentPage + halfPagerCount; i++) {
                                showPagesHtml += i === currentPage ? `<li class="current-page"><a>${i}</a></li>` : `<li><a>${i}</a></li>`;
                            }
                            showPagesHtml = `<li class="ellipsis pageJumpPrev" title="向前${counts - 2}页">•••</li>${showPagesHtml}<li class="ellipsis pageJumpNext" title="向后${counts - 2}页">•••</li>${lastPageHtml}`;
                        }
                    }
                } else {
                    for (let i = 2; i < totals; i++) {
                        showPagesHtml += i === currentPage ? `<li class="current-page"><a>${i}</a></li>` : `<li><a>${i}</a></li>`;
                    }
                    showPagesHtml += lastPageHtml;
                }

                let customPaginationHtml = `<ul class="pageWrap">${showSelectSize}${prevHtml}${firstPageHtml}${showPagesHtml}${nextHtml}${showInputJump}</ul>`;
                this.el.innerHTML = customPaginationHtml;

                this.el.querySelector('.prev-page').addEventListener('click', (e) => {
                    const el = e.currentTarget;
                    if (!el.hasAttribute("disabled")) {
                        this.prevPage();
                    }
                });

                this.el.querySelector('.next-page').addEventListener('click', (e) => {
                    const el = e.currentTarget;
                    if (!el.hasAttribute("disabled")) {
                        this.nextPage();
                    }
                });

                if (this.el.querySelector('.pageJumpPrev')) {
                    this.bindJumpPageMoreShow(this.el.querySelector('.pageJumpPrev'), 'prev');
                    this.el.querySelector('.pageJumpPrev').addEventListener('click', () => {
                        this.prevJumpPage();
                    });
                }

                if (this.el.querySelector('.pageJumpNext')) {
                    this.bindJumpPageMoreShow(this.el.querySelector('.pageJumpNext'), 'next');
                    this.el.querySelector('.pageJumpNext').addEventListener('click', () => {
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
            } else {
                this.el.innerHTML = `<ul class="pageWrap">${prevHtml}<li><a class="current-page">1</a></li>${nextHtml}</ul>`;
                const prev = this.el.querySelector(".prev-page");
                const next = this.el.querySelector('.next-page');

                prev.style.cssText = "cursor: not-allowed;color: #666666;color: #dcdcdc;background-color: #fafafa;";
                prev.setAttribute("disabled", true);
                next.style.cssText = "cursor: not-allowed;color: #666666;color: #dcdcdc;background-color: #fafafa;";
                next.setAttribute("disabled", true);
            }
        }

        destroy() {
            this.el.innerHTML = "";
        }
    }

    if (typeof module !== "undefined" && module.exports) {

        console.log('nnnn')
        module.exports = MyPage;
    }

    global.MyPage = MyPage;
}(this));
