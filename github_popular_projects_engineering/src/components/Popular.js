import {useState, useReducer, useEffect, useRef, Fragment}  from 'react';

import LanguagesNav from './LanguagesNav'
import Loading from './Loading'
import {fetchPopularRepos} from '@/utils'
import ReposGrid from './ReposGrid'
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

    const loadMore = () => {
        setLoadingMore(true);

        const nextPage = (state[selectedLanguage] && state[selectedLanguage].page || 1) + 1;
        fetchPopularRepos(selectedLanguage, nextPage)
            .then((data) => {
                dispatch({type: 'success',selectedLanguage, repos: data, page: nextPage, error: null, })
                setLoadingMore(false);
            })
            .catch((error) => {
                console.warn('Error fetching repos:', error);
                window.scrollBy(0, -50)

                dispatch({type: 'error'});
                setTimeout(() => {
                    setLoadingMore(false);
                })
            })
    };

    const sentinelRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loadingMore) {
                    loadMore()
                }
            },
            {
                threshold: 1.0,
            }
        );

        const currentSentinel = sentinelRef.current;
        if (currentSentinel) {
            observer.observe(currentSentinel);
        }

        return () => {
            if (currentSentinel) {
                observer.unobserve(currentSentinel);
            }
        };
    }, [state, selectedLanguage, loadingMore]);




    return {
        repos: state[selectedLanguage] && state[selectedLanguage].repos || [],
        loading: state.loading,
        error: state.error,
        loadingMore,sentinelRef
    };
}

export default function Popular() {

    const getLanguageFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('language') || 'All';
    };

    const localLanguage = getLanguageFromUrl();
    const language = localLanguage || 'All';

    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const {repos, loading, error, loadingMore,sentinelRef } = useFetch(selectedLanguage);

    const updateLanguage = (lg) => {
        history.pushState(null, null, '?language=' + lg);
        setSelectedLanguage(lg);
    };

    return (
        <>
            <LanguagesNav
                selected={selectedLanguage}
                onUpdateLanguage={updateLanguage}
            />

            {repos.length > 0 && <ReposGrid repos={repos}/>}

            {(loadingMore || loading) && <Loading text='努力加载中...'/>}
            {error && <p className='center-text error'>{error}</p>}
            {repos.length > 0 && <div ref={sentinelRef} style={{ height: '4px' }}></div>}  {/* 加载更多的触发器 */}
        </>
    );
}

