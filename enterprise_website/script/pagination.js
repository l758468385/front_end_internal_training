class PagePlugin {
    pageNum = 1
    pageSize = 10
    total = 0
    element
    totalPageNum // 总页数
    totalSize // 总条数
    pageIndexBox
    pageItem = []

    callback // 回调函数，用于翻页的时候回调

    constructor(element, callback) {
        this.callback = callback
        this.element = document.getElementById(element)
        this.element.innerHTML = `
            <div>共<span id='totalPageNum'>-</span>页/<span id='totalSize'>-</span>条数据</div>
            <div class='page-index' id='pageIndexBox'></div>
            <div>
                每页<select id='pageSizeSelect' class='form-control-sm'>
                    <option value='5'>5</option>
                    <option value='10' selected>10</option>
                    <option value='20'>20</option>
                    <option value='50'>50</option>
                    <option value='100'>100</option>
                </select>条数据
            </div>
            <div>前往<input id='pageJumpInput' type='number' style='width: 80px;' class='form-control-sm' type='text'>页</div>`;

        this.totalPageNum = document.getElementById('totalPageNum')
        this.totalSize = document.getElementById('totalSize')
        this.pageIndexBox = document.getElementById('pageIndexBox')

        document.getElementById('pageJumpInput').onkeydown = event => {
            if (event.code === 'Enter') {
                this.callback({
                    pageNum: document.getElementById('pageJumpInput').value,
                    pageSize: this.pageSize
                })
            }
        }

        document.getElementById('pageSizeSelect').addEventListener('change', () => {
            this.pageSize = parseInt(document.getElementById('pageSizeSelect').value)
            this.setPage(1, this.pageSize, this.total)
        })

        this.setPage()
    }

    // 初始化或重新渲染翻页组件的UI
    initUI() {
        this.totalPageNum.innerText = Math.ceil(this.total / this.pageSize)
        this.totalSize.innerText = this.total

        // 添加上一页按钮
        const lastPage = document.createElement('div')
        lastPage.innerText = '<'
        lastPage.addEventListener('click', () => {
            if (this.pageNum > 1) {
                this.setPage(this.pageNum - 1)
            }
        })
        this.pageIndexBox.appendChild(lastPage)

        // 添加下一页按钮
        const nextPage = document.createElement('div')
        nextPage.innerText = '>'
        nextPage.addEventListener('click', () => {
            if (this.pageNum < Math.ceil(this.total / this.pageSize)) {
                this.setPage(this.pageNum + 1)
            }
        })
        this.pageIndexBox.appendChild(nextPage)
    }

    setPage(pageNum = 1, pageSize = 10, total = 8) {
        this.pageSize = pageSize
        if (this.total !== total) {
            this.total = total
            this.pageIndexBox.innerHTML = ''
            this.createPageItem()
        } else if (this.pageNum !== pageNum) {
            this.pageNum = pageNum
            this.updateUI()
        }
    }

    // 创建按钮
    createPageItem() {
        const pageTotal = Math.ceil(this.total / this.pageSize)
        const showPageItemNum = pageTotal > 9 ? 9 : pageTotal // 最多展示9个翻页数组按钮

        let needResetPageItem = false
        if (this.pageItem.length !== showPageItemNum) {
            needResetPageItem = true
            this.pageItem = []
            this.initUI()
        }

        for (let i = 0; i < showPageItemNum; i++) {
            let element
            if (!needResetPageItem) {
                element = this.pageItem[i]
            } else {
                element = document.createElement('div')
                element.addEventListener('click', () => {
                    if (element.innerText === '...') {
                        if (element.btnType === 'last') {
                            this.pageNum - 5 >= 0 ? (this.pageNum -= 5) : (this.pageNum = 0)
                        } else {
                            this.pageNum + 5 <= pageTotal ? (this.pageNum += 5) : (this.pageNum = pageTotal)
                        }
                    } else {
                        const pageNum = Number(element.innerText)
                        if (pageNum === this.pageNum) {
                            return
                        }
                        this.pageNum = pageNum
                    }
                    this.updateUI()
                    this.callback({
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    })
                })
                this.pageItem.push(element)
            }
            this.pageIndexBox.insertBefore(element, this.pageIndexBox.lastChild)
        }

        if (pageTotal > 9) {
            this.pageItem[1].btnType = 'last'
            this.pageItem[7].btnType = 'next'
        }

        this.updateUI()
    }

    updateUI() {
        const pageTotal = Math.ceil(this.total / this.pageSize)
        this.totalPageNum.innerText = pageTotal
        this.totalSize.innerText = this.total

        for (let i = 0; i < this.pageItem.length; i++) {
            if (this.pageNum < 5) {
                this.pageItem[i].innerText = i + 1
            } else if (pageTotal - this.pageNum < 5) {
                this.pageItem[i].innerText = pageTotal - 8 + i
            } else {
                this.pageItem[i].innerText = this.pageNum - 4 + i
            }
            if (this.pageNum === Number(this.pageItem[i].innerText)) {
                this.pageItem[i].className = 'active'
            } else {
                this.pageItem[i].className = ''
            }
        }

        if (pageTotal > 9) {
            if (this.pageNum > 4) {
                this.pageItem[1].innerText = '...'
                this.pageItem[0].innerText = 1
            }
            if (pageTotal - this.pageNum > 4)
                this.pageItem[7].innerText = '...'
            this.pageItem[8].innerText = pageTotal
        }
    }
}
