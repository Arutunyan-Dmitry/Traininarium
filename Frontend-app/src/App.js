import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/global.css';

import { Provider } from "react-redux";
import store from "./store";

import Main from './containers/main/Main';

const App = () => {
    return (
        <Provider store={store}>
            <Main />
        </Provider>
    )
};

export default App;