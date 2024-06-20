import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";

import { loadUser } from "../../actions/auth";
import AdminApp from "./AdminApp";
import TraininariumApp from "./TraininariumApp";
import MenuNavbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import UpperPage from "../../layouts/UpperPage";


const Main = ({ isAuthenticated, isAdmin, loadUser, user }) => {
    const [isAppStarted, setAppStarted] = useState(false);
    const [isAppPrepared, setAppPrepared] = useState(false);
    useEffect(() => {
        if (isAuthenticated === null && !isAppPrepared) {
                loadUser().then(() => {
                    setAppPrepared(true);
                    setTimeout(() => {
                        setAppStarted(true);
                    }, 1000);
                });
            }
    }, [isAuthenticated, loadUser, isAppStarted, isAppPrepared]);
    const [ navClass, setNavClass ] = useState('');
    const footerRef = useRef(null);
    return (<>
        <div className={`startAppLogo ${isAppStarted ? '' : 'show' }`}><p>Traininarium</p></div>
        {isAppPrepared && (
            <div className={`app ${isAppStarted ? 'show' : '' }`}>
                <Router>
                    <MenuNavbar className={navClass} user={user}/>
                    {isAuthenticated !== null && isAdmin ? (
                        <AdminApp user={user} setNav={setNavClass}/>
                    ) : (
                        <TraininariumApp user={user} setNav={setNavClass}/>
                    )}
                    <Footer ref={footerRef} user={user} />
                    <UpperPage fr={footerRef} />
                </Router>
            </div>
        )}
    </>);
};

const mapStateProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isAdmin: state.auth.isAdmin,
    user: state.auth.user
});

export default connect(mapStateProps, { loadUser })(Main);