import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// ReactDOM.render(<App />, document.getElementById('root'));
renderApp(window.location.pathname); //render page the first time 

window.addEventListener('popstate', function (e) {
    //render page when path changes
    renderApp(window.location.pathname);
});

function renderApp(path: string) {
    ReactDOM.render(
        <App path={path}/>,
        document.getElementById('root')
    );
}
