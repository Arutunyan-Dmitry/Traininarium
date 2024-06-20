import {Route, Routes} from "react-router-dom";
import AHome from "../pages/admin/AHome";
import React, {useEffect} from "react";
import Blog from "../pages/Blog";

const AdminApp = ({user, setNav}) => {
    useEffect(() => {
        setNav('admin');
    }, [setNav]);

    return (
        <Routes>
            <Route path='/' element={<AHome />}/>
            <Route path='/admin-blog' element={<Blog isAdmin={true} />}/>
        </Routes>
    )
};

export default AdminApp;