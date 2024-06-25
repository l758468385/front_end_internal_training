import React, { lazy ,Suspense } from 'react';
import './index.css';
import Nav from './components/Nav';
import {HashRouter, Routes, Route, Navigate} from 'react-router-dom';
import Loading from './components/Loading';
const Popular = lazy(() => import('@/components/Popular'));
const Battle = lazy(() => import('@/components/Battle'));
const Results = lazy(() => import('@/components/Result'))
export default function App() {
    return (
        <HashRouter >
                <div className='container'>
                    <Nav />
                    <Suspense fallback={<Loading/>}>
                        <Routes>
                            <Route exact={false} path='/popular' element={<Popular/>}/>
                            <Route exact={false} path='/battle' element={<Battle/>}/>
                            <Route  path='/results' element={<Results/>}/>
                            <Route path='/' element={<Navigate to="popular"/>}/>
                            <Route path='*' element={<h1>404</h1>}/>
                        </Routes>
                    </Suspense>
                </div>
        </HashRouter>
    );
}
