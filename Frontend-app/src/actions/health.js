import axios from "axios";
import { get_access } from "./auth";
import { formatDate } from "../utils/dateFormater";

export const passSurvey = (context) => async dispatch => {
    await dispatch(get_access());
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    };
    context["date_of_birth"] = formatDate(context["date_of_birth"]);
    const body = JSON.stringify(context);
    if (localStorage.getItem('access'))
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`;

    try {
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/health/survey/`,
                body,
                config
            );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};

export const getDynamicInfo = (latest) => async dispatch => {
    await dispatch(get_access());
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    };
    if (localStorage.getItem('access'))
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
    try {
        let res;
        if(latest)
            res = await axios.get(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}/health/dynamic-info/latest/`,
                config
            );
        else
            res = await axios.get(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/health/dynamic-info/`,
                config
            );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};

export const getStaticInfo = () => async dispatch => {
    await dispatch(get_access());
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    };
    if (localStorage.getItem('access'))
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
    try {
        const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}/health/state-info/`,
                config
        );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};

export const changeStaticInfo = (context) => async dispatch => {
    await dispatch(get_access());
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    };
    const body = JSON.stringify(context);
    if (localStorage.getItem('access'))
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
    try {
        const res = await axios.put(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/health/state-info/`,
                body,
                config
            );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};

export const addDynamicInfo = (context) => async dispatch => {
    await dispatch(get_access());
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    };
    const body = JSON.stringify(context);
    if (localStorage.getItem('access'))
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/health/dynamic-info/`,
                body,
                config
            );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};
