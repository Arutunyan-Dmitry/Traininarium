import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Button, Form} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faHouse, faEnvelope, faUserGroup, faPeopleGroup, faUserAstronaut, faGear, faPlus,
    faPenToSquare, faTrash
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/pages/blog.css';

import {getArticles} from "../../actions/blog";
import ArticleModal from "../../components/blog/ArticleModal";
import CreateUpdateArticleModal from "../../components/blog/admin/CreateUpdateArticleModal";
import DeleteArticleModal from "../../components/blog/admin/DeleteArticleModal";

library.add(faHouse, faEnvelope, faUserGroup, faPeopleGroup, faUserAstronaut, faGear,
    faPlus, faPenToSquare, faTrash);

function truncateString(str, num) {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
}


const Blog = ({isAdmin, setNav, getArticles}) => {
    useEffect(() => {
        if (!isAdmin) setNav('');
    }, [setNav]);

    const [articles, setArticles] = useState(null);
    useEffect(() => {
        getArticles().then(result => {
            if (result[0]) {
                setArticles(result[1]);
                setF_articles(result[1]);
            } else console.log(result[1]);
        })
    }, []);

    const [sort, setSort] = useState(true);
    const [search, setSearch] = useState("");
    const [f_articles, setF_articles] = useState(articles);
    useEffect(() => {
        if (f_articles !== null) {
            const filtered = articles.filter(article => article.title.toLowerCase().includes(search.toLowerCase()));
            if (sort !== null) {
                if (sort) setF_articles(filtered);
                else setF_articles(filtered.slice().sort((a, b) => a.title.localeCompare(b.title)));
            } else setF_articles(filtered.reverse());
        }
    }, [sort, search]);

    const [showReadModal, setShowReadModal] = useState(false);
    const [showCreateUpdateModal, setShowCreateUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [slug, setSlug] = useState("");

    return (<>
        <div className="container">
            <h1 className="blog-header"></h1>
            <div className="blog-articles-form">
                <div className="search">
                    <Form.Control
                        type="text"
                        placeholder="Поиск..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className={`filter ${isAdmin ? ('admin') : ('')}`}>
                    <div>
                        <Form.Check
                            type="radio"
                            className="me-3 mt-2"
                            label="Сначала новые"
                            checked={sort !== null && sort}
                            onChange={e => setSort(e.target.checked)}
                        />
                        <Form.Check
                            type="radio"
                            className="me-3 mt-2"
                            label="В алфавитном порядке"
                            checked={sort !== null && !sort}
                            onChange={e => setSort(!e.target.checked)}
                        />
                        <Form.Check
                            type="radio"
                            className="me-3 mt-2"
                            label="Актуальные"
                            checked={sort === null}
                            onChange={() => setSort(null)}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    {isAdmin ? (
                        <Button
                            className="bth-admin"
                            style={{width: '20vw'}}
                            onClick={() => {
                                setSlug("");
                                setShowCreateUpdateModal(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus}/> Добавить статью
                        </Button>
                    ) : (
                        <div className="blog-menu">
                            <p className="mb-4">Скоро будет доступно</p>
                            <Button className="mb-2 mt-2" variant="link" disabled><FontAwesomeIcon
                                icon={faHouse}/> Посты</Button>
                            <Button className="mb-2" variant="link" disabled><FontAwesomeIcon
                                icon={faEnvelope}/> Мессенджер</Button>
                            <Button className="mb-2" variant="link" disabled><FontAwesomeIcon
                                icon={faUserGroup}/> Друзья</Button>
                            <Button variant="link" disabled><FontAwesomeIcon icon={faPeopleGroup}/> Сообщества</Button>
                            <Button className="division mb-2" variant="link" disabled><FontAwesomeIcon
                                icon={faUserAstronaut}/> Мой блог</Button>
                            <Button className="mb-5" variant="link" disabled><FontAwesomeIcon icon={faGear}/> Настройки</Button>
                        </div>
                    )}
                </div>
                <div className="col-1 blog-body">
                    {f_articles !== null && (
                        f_articles.map((value, index) => (
                            <div key={index} className="blog-content-item">
                                <h1>{value.title}</h1>
                                <img src={value.picture} alt=""/>
                                <div>
                                    {truncateString(value.body, 250).split('\n').map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))}
                                </div>
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        setSlug(value.slug);
                                        setShowReadModal(true);
                                    }}
                                >
                                    Читать далее
                                </Button>
                                {isAdmin && (<>
                                    <Button
                                        style={{marginLeft: '17vw', marginTop: '1rem'}}
                                        className="bth-admin"
                                        onClick={() => {
                                            setSlug(value.slug);
                                            setShowCreateUpdateModal(true);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare}/> Редактировать
                                    </Button>
                                    <Button
                                        style={{marginLeft: '1rem', marginTop: '1rem'}}
                                        className="bth-admin"
                                        onClick={() => {
                                            setSlug(value.slug);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash}/> Удалить
                                    </Button>
                                </>)}
                            </div>
                        ))
                    )}
                </div>
                <div className="blog-pagination">
                    <Button variant="link" disabled>Назад</Button>
                    <Button variant="link">1</Button>
                    <Button variant="link" disabled>2</Button>
                    <Button variant="link" disabled>3</Button>
                    <Button variant="link" disabled>...</Button>
                    <Button variant="link" disabled>5</Button>
                    <Button variant="link" disabled>Далее</Button>
                </div>
            </div>
        </div>

        <ArticleModal
            slug={slug}
            show={showReadModal}
            onHide={() => setShowReadModal(false)}
        />
        <CreateUpdateArticleModal
            slug={slug}
            show={showCreateUpdateModal}
            onHide={() => setShowCreateUpdateModal(false)}
        />
        <DeleteArticleModal
           slug={slug}
           show={showDeleteModal}
           onHide={() => setShowDeleteModal(false)}
        />
    </>)
};

export default connect(null, {getArticles})(Blog);