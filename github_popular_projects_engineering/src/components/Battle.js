import React from 'react'
import Instructions from './Instructions'
import PlayerInput from './PlayerInput'
import PlayerPreview from './PlayerPreview'
import { Link } from 'react-router-dom'

export default function Battle() {
    const [playerOne, setPlayerOne] = React.useState(null)
    const [playerTwo, setPlayerTwo] = React.useState(null)

    return (
        <React.Fragment>
            <Instructions />

            <div className='players-container'>
                <h1 className='center-text header-lg'>Players</h1>
                <div className='row space-around'>
                    { playerOne === null
                        ? <PlayerInput
                            label='Player One'
                            onSubmit={player => setPlayerOne(player)}/>
                        : <PlayerPreview
                            username={playerOne}
                            label='Player One'
                            onReset={() => setPlayerOne(null)} />
                    }

                    { playerTwo === null
                        ? <PlayerInput
                            label='Player Two'
                            onSubmit={player => setPlayerTwo(player)}/>
                        : <PlayerPreview
                            username={playerTwo}
                            label='Player Two'
                            onReset={() => setPlayerTwo(null)} />
                    }
                </div>

                { playerOne && playerTwo && (
                    <Link
                        className='btn dark-btn btn-space'
                        to={`/results?playerOne=${playerOne}&playerTwo=${playerTwo}`}
                    >
                        Battle
                    </Link>
                )}
            </div>
        </React.Fragment>
    )
}