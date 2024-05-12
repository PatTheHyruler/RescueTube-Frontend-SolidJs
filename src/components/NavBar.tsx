import AccountHeader from "./AccountHeader";
import {A} from "@solidjs/router";

const NavBar = () => {
    return (
            <nav
                class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div class="container-fluid">
                    <A href="/" class="navbar-brand">RescueTube</A>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul class="navbar-nav flex-grow-1">
                            <li class="nav-item">
                                <A href="/" class="nav-link text-dark">
                                    Home
                                </A>
                            </li>
                            <li class="nav-item">
                                <A href="/videos/search" class="nav-link text-dark">
                                    Videos
                                </A>
                            </li>
                        </ul>
                        <ul class="navbar-nav">
                            <AccountHeader></AccountHeader>
                        </ul>
                    </div>
                </div>
            </nav>
    );
}

export default NavBar;