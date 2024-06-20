import axios from "axios";
import {
    LOGIN_SUCCESS, LOGIN_FAILED, USER_LOADED_SUCCESS, USER_LOADED_FAILED,
    GET_ACCESS_SUCCESS, GET_ACCESS_FAILED, LOGOUT, REGISTRATION_SUCCESS, ACTIVATED
} from './types'
import {formatDate} from "../utils/dateFormater";

export const get_access = () => async dispatch => {
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    };
    if (localStorage.getItem('refresh')) {
        const body = JSON.stringify({ refresh: localStorage.getItem('refresh')});
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}/auth/jwt/refresh/`,
                body,
                config
            );
            if (res.data.code !== 'token_not_valid') {
                dispatch({type: GET_ACCESS_SUCCESS, payload: res.data});
            } else {
                dispatch({type: GET_ACCESS_FAILED});
            }
        } catch (err) {
            dispatch({type: GET_ACCESS_FAILED});
        }
    }

};

export const loadUser = () => async dispatch => {
    await dispatch(get_access());

    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}/auth/users/me/`,
                config
            );
            dispatch({type: USER_LOADED_SUCCESS, payload: res.data});
        } catch (err) {
            dispatch({type: USER_LOADED_FAILED});
        }
    } else {
        dispatch({type: USER_LOADED_FAILED});
    }
};


export const login = (username, password) => async dispatch => {
    const config = {
        headers: {'Content-type': 'application/json'}
    };
    const body = JSON.stringify({username, password});
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/auth/jwt/create/`,
            body,
            config
        );
        dispatch({type: LOGIN_SUCCESS, payload: res.data});
        dispatch(loadUser());
        return [true, null];
    } catch (err) {
        dispatch({type: LOGIN_FAILED});
        return [false, err];
    }
};

export const logout = () => dispatch => {
    dispatch({type: LOGOUT});
};

export const register = (raw_data) => async dispatch => {
    const data = {...raw_data}
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    };
    data["date_of_birth"] = formatDate(data["date_of_birth"]);
    const body = JSON.stringify(data);
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/auth/users/`,
            body,
            config
        );
        dispatch({ type: REGISTRATION_SUCCESS, payload: res.data });
        return([true, null]);
    } catch (err) {
        return [false, err];
    }
};

export const activate = (uid, code) => async dispatch => {
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    };
    const body = JSON.stringify({uid, code});
    try {
        await axios.post(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/auth/users/activation/`,
            body,
            config
        );
        dispatch({ type: ACTIVATED});
        return([true, null]);
    } catch (err) {
        return [false, err];
    }
};

export const resendCode = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    };
    const body = JSON.stringify({email});
    try {
        await axios.post(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/auth/users/resend_activation/`,
            body,
            config
        );
        return true;
    } catch (err) {
        return false;
    }
};