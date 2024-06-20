import React, {useState} from "react";
import {Button, Form, InputGroup, Modal, Spinner} from "react-bootstrap";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUpFromBracket, faTrash} from "@fortawesome/free-solid-svg-icons";
import '../../../assets/css/pages/blog.css';

import {createOrUpdateArticle, getArticle} from "../../../actions/blog";
import ErrorAlert from "../../shared/ErrorAlert";


const CreateUpdateArticleModal = (props) => {
    const {slug, getArticle, createOrUpdateArticle, ...defaultProps} = props;
    const [formArticle, setFormArticle] = useState({
        title: null,
        picture: null,
        body: null
    });
    const handleSHow = () => {
        if (slug !== "") {
            getArticle(slug).then(result => {
                if (result[0]) setFormArticle({
                    title: result[1].title,
                    picture: result[1].picture,
                    body: result[1].body
                });
            });
        }
    };

    const handleChange = obj => {
        setFormArticle(prevFormData => {
            let updatedFormData = {...prevFormData};
            Object.keys(obj).forEach(key => {
                updatedFormData[key] = obj[key];
            });
            return updatedFormData;
        });
    };

    const [validT, setValidT] = useState(true);
    const [validB, setValidB] = useState(true);
    const isValid = () => {
        let _validT, _validB;
        if (formArticle.title === null || formArticle.title === "") {
            setValidT(false);
            _validT = false;
        } else {
            setValidT(true);
            _validT = true;
        }
        if (formArticle.body === null || formArticle.body === "") {
            setValidB(false);
            _validB = false;
        } else {
            setValidB(true);
            _validB = true;
        }
        return _validT && _validB;
    }
    const [onLoading, setOnLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState("");
    const handleSubmit = () => {
        if (isValid()) {
            setOnLoading(true);
            let data;
            if (typeof (formArticle.picture) === "string") data = {title: formArticle.title, body: formArticle.body};
            else data = formArticle;
            createOrUpdateArticle(slug, data).then(result => {
                if (result[0]) {
                    setOnLoading(false);
                    defaultProps.onHide();
                    window.location.reload();
                }
                else {
                    setOnLoading(false);
                    setError(Object.values(result[1].response.data)[0]);
                    setShowError(true);
                }
            });
        }
    };

    const handleOnHide = () => {
        setFormArticle({
            title: null,
            picture: null,
            body: null
        });
        setError("");
        defaultProps.onHide();
    };

    return (
        <>
            <Modal
                className="createUpdateArticleModal"
                {...defaultProps}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onShow={handleSHow}
                onHide={handleOnHide}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {slug !== "" ? ('Редактировать статью') : ('Добавить статью')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={showError ? ({height: '130vh'}): ({height: '120vh'})} className="article-control">
                    {onLoading && (
                        <div className="article-loading">
                            <p>Данные сохраняются...</p>
                            <Spinner />
                            <p>Страница будет перезагружена</p>
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
                    <Form noValidate>
                        <InputGroup hasValidation className="d-block">
                            <Form.Group className="mb-3" controlId="formArticleTitle">
                                <Form.Control
                                    type="text"
                                    className="article-title-input"
                                    name="title"
                                    placeholder="Заголовок статьи..."
                                    value={formArticle.title}
                                    onChange={e => handleChange({[e.target.name]: e.target.value})}
                                    isInvalid={!validT}
                                />
                            </Form.Group>
                        </InputGroup>
                        <Form.Group controlId="formArticlePicture">
                            <Form.Label className="picture-input mb-2">
                                {formArticle.picture === null ? (
                                    <FontAwesomeIcon icon={faArrowUpFromBracket}/>) : ('Загружено')}
                            </Form.Label>
                            <Form.Control
                                style={{display: "none"}}
                                type="file"
                                accept=".jpg, .png"
                                name="picture"
                                onChange={e => {
                                    if (e.target.files.length > 0) handleChange({[e.target.name]: e.target.files[0]});
                                    else handleChange({[e.target.name]: null});
                                }}
                            />
                        </Form.Group>
                        {formArticle.picture !== null ? (
                            <div className="picture-show"
                                 style={{
                                     backgroundImage: `${typeof (formArticle.picture) === "string" ?
                                         (`url(${formArticle.picture})`) : (`url(${URL.createObjectURL(formArticle.picture)})`)}`
                                 }}>
                                <Button
                                    variant="danger"
                                    style={{fontSize: "0.7rem"}}
                                    onClick={() => handleChange({"picture": null})}
                                ><FontAwesomeIcon icon={faTrash}/></Button>
                            </div>
                        ) : (
                            <div className="picture-blank">
                                <p>Нет изображения</p>
                            </div>
                        )}
                        <InputGroup hasValidation className="d-block">
                            <Form.Group className="mt-3 mb-3" controlId="formArticleBody">
                                <Form.Control
                                    style={{maxHeight: '310px', resize: 'vertical', fontWeight: '550'}}
                                    as="textarea"
                                    rows={15}
                                    aria-valuemax={5}
                                    name="body"
                                    placeholder="Введите текст статьи..."
                                    value={formArticle.body}
                                    onChange={e => handleChange({[e.target.name]: e.target.value})}
                                    isInvalid={!validB}
                                />
                            </Form.Group>
                        </InputGroup>
                        <Button
                            className="bth-admin"
                            onClick={handleSubmit}
                        >
                            {slug !== "" ? ('Сохранить изменения') : ('Опубликовать статью')}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default connect(null, {getArticle, createOrUpdateArticle})(CreateUpdateArticleModal);