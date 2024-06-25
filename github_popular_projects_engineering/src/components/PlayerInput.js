import React from 'react'
import PropTypes from 'prop-types'
const theme = 'light'

export default function PlayerInput({ label, onSubmit }) {
    const [username, setUsername] = React.useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        onSubmit(username)
    }

    const handleChange = (event) => {
        setUsername(event.target.value)
    }

    return (
        <form className='column player' onSubmit={handleSubmit}>
            <label htmlFor='username' className='player-label'>
                {label}
            </label>
            <div className='row player-inputs'>
                <input
                    type='text'
                    className={`input-${theme}`}
                    placeholder='github username'
                    autoComplete='off'
                    value={username}
                    onChange={handleChange}
                />
                <button
                    className={`btn ${theme === 'light' ? 'dark-btn' : 'light-btn'}`}
                    type='submit'
                    disabled={!username}
                >
                    Submit
                </button>
            </div>
        </form>
    )
}

PlayerInput.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
}