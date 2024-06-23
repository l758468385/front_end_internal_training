const {useState, useReducer, useEffect, useRef, Fragment} = React;

function popularReducer(state, action) {
    switch (action.type) {
        case 'fetch':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'success':
            return {
                ...state,
                [action.selectedLanguage]: {
                    repos: [
                        ...(state[action.selectedLanguage] && state[action.selectedLanguage].repos || []),
                        ...action.repos
                    ],
                    page: action.page
                },
                loading: false
            };
        case 'error':
            return {
                ...state,
                error: 'Error fetching data. Try again',
                loading: false
            };
        case 'reset':
            return {
                ...state,
                loading: false,
                error: null
            };
        default:
            throw new Error("That action type isn't supported.");
    }
}

function useFetch(selectedLanguage) {
    const [state, dispatch] = useReducer(
        popularReducer,
        {error: null, loading: true}
    );

    const [loadingMore, setLoadingMore] = useState(false); // 新增 loadingMore 状态

    const previousLanguage = useRef(selectedLanguage);

    useEffect(() => {
        if (previousLanguage.current !== selectedLanguage) {
            previousLanguage.current = selectedLanguage;

            if (state[selectedLanguage] && state[selectedLanguage].repos && state[selectedLanguage].repos.length > 0) {
                dispatch({type: 'reset'});
                return;
            }
        }

        if (state[selectedLanguage] && state[selectedLanguage].repos && state[selectedLanguage].repos.length > 0) return;

        dispatch({type: 'fetch'});

        fetchPopularRepos(selectedLanguage, 1)
            .then((data) =>
                dispatch({type: 'success', error: null, selectedLanguage, repos: data, page: 1})
            )
            .catch((error) => {
                console.warn('Error fetching repos:', error);
                dispatch({type: 'error'});
            });
    }, [selectedLanguage]);

    useEffect(() => {
        const handleScroll = debounce(() => {
            console.log('监控滚动....')
            if (
                onBottom()
                && !loadingMore  // 确保不是正在加载更多的状态
            ) {
                loadMore();
            }
        })
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [state, selectedLanguage, loadingMore]);

    const loadMore = () => {
        setLoadingMore(true); // 设置正在加载更多的状态

        const nextPage = (state[selectedLanguage] && state[selectedLanguage].page || 1) + 1;

        fetchPopularRepos(selectedLanguage, nextPage)
            .then((data) =>
                dispatch({type: 'success', error: null, selectedLanguage, repos: data, page: nextPage})
            )
            .catch((error) => {
                console.warn('Error fetching repos:', error);
                dispatch({type: 'error'});
            })
            .finally(() => {
                setLoadingMore(false); // 取消加载更多的状态
            });
    };

    return {
        repos: state[selectedLanguage] && state[selectedLanguage].repos || [],
        loading: state.loading,
        error: state.error, loadingMore
    };
}


function Popular() {

    const localLanguage = localStorage.getItem('localLanguage');
    const language = localLanguage || 'All'


    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const {repos, loading, error, loadingMore} = useFetch(selectedLanguage);
    const updateLanguage = (lg) => {
        localStorage.setItem('localLanguage', lg);
        setSelectedLanguage(lg)
    }
    return (
        <Fragment>
            <LanguagesNav
                selected={selectedLanguage}
                onUpdateLanguage={updateLanguage}
            />


            {repos.length > 0 && <ReposGrid repos={repos}/>}

            {(loadingMore || loading) && <Loading text='努力加载中...'/>}

            {error && <p className='center-text error'>{error}</p>}


        </Fragment>
    );
}


function onBottom() {
    //窗口高度
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //滚动高度
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //页面高度
    const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    return (windowHeight + scrollTop + 250) >= (+documentHeight)
}


function debounce(fn, delay = 300) {
    if (typeof fn !== 'function') {
        throw new TypeError('fn不是函数')
    }
    let timer; // 维护一个 timer
    return function () {
        const _this = this; // 取debounce执行作用域的this(原函数挂载到的对象)
        const args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            fn.apply(_this, args); // 用apply指向调用debounce的对象，相当于_this.fn(args);
        }, delay);
    };
}

window.Popular = Popular;
