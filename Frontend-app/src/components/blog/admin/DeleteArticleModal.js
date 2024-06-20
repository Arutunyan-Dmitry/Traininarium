import React, {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {connect} from "react-redux";
import '../../../assets/css/pages/blog.css';

import {deleteArticle} from "../../../actions/blog";
import ErrorAlert from "../../shared/ErrorAlert";


const DeleteArticleModal = (props) => {
    const {slug, deleteArticle, ...defaultProps} = props;

    const [onLoading, setOnLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState("");
    const handleDelete = () => {
        setOnLoading(true);
        deleteArticle(slug).then(result => {
            if (result[0]) {
                setOnLoading(false);
                defaultProps.onHide();
                window.location.reload();
            } else {
                setOnLoading(false);
                setError(Object.values(result[1].response.data)[0]);
                setShowError(true);
            }
        });
    };

    const handleOnHide = () => {
        setError("");
        defaultProps.onHide();
    };

    return (
        <>
            <Modal
                className="deleteArticleModal"
                {...defaultProps}
                aria-labelledby="contained-modal-title-vcenter"
                onHide={handleOnHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Удалить публикацию
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={showError ? ({height: '30vh'}): ({height: '20vh'})}>
                    {onLoading && (
                        <div className="article-loading">
                            <p>Страница будет перезагружена...</p>
                        </div>
                    )}
                    <div className={`errorContainer ${showError ? 'visible' : 'hidden'}`}>
                        <ErrorAlert
                            title=""
                            body={error}
                            show={showError}
                            setShow={setShowError}
                        />
                    </div>
                    <p>Вы действительно хотите удалить выбранную публикацию?</p>
                    <p>
                        Напоминаем, что возможности восстановить публикацию после
                        удаления не будет.
                    </p>
                </Modal.Body>
                <Modal.Footer className="position-relative">
                    {onLoading && (
                        <div style={{width: '97%', height: '96%'}} className="article-loading" />
                    )}
                    <Button className="bth-admin" onClick={handleDelete}>Удалить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default connect(null, {deleteArticle})(DeleteArticleModal);