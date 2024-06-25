import React from 'react'
import {NavLink} from 'react-router-dom'

const activeStyle = {
    color: 'rgb(187, 46, 31)'
}

function computedClassName({isActive}) {
    return isActive ? 'nav-link-active' : 'nav-link'
}

export default function Nav() {
    return (
        <nav className='row space-between'>
            <ul className='row nav'>
                <li>
                    <NavLink
                        to='/popular'
                        className={computedClassName}
                    >
                        Popular
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/battle'
                        className={computedClassName}>
                        Battle
                    </NavLink>
                </li>
            </ul>

        </nav>
    )
}