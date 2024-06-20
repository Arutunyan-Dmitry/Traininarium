import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Button, Navbar, Container, Nav} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faUserAstronaut, faUserTie} from '@fortawesome/free-solid-svg-icons';
import '../assets/css/navbar.css';

import LoginModal from "../components/auth/Login";
import LogoutModal from "../components/auth/Logout";
import RegisterModal from "../components/auth/Register";

library.add(faUserAstronaut, faUserTie);

const MenuNavbar = ({className, user}) => {
    const [modalLoginShow, setModalLoginShow] = useState(false);
    const [modalLogoutShow, setModalLogoutShow] = useState(false);
    const [modalRegisterShow, setModalRegisterShow] = useState(false);
    const location = useLocation();

    return (<>
        <Navbar expand="lg" className={`bg-body-tertiary ${className}`}>
            <Container>
                {user === null || !user.is_admin ? (
                    <Navbar.Brand as={Link} to="/">Traininarium</Navbar.Brand>
                ) : (
                    <Navbar.Brand as={Link} to="/">Traininarium <b>Admin</b></Navbar.Brand>
                )}
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link className={`${location.pathname === '/' ? 'active' : ''}`} as={Link} to="/">
                            <div><span>Главная</span>
                                <div className="underline"></div>
                            </div>
                        </Nav.Link>
                        {user === null || !user.is_admin ? (<>
                            <Nav.Link className={`${location.pathname === '/training' ? 'active' : ''}`} as={Link}
                                      to="/training">
                                <div><span>Тренировки</span>
                                    <div className="underline"></div>
                                </div>
                            </Nav.Link>
                            <Nav.Link className={`${location.pathname === '/blog' ? 'active' : ''}`} as={Link}
                                      to="/blog">
                                <div><span>Сообщество</span>
                                    <div className="underline"></div>
                                </div>
                            </Nav.Link>
                        </>) : (<>
                            <Nav.Link className={`${location.pathname === '/admin-blog' ? 'active' : ''}`} as={Link}
                                      to="/admin-blog">
                                <div><span>Сообщество</span>
                                    <div className="underline"></div>
                                </div>
                            </Nav.Link>
                        </>)}
                    </Nav>
                    <Navbar.Text>
                        {user !== null ? (<>
                            <div className="d-flex">
                                {!user.is_admin ? (
                                    <Link to='/me' className="username">
                                        <FontAwesomeIcon style={{marginRight: '0.5rem'}}
                                                     icon={faUserAstronaut}/>{user.username}
                                    </Link>
                                ) : (
                                    <Link to='#' className="username">
                                        <FontAwesomeIcon style={{marginRight: '0.5rem'}}
                                                     icon={faUserTie}/>{user.username}
                                    </Link>
                                )}

                                <Button variant="danger" className="logout" onClick={() => {
                                    setModalLogoutShow(true)
                                }}>Выйти</Button>
                            </div>
                        </>) : (<>
                            <Button variant="secondary" className="register"
                                    onClick={() => setModalRegisterShow(true)}>Регистрация</Button>
                            <Button variant="primary" className="signin"
                                    onClick={() => setModalLoginShow(true)}>Войти</Button>
                        </>)}
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>

        <LoginModal
            show={modalLoginShow}
            onHide={() => setModalLoginShow(false)}
        />
        <LogoutModal
            show={modalLogoutShow}
            onHide={() => setModalLogoutShow(false)}
        />
        <RegisterModal
            show={modalRegisterShow}
            onHide={() => setModalRegisterShow(false)}
        />
    </>);
};

export default MenuNavbar