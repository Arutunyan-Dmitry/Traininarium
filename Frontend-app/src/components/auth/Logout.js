import React, {useState} from 'react'
import {connect} from "react-redux";
import {Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from '@fortawesome/fontawesome-svg-core';
import {faDoorClosed, faDoorOpen} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/components/auth.css';
import '../../assets/css/components/shared.css';

import {logout} from "../../actions/auth";
import SuccessToast from "../shared/SuccessToast";

library.add(faDoorClosed, faDoorOpen);


const LogoutModal = ( props ) => {
    const { logout, onShow, isAdmin, ...defaultProps } = props;
    const [doorOpened, setDoorOpened] = useState(false);


    const [showSuccess, setShowSuccess] = useState(false);
    const onShowModal = () => {
        setShowSuccess(false);
        return onShow;
    };
    const onSubmit = () => {
        logout();
        setDoorOpened(false);
        props.onHide();
        setShowSuccess(true);
    };

    return (<>
        <Modal
            className="logoutModal"
            {...defaultProps}
            onShow={onShowModal}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h1
                        style={{textDecorationColor: isAdmin ? ('var(--admin-red-color)') : ('var(--dark-blue-color)')}}
                    >
                        Выход
                    </h1>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h2
                    style={{color: isAdmin ? ('var(--admin-red-color)') : ('var(--dark-blue-color)')}}
                >
                    {doorOpened ? (<FontAwesomeIcon icon={faDoorOpen}/>) : (<FontAwesomeIcon icon={faDoorClosed}/>)}
                </h2>
                <p>Вы уверены, что хотите выйти из своей учётной записи?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className={`${isAdmin ? 'yes-admin' : 'yes'}`}
                    onClick={onSubmit}
                    onMouseEnter={() => setDoorOpened(true)}
                    onMouseLeave={() => setDoorOpened(false)}
                >
                    Выйти
                </Button>
            </Modal.Footer>
        </Modal>
        {showSuccess && (
            <SuccessToast title="Авторизация" body="Выполнен выход из системы" />
        )}
    </>)
};

const mapStateProps = state => ({
    isAdmin: state.auth.isAdmin
});

export default connect(mapStateProps, {logout})(LogoutModal)