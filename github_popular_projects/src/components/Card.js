const {useState, useRef, useEffect} = React;


function Card({header, avatar, href, name, username, children}) {
    const placeholder = 'src/imgs/placeholder.png';

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

window.Card = Card;
