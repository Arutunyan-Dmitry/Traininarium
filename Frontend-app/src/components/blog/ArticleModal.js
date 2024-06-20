import React, {useState} from "react";
import {Modal} from "react-bootstrap";
import {connect} from "react-redux";
import '../../assets/css/pages/blog.css';

import {getArticle} from "../../actions/blog";


const ArticleModal = (props) => {
    const {slug, getArticle, ...defaultProps} = props;
    const [article, setArticle] = useState(null);
    const handleSHow = () => {
        getArticle(slug).then(result => {
            if (result[0]) setArticle(result[1]);
        })
    };

    const handleOnHide = () => {
        setArticle(null);
        defaultProps.onHide();
    };

    return (
        <>
            <Modal
                className="articleModal"
                {...defaultProps}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onShow={handleSHow}
                onHide={handleOnHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {article !== null ? (article.title) : ('Подождите...')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="blog-content-item">
                    {article !== null && (<>
                        <img src={article.picture} alt=""/>
                        <div>
                            {article.body.split('\n').map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                    </>)}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default connect(null, {getArticle})(ArticleModal);