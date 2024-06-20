import axios from "axios";
import { get_access } from "./auth";


export const getArticles = () => async dispatch => {
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
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/blog/article/`,
                config
            );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};
export const getArticle = (slug) => async dispatch => {
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
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/blog/article/${slug}/`,
                config
            );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};

export const createOrUpdateArticle = (slug, context) => async dispatch => {
    await dispatch(get_access());
    const data = new FormData();
    const config = {
        headers: {}
    };
    Object.entries(context).map(([key, value]) => {
        if (key === "picture") {
            if (value !== null) data.append(key, value, value.name);
        }
        else data.append(key, value);
    });
    if (localStorage.getItem('access'))
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
    try {
        let res;
        if (slug !== "") res = await axios.patch(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/blog/article/${slug}/`,
            data,
            config
        );
        else res = await axios.post(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/blog/article/`,
            data,
            config
        );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};

export const deleteArticle = (slug) => async dispatch => {
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
        const res = await axios.delete(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/blog/article/${slug}/`,
            config
        );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};


