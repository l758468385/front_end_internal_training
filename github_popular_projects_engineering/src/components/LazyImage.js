
import {useRef, useEffect, useState} from 'react'

export default function LazyImage({src, alt, className, placeholder}) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    observer.unobserve(imgRef.current);
                }
            },
            {threshold: 0.1}
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    return (
        <img
            ref={imgRef}
            src={isIntersecting ? src : placeholder}
            alt={alt}
            className={className}
        />
    );
}