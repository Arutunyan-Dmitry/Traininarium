import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import {connect} from "react-redux";
import '../../assets/css/components/survey.css'

import PrivacyPoliticsFormContent from './PrivacyPoliticsFormContent'
import InitialFormContent from "./InitialFormContent";
import GeneralInfoFormContent from './GeneralInfoFormContent'
import PetPeevesFormContent from './PetPeevesFormContent'
import MedCardOneFormContent from './MedCardOneFormContent'
import MedCardTwoFormContent from './MedCardTwoFormContent'
import MedCardThreeFormContent from './MedCardThreeFormContent'
import FinalFormContent from './FinalFormContent'
import ResultFormContent from './ResultFormContent'
import { passSurvey } from "../../actions/health";


const SurveyModal = (props) => {
    const {user, passSurvey, onShow, ...defaultProps} = props;

    const formDataInitial = {
        date_of_birth: '',
        gender: 'Male',
        race: '',
        is_using_data_agreed: false,
        height: 0,
        is_heart_diseased: false,
        is_diabetic: false,
        is_diabetic_with_diseases: false,
        diabetic_period: 0,
        is_physical_activity: false,
        is_kidney_diseased: false,
        is_kidney_disease_chronic: false,
        is_cholesterol: false,
        is_stroked: false,
        is_blood_pressure: false,
        is_smoker: false,
        is_alcoholic: false,
        is_asthmatic: false,
        is_skin_cancer: false,
        weight: 0.0,
        physical_health: 0,
        mental_health: 0,
        is_difficult_to_walk: false,
        general_health: 'Poor',
        sleep_time: 0
    };
    const currentModalInitial = 1;
    const [currentModal, setCurrentModal] = useState(currentModalInitial);
    const [formData, setFormData] = useState(formDataInitial);
    const {
        date_of_birth, gender, race, is_using_data_agreed,
        height, is_heart_diseased, is_diabetic,
        is_diabetic_with_diseases, diabetic_period,
        is_physical_activity, is_kidney_diseased,
        is_kidney_disease_chronic, is_cholesterol, is_stroked,
        is_blood_pressure, is_smoker, is_alcoholic,
        is_asthmatic, is_skin_cancer, weight,
        physical_health, mental_health, is_difficult_to_walk,
        general_health, sleep_time
    } = formData;
    const onChange = obj => {
        setFormData(prevFormData => {
            let updatedFormData = { ...prevFormData };
            Object.keys(obj).forEach(key => {
                updatedFormData[key] = obj[key];
            });
        return updatedFormData;
        });
    };
    const helperDataInitial = {
        isPhysical: false,
        isMental: false
    };
    const [helperData, setHelperData] = useState(helperDataInitial);
    const {isPhysical, isMental} = helperData;
    const onHelper = obj => {
        setHelperData(prevHelperData => {
            let updatedHelperData = { ...prevHelperData };
            Object.keys(obj).forEach(key => {
                updatedHelperData[key] = obj[key];
            });
        return updatedHelperData;
        });
    };
     const onModalShow = () => {
        if (user !== null) {
            formData.date_of_birth = user.date_of_birth;
            formData.gender = user.gender;
            formData.race = user.race
        } else {
            setFormData(formDataInitial);
        }
        return onShow;
    };
    const onClickNext = e => {
        if(user !== null && currentModal === 1) {
            setCurrentModal(modal => modal + 2);
        } else {
            setCurrentModal(modal => modal + 1);
        }
    }
    const onClickPrev = e => {
        if(user !== null && currentModal === 3) {
            setCurrentModal(modal => modal - 2);
        } else {
            setCurrentModal(modal => modal - 1);
        }
    }
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const onSubmit = e => {
        e.preventDefault();
        passSurvey(formData).then(result => {
            if(result[0]) setResult(result[1]);
            else setError("Ошибка");
        });
        setCurrentModal(9);
    };
    const handleModalClose = () => {
        props.onHide()
        setTimeout(() => {
            setFormData(formDataInitial);
            setHelperData(helperDataInitial)
            setCurrentModal(currentModalInitial);
            setError('')
            setResult('')
        }, 500);
    };

    return (
        <Modal
            {...defaultProps}
            className="survey"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
            onShow={onModalShow}
            onHide={handleModalClose}
        >
            <Form noValidate onSubmit={e => onSubmit(e)}>
                <div className={`modal-content ${currentModal === 1 ? 'fade-in' : 'fade-out'}`}>
                    {currentModal === 1 && (
                        <PrivacyPoliticsFormContent
                            title={"Помогите нам стать лучше!"}
                            hasNext={true}
                            hasPrev={false}
                            hasSubmit={false}
                            onClickNext={onClickNext}
                            is_using_data_agreed={is_using_data_agreed}
                            onChange={onChange}
                        />
                    )}
                </div>
                <div className={`modal-content ${currentModal === 2 ? 'fade-in' : 'fade-out'}`}>
                    {currentModal === 2 && (
                        <InitialFormContent
                            title={"Давайте познакомимся"}
                            hasNext={true}
                            hasPrev={true}
                            hasSubmit={false}
                            onClickNext={onClickNext}
                            onClickPrev={onClickPrev}
                            date_of_birth={date_of_birth}
                            gender={gender}
                            race={race}
                            onChange={onChange}
                        />
                    )}
                </div>
                <div className={`modal-content ${currentModal === 3 ? 'fade-in' : 'fade-out'}`}>
                    {currentModal === 3 && (
                        <GeneralInfoFormContent
                            title={"Начнём с ваших данных"}
                            hasNext={true}
                            hasPrev={true}
                            hasSubmit={false}
                            onClickNext={onClickNext}
                            onClickPrev={onClickPrev}
                            height={height}
                            weight={weight}
                            sleep_time={sleep_time}
                            onChange={onChange}
                        />
                    )}
                </div>
                <div className={`modal-content ${currentModal === 4 ? 'fade-in' : 'fade-out'}`}>
                    {currentModal === 4 && (
                        <PetPeevesFormContent
                            title={"Расскажите о ваших привычках"}
                            hasNext={true}
                            hasPrev={true}
                            hasSubmit={false}
                            onClickPrev={onClickPrev}
                            onClickNext={onClickNext}
                            is_alcoholic={is_alcoholic}
                            is_smoker={is_smoker}
                            is_physical_activity={is_physical_activity}
                            onChange={onChange}
                        />
                    )}
                </div>
                <div className={`modal-content ${currentModal === 5 ? 'fade-in' : 'fade-out'}`}>
                    {currentModal === 5 && (
                        <MedCardOneFormContent
                            title={"Начнём заполнять вашу медицинскую карту"}
                            hasNext={true}
                            hasPrev={true}
                            hasSubmit={false}
                            onClickPrev={onClickPrev}
                            onClickNext={onClickNext}
                            is_heart_diseased={is_heart_diseased}
                            is_stroked={is_stroked}
                            is_diabetic={is_diabetic}
                            is_diabetic_with_diseases={is_diabetic_with_diseases}
                            diabetic_period={diabetic_period}
                            onChange={onChange}
                        />
                    )}
                </div>
                <div className={`modal-content ${currentModal === 6 ? 'fade-in' : 'fade-out'}`}>
                    {currentModal === 6 && (
                        <MedCardTwoFormContent
                            title={"Продолжим заполнять вашу медицинскую карту"}
                            hasNext={true}
                            hasPrev={true}
                            hasSubmit={false}
                            onClickPrev={onClickPrev}
                            onClickNext={onClickNext}
                            is_kidney_diseased={is_kidney_diseased}
                            is_kidney_disease_chronic={is_kidney_disease_chronic}
                            is_cholesterol={is_cholesterol}
                            onChange={onChange}
                        />
                    )}
                </div>
                <div className={`modal-content ${currentModal === 7 ? 'fade-in' : 'fade-out'}`}>
                    {currentModal === 7 && (
                        <MedCardThreeFormContent
                            title={"Заканчиваем заполнять вашу медицинскую карту"}
                            hasNext={true}
                            hasPrev={true}
                            hasSubmit={false}
                            onClickPrev={onClickPrev}
                            onClickNext={onClickNext}
                            is_blood_pressure={is_blood_pressure}
                            is_asthmatic={is_asthmatic}
                            is_skin_cancer={is_skin_cancer}
                            is_difficult_to_walk={is_difficult_to_walk}
                            onChange={onChange}
                        />
                    )}
                </div>
                <div className={`modal-content ${currentModal === 8 ? 'fade-in' : 'fade-out'}`}>
                    {currentModal === 8 && (
                        <FinalFormContent
                            title={"Финальный шаг"}
                            hasNext={false}
                            hasPrev={true}
                            hasSubmit={true}
                            onClickPrev={onClickPrev}
                            physical_health={physical_health}
                            mental_health={mental_health}
                            general_health={general_health}
                            onChange={onChange}
                            isPhysical={isPhysical}
                            isMental={isMental}
                            onHelper={onHelper}
                        />
                    )}
                </div>
                <div className={`modal-content ${currentModal === 9 ? 'fade-in' : 'fade-out'}`}>
                    {currentModal === 9 && (
                        <ResultFormContent error={error} result={result} />
                    )}
                </div>
            </Form>
        </Modal>
    );
};

const mapStateProps = state => ({
    user: state.auth.user,
});

export default connect(mapStateProps, { passSurvey })(SurveyModal);