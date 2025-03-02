import { Show, useContext } from 'solid-js';
import AuthContext from '../auth/AuthContext';
import { isAdmin } from '../auth/authUtils';

const AdminDropDown = () => {
    const { authState } = useContext(AuthContext)!;

    return (
        <Show when={isAdmin(authState.userDetails?.user)}>
            <li class="nav-item">
                <div class="btn-group">
                    <button
                        type="button"
                        class="btn btn-danger dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        ADMIN
                    </button>
                    <ul class="dropdown-menu">
                        <li class="nav-item">
                            <a
                                href={'/hangfire/redirect'}
                                class="dropdown-item nav-link text-dark"
                            >
                                Jobs
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
        </Show>
    );
};

export default AdminDropDown;
