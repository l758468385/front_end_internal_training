const{ useState, useEffect, useRef } = React


function useFetch(selectedLanguage) {
    const [repos, setRepos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const previousLanguage = useRef(selectedLanguage);

    useEffect(() => {
        if (previousLanguage.current !== selectedLanguage) {
            previousLanguage.current = selectedLanguage;
            setRepos([]);
            setPage(1);
            setError(null);
        }

        if (repos.length > 0) return;

        setLoading(true);
        fetchPopularRepos(selectedLanguage, 1)
            .then((data) => {
                setRepos(data);
                setPage(1);
                setLoading(false);
                setError(null);
            })
            .catch((error) => {
                console.warn('Error fetching repos:', error);
                setError('Error fetching data. Try again');
                setLoading(false);
            });
    }, [selectedLanguage, repos]);

    const loadMore = () => {
        const nextPage = page + 1;

        fetchPopularRepos(selectedLanguage, nextPage)
            .then((data) => {
                setRepos((prevRepos) => [...prevRepos, ...data]);
                setPage(nextPage);
                setLoadingMore(false);
                setError(null);
            })
            .catch(() => {
                setError('Error fetching data. Try again');
                window.scrollBy(0, -50);
                setLoadingMore(false);
            });
    };

    const sentinelRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loadingMore) {
                    setLoadingMore(true);
                    loadMore();
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
    }, [repos, selectedLanguage, loadingMore]);

    return {
        repos,
        loading,
        error,
        loadingMore,
        sentinelRef,
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
    const { repos, loading, error, loadingMore, sentinelRef } = useFetch(selectedLanguage);

    const updateLanguage = (lg) => {
        history.pushState(null, null, '?language=' + lg);
        setSelectedLanguage(lg);
    };

    return (
        <div>
            <LanguagesNav selected={selectedLanguage} onUpdateLanguage={updateLanguage} />
            {repos.length > 0 && <ReposGrid repos={repos} />}
            {(loadingMore || loading) && <Loading text="努力加载中..." />}
            {error && <p className="center-text error">{error}</p>}
            {repos.length > 0 && <div ref={sentinelRef} style={{ height: '4px' }}></div>}
        </div>
    );
}
window.Loading = Loading;