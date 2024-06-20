import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Home from "../pages/Home";
import Training from "../pages/Training";
import Blog from "../pages/Blog";
import Profile from "../pages/Profile";


const TraininariumApp = ({ user, setNav }) => {
    const location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition key={location.pathname} classNames="traininariumFade" timeout={300}>
                <Routes>
                    <Route path='/' element={<Home setNav={setNav}/>}/>
                    <Route path='/training' element={<Training user={user} setNav={setNav}/>}/>
                    <Route path='/blog' element={<Blog setNav={setNav} isAdmin={false}/>}/>
                    {user !== null ? (
                        <Route path='/me' element={<Profile user={user} setNav={setNav}/>}/>
                    ) : (
                        <Route path="*" element={<Navigate to="/" replace />}/>
                    )}
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    )
};

export default TraininariumApp
