import React, {useEffect, useRef} from 'react';
import {Button, Carousel} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faGooglePlay} from '@fortawesome/free-brands-svg-icons';
import "../../assets/css/pages/home.css";

import carouselImg1 from "../../assets/images/home/image-carousel-1.png";
import carouselImg2 from "../../assets/images/home/image-carousel-2.png";

import SurveyModal from '../../components/survey/Survey';
import {Link} from "react-router-dom";

library.add(faGooglePlay);


const Home = ({setNav}, ref) => {
    const contentRef = useRef();
    useEffect(() => {
        setNav('transparent');
        const handleScroll = () => {
            const contentTop = contentRef.current.getBoundingClientRect().top;
            if (window.scrollY > contentTop + 500) {
                setNav('');
            } else {
                setNav('transparent');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [setNav]);

    const [modalSurveyShow, setModalSurveyShow] = React.useState(false);

    return (<>
        <Carousel data-bs-theme="dark">
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={carouselImg1}
                    alt="First slide"
                />
                <Carousel.Caption>
                    <div>
                        <h2>Traininarium</h2>
                        <p>
                            Поможет как самым опытным спортсменам, так и новичкам всегда
                            оставаться здоровым во время физических активностей
                        </p>
                        <Button className="first" onClick={() => contentRef.current.scrollIntoView({ behavior: 'smooth' })}>О нас</Button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={carouselImg2}
                    alt="Second slide"
                />
                <Carousel.Caption>
                    <div>
                        <h2>Traininarium</h2>
                        <p>
                            Также доступна для мобильных устройств на платформе Android.
                            Скачать приложение можно по кнопке ниже
                        </p>
                        <Button className="second">Скачать <FontAwesomeIcon className="ms-2" icon={faGooglePlay}/></Button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>

        <div ref={contentRef} className="about-us">
            <div className="header d-flex justify-content-center">
                <div>
                    <div className="d-flex justify-content-center">
                        <div className="pink-line"></div>
                    </div>
                    <h2>Traininarium</h2>
                </div>
            </div>
            <div className="subtext-container">
                <h1>РАССКАЖЕМ ВАМ О НАС</h1>
            </div>
            <div className="body d-flex justify-content-end">
                <div>
                    <p>
                        Наша система "Traininarium",  использующая новейшие технологии,
                        сосредоточена на помощи людям в выполнении тренировок и пресечения
                        возникновения и развития сердечных заболеваний, предлагая простой
                        и надежный способ следить за своим здоровьем, выполнять тренировки
                        и поддерживать здоровый дух. Мы стремимся помочь каждому сохранить
                        молодость тела и наслаждаться активным и здоровым образом жизни.
                    </p>
                    <h1>Возможности, которые даёт <b>Traininarium</b>:</h1>
                    <ul>
                        <li><p>Постоянный мониторинг здоровья</p></li>
                        <li><p>Ведение учёта тренировок</p></li>
                        <li><p>Постоянная безопасность физической активности</p></li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="beginning">
            <div className="header d-flex justify-content-center">
                <div>
                    <div className="d-flex justify-content-center">
                        <div className="blue-line"></div>
                    </div>
                    <h2>С ЧЕГО НАЧАТЬ</h2>
                </div>
            </div>
            <div className="subtext-container">
                <h1>ОТ НОВИЧКА К ЭКСПЕРТУ</h1>
            </div>

            <div className="body d-flex justify-content-start">
                <div className="card sport">
                    <h1>Спорт</h1>
                    <p>Начните тренироваться вместе с <span>Traininarium</span></p>
                    <Link className="link" to="/training">
                        <Button className="bth-white-inv" style={{width: '100%'}}>На тренировку</Button>
                    </Link>
                    <span>(только для зарегистрированных пользователей)</span>
                </div>
                <div className="card survey">
                    <h1>Тест</h1>
                    <p>
                        Пройдите тестирование и получите рекомендации по
                        укреплению вашего здоровья уже сейчас!
                    </p>
                    <Button className="bth-white-inv link" onClick={() => setModalSurveyShow(true)}>Пройти</Button>
                </div>
                <div className="card blog">
                    <h1>Статьи</h1>
                    <p>
                        Ознакомьтесь с полезной литературой по ведению
                        активного и здорового образа жизни
                    </p>
                    <Link className="link" to="/blog">
                        <Button className="bth-white-inv" style={{width: "100%"}}>Читать</Button>
                    </Link>
                </div>
            </div>
            <div className="footer d-flex justify-content-center">
                <div className="grey-circle"></div>
                <div className="grey-circle"></div>
                <div className="grey-circle"></div>
            </div>
        </div>

        <div className="middle-paragraph">
            <p>Узнать свою группу риска с <span>Traininarium</span></p>
        </div>

        <div className="testing">
            <div className="header d-flex justify-content-center">
                <div>
                    <div className="d-flex justify-content-center">
                        <div className="blue-line"></div>
                    </div>
                    <h2>ТЕСТИРОВАНИЕ</h2>
                </div>
            </div>
            <div className="subtext-container">
                <h1>УЗНАЙ УЖЕ СЕЙЧАС</h1>
            </div>
            <div className="body d-flex justify-content-end">
                <div>
                    <p>
                        Пройдите тестирование и получите рекомендации по
                        укреплению вашего здоровья уже сейчас!
                    </p>
                    <ul>
                        <li><p>Автоопределение группы риска</p></li>
                        <li><p>Доступное объяснение</p></li>
                        <li><p>Составление личной медицинской карты</p></li>
                        <li><p>Подбор планов тренировок</p></li>
                    </ul>
                    <Button className="bth-white-inv" onClick={() => setModalSurveyShow(true)}>Пройти</Button>
                </div>
            </div>
        </div>

        {/* ---------------- Modals ---------------- */}
        <SurveyModal
            show={modalSurveyShow}
            onHide={() => setModalSurveyShow(false)}
        />
    </>);
}
export default Home;