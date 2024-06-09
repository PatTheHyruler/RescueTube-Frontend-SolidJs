import {Show, useContext} from "solid-js";
import AuthContext from "../auth/AuthContext";
import {isAdmin} from "../auth/authUtils";
import {baseApi} from "../services/baseApi";
import {accountApi} from "../auth/accountApi";

const AdminDropDown = () => {
    const {authState} = useContext(AuthContext)!;

    const onHangfireOpen = async (url: string) => {
        const hangfireTokenResponse = await accountApi.getHangfireToken();
        const hangfireToken = hangfireTokenResponse.data;
        const newUrl = new URL(url);
        newUrl.searchParams.set('HangfireUrl', url);
        newUrl.searchParams.set('HangfireToken', hangfireToken);
        window.location.href = newUrl.href;
    }

    return <Show when={isAdmin(authState.userDetails?.user)}>
        <li class="nav-item">
            <div class="btn-group">
                <button type="button" class="btn btn-danger dropdown-toggle"
                        data-bs-toggle="dropdown" aria-expanded="false">
                    ADMIN
                </button>
                <ul class="dropdown-menu">
                    <li class="nav-item">
                        <a href={`${baseApi.baseUrlWithoutPrefix}/hangfire`}
                           class="dropdown-item nav-link text-dark"
                           onClick={async e => {
                               e.preventDefault();
                               await onHangfireOpen(e.currentTarget.href)
                           }}
                        >
                            Jobs
                        </a>
                    </li>
                </ul>
            </div>
        </li>
    </Show>;
}

export default AdminDropDown;