
import PropTypes from 'prop-types'
import LazyImage from '@/components/LazyImage'
import placeholder from '@/imgs/placeholder.png'

export default function Card({header, avatar, href, name, username, children}) {

    return (
        <div className='card bg-light'>
            <h4 className='header-lg center-text'>
                {header}
            </h4>
            <LazyImage
                className='avatar'
                src={avatar}
                alt={`Avatar for ${username}`}
                placeholder={placeholder}
            />
            <h2 className='center-text'>
                <a className='link' href={href}>{name}</a>
            </h2>
            <ul className='card-list'>
                {children}
            </ul>
        </div>
    );
}

Card.propTypes = {
    header: PropTypes.string.isRequired,
    subheader: PropTypes.string,
    avatar: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
}