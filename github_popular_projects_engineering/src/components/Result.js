import React from 'react'
import { battle } from '@/utils/index.js'
import Card from './Card'
import ProfileList from './ProfileList'
import Loading from './Loading'
import {Link, useSearchParams} from 'react-router-dom'

function battleReducer(state, action) {
    if (action.type === 'fetch') {
        return {
            ...state,
            loading: true
        }
    } else if (action.type === 'success') {
        return {
            winner: action.winner,
            loser: action.loser,
            error: null,
            loading: false
        }
    } else if (action.type === 'error') {
        return {
            ...state,
            error: 'Error fetching data. Try again',
            loading: false
        }
    } else {
        throw new Error(`That action type isn't supported.`)
    }
}

function useFetch(playerOne, playerTwo) {
    const [state, dispatch] = React.useReducer(
        battleReducer,
        { winner: null, loser: null, error: null, loading: true }
    )

    React.useEffect(() => {
        dispatch({ type: 'fetch' })

        battle([playerOne, playerTwo])
            .then((players) => dispatch({ type: 'success', winner: players[0], loser: players[1] }))
            .catch((error) => {
                console.warn('Error fetching results:', error)
                dispatch({ type: 'error'})
            })

    }, [playerOne, playerTwo])

    return state
}

export default function Results({ location }) {
    console.log('location',location)
    const [searchParams]=useSearchParams();
    const playerOne = searchParams.get('playerOne');
    const playerTwo = searchParams.get('playerTwo');
    const { winner, loser, error, loading } = useFetch(playerOne, playerTwo)

    if (loading === true) {
        return <Loading text='Battling' />
    }

    if (error) {
        return (
            <p className='center-text error'>{error}</p>
        )
    }

    return (
        <>
            <div className='grid space-around container-sm'>
                <Card
                    header={winner.score === loser.score ? 'Tie' : 'Winner' }
                    subheader={`Score: ${winner.score.toLocaleString()}`}
                    avatar={winner.profile.avatar_url}
                    href={winner.profile.html_url}
                    name={winner.profile.login}
                >
                    <ProfileList profile={winner.profile} />
                </Card>
                <Card
                    header={winner.score === loser.score ? 'Tie' : 'Loser' }
                    subheader={`Score: ${loser.score.toLocaleString()}`}
                    avatar={loser.profile.avatar_url}
                    href={loser.profile.html_url}
                    name={loser.profile.login}
                >
                    <ProfileList profile={loser.profile} />
                </Card>
            </div>
            <Link
                to='/battle'
                className='btn dark-btn btn-space'>
                Reset
            </Link>
        </>
    )
}