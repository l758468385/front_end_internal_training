const {useState, useReducer, useEffect, useRef, Fragment} = React;

function popularReducer(state, action) {
    switch (action.type) {
        case 'fetch':
            return {
                ...state,
                loading: true,
                error: null // 在开始请求时重置错误状态
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
                error: null,
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

    const [loadingMore, setLoadingMore] = useState(false);

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

        dispatch({type: 'fetch'}); // 清除错误状态

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
            if (onBottom() && !loadingMore) {
                loadMore();
            }
        });
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [state, selectedLanguage, loadingMore]);

    const loadMore = () => {
        setLoadingMore(true);

        const nextPage = (state[selectedLanguage] && state[selectedLanguage].page || 1) + 1;
        fetchPopularRepos(selectedLanguage, nextPage)
            .then((data) =>
                dispatch({type: 'success',selectedLanguage, repos: data, page: nextPage, error: null, })
            )
            .catch((error) => {
                console.warn('Error fetching repos:', error);
                dispatch({type: 'error'});
            })
            .finally(() => {
                setLoadingMore(false);
            });
    };

    return {
        repos: state[selectedLanguage] && state[selectedLanguage].repos || [],
        loading: state.loading,
        error: state.error,
        loadingMore
    };
}

function Popular() {

    const getLanguageFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('language') || 'All';
    };

    const localLanguage = getLanguageFromUrl();
    const language = localLanguage || 'All';

    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const {repos, loading, error, loadingMore} = useFetch(selectedLanguage);

    const updateLanguage = (lg) => {
        history.pushState(null, null, '?language=' + lg);
        setSelectedLanguage(lg);
    };

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
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    return (windowHeight + scrollTop + 250) >= (+documentHeight);
}

function debounce(fn, delay = 300) {
    if (typeof fn !== 'function') {
        throw new TypeError('fn不是函数');
    }
    let timer;
    return function () {
        const _this = this;
        const args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            fn.apply(_this, args);
        }, delay);
    };
}

window.Popular = Popular;
