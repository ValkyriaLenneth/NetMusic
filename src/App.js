import React from 'react';
import { GlobalStyle} from "./style";
import {IconStyle} from "./assets/iconfont/iconfont";

// import router-config
import { renderRoutes} from "react-router-config";
import routes from "./routes/index.js";
import { HashRouter} from "react-router-dom";

// import redux
import {Provider} from "react-redux";
import store from './store/index';

// context
import {Data} from "./application/Singers/data";

function App() {
    return (
        <Provider store={store}>
            <HashRouter>
                <GlobalStyle></GlobalStyle>
                <IconStyle></IconStyle>
                <Data>
                    {renderRoutes(routes)}
                </Data>
            </HashRouter>
        </Provider>

    );
}
export default App;
