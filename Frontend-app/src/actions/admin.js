import axios from "axios";
import { get_access } from "./auth";

export const getUsers = () => async dispatch => {
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
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/auth/users/`,
                config
            );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};

export const banUser = (username) => async dispatch => {
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
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/auth/users/ban/`,
            {username: username},
                config
            );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};

export const unbanUser = (username) => async dispatch => {
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
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/auth/users/unban/`,
            {username: username},
                config
            );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};