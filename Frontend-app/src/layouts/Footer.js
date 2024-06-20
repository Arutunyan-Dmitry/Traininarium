import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faVk, faTelegram, faGooglePlay, faYandex, faPython, faReact} from '@fortawesome/free-brands-svg-icons';
import {faMobile, faAt} from '@fortawesome/free-solid-svg-icons';
import '../assets/css/footer.css';

library.add(faVk, faTelegram, faGooglePlay, faYandex, faPython, faReact, faMobile, faAt);

const Footer = React.forwardRef((props, ref) => {
    return (<>
        <div className="footer" ref={ref}>
            <div className="d-flex">
                <div className="grey-line"/>
                <p
                    className="title"
                    style={props.user !== null ? (props.user.is_admin ? ({color: 'var(--admin-red-color)'}) : ({color: 'var(--dark-blue-color)'})) : ({color: 'var(--dark-blue-color)'})}
                >
                    Traininarium
                </p>
                <div className="grey-line"/>
            </div>
            <div className="body">
                <p>Traininarium</p>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <p className="head">Для здоровых и спортивных</p>
                            <p>Опрос</p>
                            <p>Трекер</p>
                            <p>Мед. карта</p>
                            <p>Статистика</p>
                        </div>
                        <div className="col">
                            <p className="head">Тренировки</p>
                            <p>Рекомендации</p>
                            <p>Планы</p>
                            <p>Упражнения</p>
                        </div>
                        <div className="col">
                            <p className="head">Сообщество</p>
                            <p>Блог</p>
                            <p>Журналы</p>
                            <p>Статьи</p>
                            <p>Ссылки</p>
                        </div>
                        <div className="col">
                            <p className="head">Социальные сети</p>
                            <p><FontAwesomeIcon icon={faVk}/> Вконтакте</p>
                            <p><FontAwesomeIcon icon={faTelegram}/> Telegram</p>
                            <p><FontAwesomeIcon icon={faYandex}/> Яндекс Дзен</p>
                            <p><FontAwesomeIcon icon={faGooglePlay}/> Google Play</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="d-flex">
                    <p style={{marginRight: "1rem"}}><FontAwesomeIcon icon={faPython}/> Python</p>
                    <p style={{marginRight: "1rem"}}><FontAwesomeIcon icon={faReact}/> React</p>
                    <p style={{marginRight: "1rem"}}><FontAwesomeIcon icon={faMobile}/> Flutter</p>
                </div>
                <div>
                    <p>2024, УлГТУ, Программная инженерия 09.03.04</p>
                </div>
                <div>
                    <p><FontAwesomeIcon icon={faAt}/> Арутюнян Д. А; Кочкарева Е. И.</p>
                </div>
            </div>
        </div>
    </>);
});

export default Footer