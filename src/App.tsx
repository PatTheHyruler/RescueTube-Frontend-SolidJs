import {Component, createEffect, JSX} from 'solid-js';
import styles from './App.module.css';
import NavBar from "./components/NavBar";
import {createStore} from "solid-js/store";
import {AuthState} from "./auth/model/AuthState";
import AuthContext from "./auth/AuthContext";

const App: Component = (props: { children?: JSX.Element }) => {
    const [authState, setAuthState] = createStore<AuthState>({});

    return (
        <AuthContext.Provider value={{authState, setAuthState}} >
            < div class={styles.App}>
            <header class={styles.header}>
        {/*<img src={logo} class={styles.logo} alt="logo"/>*/}
            <NavBar></NavBar>
            </header>
        {props.children}
</div>
</AuthContext.Provider>
)
    ;
};

export default App;
