import { Show } from 'solid-js';
import { useAuthContext } from '@/auth/AuthContext';
import { isAdmin } from '@/auth/authUtils';
import { A } from '@solidjs/router';

const AdminDropDown = () => {
    const { authState } = useAuthContext();

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
                        <li class="nav-item">
                            <A href="/settings" class="dropdown-item nav-link text-dark">
                                Settings
                            </A>
                        </li>
                        <li class="nav-item">
                            <A href="/data-fetches" class="dropdown-item nav-link text-dark">
                                Data fetches
                            </A>
                        </li>
                    </ul>
                </div>
            </li>
        </Show>
    );
};

export default AdminDropDown;
