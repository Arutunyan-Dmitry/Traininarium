import React, {useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faDumbbell,
    faWeightScale,
    faHeartPulse,
    faFaceLaughWink,
    faMoon,
    faShieldVirus,
    faBolt,
    faPlus
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/pages/training.css';

import {getPlans} from "../../actions/fitness";
import {Button} from "react-bootstrap";
import PlanConstructorModal from "../../components/training/PlanConstructorModal";
import PlanModal from "../../components/training/PlanModal";

library.add(faDumbbell, faWeightScale, faHeartPulse, faFaceLaughWink, faMoon, faShieldVirus, faBolt, faPlus);

export const bolt = (intensity) => {
    let count;
    switch (intensity) {
        case 'Low':
            count = 1;
            break;
        case 'Medium':
            count = 2;
            break;
        case 'High':
            count = 3;
            break;
    }
    return (<>
        {[...Array(count)].map((_, index) => (
            <FontAwesomeIcon icon={faBolt} key={index}/>
        ))}
    </>)
};
const risk = (hg) => {
    switch (hg) {
        case 1:
            return 'низкой';
        case 2:
            return 'средней';
        case 3:
            return 'высокой';
    }
};
const PlanCard = ({plan, index, my = false, follow = false, setShow, setData}) => {


    return (
        <div key={index}>
            <div className="corner-number"><h1>{index + 1}</h1></div>
            <div className="corner-bottom-right"></div>
            <div className="corner-bottom-left"></div>
            <div className="corner-top-right"></div>
            <div className="background" style={{backgroundImage: `url(${plan.picture})`}}>
                <Button
                    className="plan-button"
                    onClick={() => {
                        setShow(true);
                        if (my && follow) setData({my: true, follow: true, ...plan});
                        else {
                            if (my) setData({my: true, follow: false, ...plan});
                            if (follow) setData({my: false, follow: true, ...plan});
                            if (!my && !follow) setData({my: false, follow: false, ...plan});
                        }
                    }}
                >
                    <div className="content">
                        <h1>{plan.name}</h1>
                        <div className="container">
                            <div>
                                <p>Интенсивность: {bolt(plan.intensity)}</p>
                                <p>Для <b>{risk(plan.health_group)}</b> группы риска</p>
                                <p>Количество тренировок: <b>{plan.training_amount}</b></p>
                                <p>Инвентарь: <b>{plan.equipment === "" ? ('Не требуется') : (plan.equipment)}</b></p>

                            </div>
                        </div>
                    </div>
                </Button>
            </div>
        </div>
    )
};

const Training = ({setNav, user, getPlans}) => {
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

    const [plans, setPlans] = useState(null);
    useEffect(() => {
        getPlans().then(result => {
            if (result[0]) setPlans(result[1]);
        });
    }, [])

    const [modalConstructorShow, setModalConstructorShow] = useState(false);
    const [modalPlanShow, setModalPlanShow] = useState(false);
    const [modalPlanData, setModalPlanData] = useState(null);

    return (<>
        <div className="training-header-image">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>Training</h1>
                        <p>
                            Мы стремимся создать эффективные и безопасные тренировочные программы,
                            которые помогут вам достичь желаемых результатов, улучшить физическую форму
                            и повысить общее самочувствие.
                        </p>
                    </div>
                    <div className="col"></div>
                </div>
            </div>
        </div>
        <div className="training">
            <div className="d-flex justify-content-center">
                <div className="pink-line"></div>
            </div>
            <h1 ref={contentRef}>ЧЕМ ПОЛЕЗНА РЕГУЛЯРНАЯ ФИЗИЧЕСКАЯ АКТИВНОСТЬ?</h1>
            <div className="header">
                <div className="container">
                    <div className="row">
                        <div className="col adv">
                            <h2><FontAwesomeIcon icon={faDumbbell}/></h2>
                            <div><h3>Улучшение физической формы</h3></div>
                        </div>
                        <div className="col adv">
                            <h2><FontAwesomeIcon icon={faWeightScale}/></h2>
                            <div><h3>Поддержание здорового веса</h3></div>
                        </div>
                        <div className="col adv">
                            <h2><FontAwesomeIcon icon={faHeartPulse}/></h2>
                            <div><h3>Укрепление сердечно-сосудистой системы</h3></div>
                        </div>
                        <div className="col adv">
                            <h2><FontAwesomeIcon icon={faFaceLaughWink}/></h2>
                            <div><h3>Повышение настроения и снижение стресса</h3></div>
                        </div>
                        <div className="col adv">
                            <h2><FontAwesomeIcon icon={faMoon}/></h2>
                            <div><h3>Улучшение сна</h3></div>
                        </div>
                        <div className="col adv">
                            <h2><FontAwesomeIcon icon={faShieldVirus}/></h2>
                            <div><h3>Улучшение общего здоровья</h3></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="blue-line"></div>
            </div>
            <h1>ПЛАНЫ ТРЕНИРОВОК</h1>
            <div className="plans">
                {<>
                    {user !== null && (<>
                        <p>Конструктор планов тренировок</p>
                        <Button onClick={() => setModalConstructorShow(true)}>
                            <p>Создать собственный план тренировок</p>
                            <span><FontAwesomeIcon icon={faPlus}/></span>
                        </Button>
                    </>)}
                    {plans !== null ? (<>
                        {user !== null && (<>
                            {plans.following.length > 0 && (<>
                                <p>Вы отслеживаете</p>
                                <div className="following-plans">
                                    {plans.following.map((plan, index) => (
                                        <PlanCard
                                            key={index}
                                            plan={plan}
                                            index={index}
                                            follow={true}
                                            setShow={setModalPlanShow}
                                            setData={setModalPlanData}
                                        />
                                    ))}
                                </div>
                            </>)}
                            {plans.recommended.length > 0 && (<>
                                <p>Рекомендуемые планы</p>
                                <div className="recommended-plans">
                                    {plans.recommended.map((plan, index) => (
                                        <PlanCard
                                            key={index}
                                            plan={plan}
                                            index={index}
                                            setShow={setModalPlanShow}
                                            setData={setModalPlanData}
                                        />
                                    ))}
                                </div>
                            </>)}
                            {plans.my.length > 0 && (<>
                                <p>Ваши планы тренировок</p>
                                <div className="my-plans">
                                    {plans.my.map((plan, index) => (
                                        <PlanCard
                                            key={index}
                                            plan={plan}
                                            index={index}
                                            my={true}
                                            setShow={setModalPlanShow}
                                            setData={setModalPlanData}
                                        />
                                    ))}
                                </div>
                            </>)}
                        </>)}
                        {plans.other.length > 0 && (<>
                            <p>{user !== null ? ('Другие планы тренировок') : ('Все планы тренировок')}</p>
                            <div className="all-plans">
                                {plans.other.map((plan, index) => (
                                    <PlanCard
                                        key={index}
                                        plan={plan}
                                        index={index}
                                        setShow={setModalPlanShow}
                                        setData={setModalPlanData}
                                    />
                                ))}
                            </div>
                        </>)}
                    </>) : (<>Loading....</>)}
                </>}
            </div>
        </div>

        {/* ----- Modals ----- */}
        <PlanConstructorModal
            show={modalConstructorShow}
            onHide={() => setModalConstructorShow(false)}
        />
        <PlanModal
            show={modalPlanShow}
            data={modalPlanData}
            onHide={() => setModalPlanShow(false)}
        />
    </>)
};

export default connect(null, {getPlans})(Training);