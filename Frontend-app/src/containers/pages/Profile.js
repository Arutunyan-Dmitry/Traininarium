import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Button, Col, Container, Row, Stack} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faUserAstronaut, faSuitcaseMedical, faGear, faArrowRightFromBracket, faWarning} from '@fortawesome/free-solid-svg-icons';
import {
            Chart as ChartJS, ArcElement, Tooltip, Title, Legend, LineController,
            CategoryScale, LinearScale, PointElement, LineElement, Filler, BarElement
        } from "chart.js";
import '../../assets/css/pages/profile.css';

import {logout} from "../../actions/auth";
import {getDynamicInfo, getStaticInfo} from "../../actions/health";
import GeneralHealthChart from "../../components/profile/GeneralHealthChart";
import WeightChart from "../../components/profile/WeightChart";
import RiskChart from "../../components/profile/RiskChart";
import StaticInfo from "../../components/profile/StaticInfo";
import DynamicInfo from "../../components/profile/DynamicInfo";

library.add(faUserAstronaut, faSuitcaseMedical, faGear, faArrowRightFromBracket, faWarning);
ChartJS.register(ArcElement, Tooltip, Title, Legend, LineController,
        CategoryScale, LinearScale, PointElement, LineElement, Filler, BarElement);


const Profile = ({ user, setNav, logout, getDynamicInfo, getStaticInfo }) => {
    const [SI, setSI] = useState(null);
    const [DI, setDI] = useState(null);
    const [DIL, setDIL] = useState(null);

    useEffect(() => {
        setNav('');
        getDynamicInfo(false).then(result => {if(result[0]) setDI(result[1]);});
        getDynamicInfo(true).then(result => {if(result[0]) setDIL(result[1]);});
        getStaticInfo().then(result => {if(result[0]) setSI(result[1]);});
    }, []);

    const [content, setContent] = useState(1);
    const changeContent = (number) => {
        setContent(number);
    }

    const [chart, setChart] = useState(1);
    const onClickNext = e => {setChart(chart => chart + 1);}
    const onClickPrev = e => {setChart(chart => chart - 1);}

    return (<>
        <Container className="profile">
            <Row>
                <Col className="sideMenu">
                    <div className="title">
                        <span><FontAwesomeIcon icon={faUserAstronaut}/></span>
                        <p>{user.username}</p>
                    </div>
                    <Stack gap={3}>
                        <div className={`pb-3 sideMenuItem ${content === 1 ? 'active' : ''}`}>
                            <Button onClick={() => changeContent(1)}>
                                <FontAwesomeIcon style={{marginRight: '0.5rem'}} icon={faSuitcaseMedical}/>
                                Здоровье
                            </Button></div>
                        <div className={`sideMenuItem ${content === 2 ? 'active' : ''}`}>
                            <Button onClick={() => changeContent(2)}>
                                <FontAwesomeIcon style={{marginRight: '0.5rem'}} icon={faGear}/>
                                Настройки
                            </Button></div>
                        <div className="sideMenuItem">
                            <Button onClick={() => logout()}>
                                <FontAwesomeIcon style={{marginRight: '0.5rem'}} icon={faArrowRightFromBracket}/>
                                Выйти
                            </Button></div>
                    </Stack>

                </Col>
                <Col xs={9}>
                    <div className="p-container">
                        {content === 1 ? (<>
                            {SI !== null && DI !== null && DIL !== null ? (<>
                                <div className={`chartArea ${chart === 1 ? 'fade-in' : 'fade-out'}`}>
                                    {chart === 1 && (
                                        <RiskChart
                                            title={"Уровень риска"}
                                            DI={DI}
                                            onClickNext={onClickNext}
                                        />
                                    )}
                                </div>
                                <div className={`chartArea ${chart === 2 ? 'fade-in' : 'fade-out'}`}>
                                    {chart === 2 && (
                                        <GeneralHealthChart
                                            title={"Самочувствие"}
                                            DI={DI}
                                            onClickNext={onClickNext}
                                            onClickPrev={onClickPrev}
                                        />
                                    )}
                                </div>
                                <div className={`chartArea ${chart === 3 ? 'fade-in' : 'fade-out'}`}>
                                    {chart === 3 && (
                                        <WeightChart
                                            title={"Вес"}
                                            DI={DI}
                                            onClickPrev={onClickPrev}
                                        />
                                    )}
                                </div>
                                <div className="userStaticData">
                                    <StaticInfo SI={SI}/>
                                </div>
                                <div className="userDynamicData">
                                    <DynamicInfo DI={DI} DIL={DIL}/>
                                </div>
                            </>) : (<>
                                <div> Loading..... </div>
                            </>)}
                        </>) : (<>
                            <div className="profileSettings">
                                <p className="profileWarning"><FontAwesomeIcon icon={faWarning}/></p>
                                <p className="profileWarningText">
                                    На момент макетного развёртывания приложения настройка
                                    данных учётной записи пользователе недоступна
                                </p>
                            </div>
                        </>)}
                    </div>
                </Col>
            </Row>
        </Container>
    </>)
};

export default connect(null, {logout, getDynamicInfo, getStaticInfo})(Profile);