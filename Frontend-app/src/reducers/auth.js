import {
    LOGIN_SUCCESS, LOGIN_FAILED, USER_LOADED_SUCCESS, USER_LOADED_FAILED,
    GET_ACCESS_SUCCESS, GET_ACCESS_FAILED, LOGOUT, REGISTRATION_SUCCESS, ACTIVATED
} from "../actions/types";

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    uid: localStorage.getItem('uid'),
    email: localStorage.getItem('email'),
    isAdmin: null,
    isAuthenticated: null,
    user: null
};

function auth(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case GET_ACCESS_SUCCESS:
            localStorage.setItem('access', payload.access);
            return {
                ...state,
                access: payload.access,
                isAuthenticated: true
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                refresh: payload.refresh,
                isAuthenticated: true
            }
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: payload,
                isAdmin: payload.is_admin
            }
        case USER_LOADED_FAILED:
            return {
                ...state,
                user: null,
                isAdmin: null,
            }
        case LOGOUT:
        case GET_ACCESS_FAILED:
        case LOGIN_FAILED:
            localStorage.removeItem('refresh');
            localStorage.removeItem('access');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                isAdmin: null,
                user: null
            }
        case REGISTRATION_SUCCESS:
            localStorage.setItem('uid', payload.uid);
            localStorage.setItem('email', payload.email);
            return {
                ...state,
                uid: payload.uid,
                email: payload.email
            }
        case ACTIVATED:
            localStorage.removeItem('uid');
            localStorage.removeItem('email');
            return {
                ...state,
                uid: null,
                email: null
            }
        default:
            return state
    }
}

export default auth;