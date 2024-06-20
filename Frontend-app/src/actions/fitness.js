import axios from "axios";
import { get_access } from "./auth";


export const getPlans = () => async dispatch => {
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
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/fitness/plan/`,
                config
            );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};
export const getExercises = () => async dispatch => {
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
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/fitness/exercise/`,
                config
            );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};
export const getPlanExercises = (slug) => async dispatch => {
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
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/fitness/plan/${slug}/training-1`,
                config
            );
        return [true, res.data.exercises];
    } catch (err) {
        return [false, err];
    }
};
export const getTrainingPerformances = (slug) => async dispatch => {
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
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/fitness/training/all/${slug}`,
                config
            );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};
export const createPlan = (context) => async dispatch => {
    await dispatch(get_access());
    const data = new FormData();
    const config = {
        headers: {}
    };
    Object.entries(context).map(([key, value]) => {
        if (key === "picture")
            if (value !== null) data.append(key, value, value.name);
        else if (key === "equipment")
            if (value !== "") data.append(key, value);
        if (key !== "picture" && key !== "equipment") data.append(key, value);
    });
    if (localStorage.getItem('access'))
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/fitness/plan/`,
            data,
            config
        );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};
export const fillPlan = (slug, context) => async dispatch => {
    await dispatch(get_access());
    const data = {exercises: context};
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    };
    const body = JSON.stringify(data);
    if (localStorage.getItem('access'))
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/fitness/plan/${slug}/fill/`,
            body,
            config
        );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};
export const deletePlan = (slug) => async dispatch => {
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
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}/fitness/plan/${slug}/`,
            config
        );
        return [true, res.data];
    } catch (err) {
        return [false, err];
    }
};