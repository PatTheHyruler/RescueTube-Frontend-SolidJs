/* @refresh reload */
import {render} from 'solid-js/web';

import './index.css';
import App from './App';
import {Route, Router} from "@solidjs/router";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import VideoSearch from "./pages/videos/VideoSearch";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    );
}

render(() => <Router root={App}>
    <Route path="/" component={Home}></Route>
    <Route path="/login" component={Login}></Route>
    <Route path="/register" component={Register}></Route>
    <Route path="/videos">
        <Route path="/search" component={VideoSearch}></Route>
    </Route>
</Router>, root!);
