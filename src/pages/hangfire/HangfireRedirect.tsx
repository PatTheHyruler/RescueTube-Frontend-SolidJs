import { useSearchParams } from '@solidjs/router';
import { createEffect, Show, useContext } from 'solid-js';
import { accountApi } from '@/auth/accountApi';
import { baseApi } from '@/services/baseApi';
import AuthContext from '@/auth/AuthContext';
import { isAdmin } from '@/auth/authUtils';

const hangfireUrlString = `${baseApi.baseUrlWithoutPrefix}/hangfire`;
const hangfireAuthUrlString = `${baseApi.baseUrlWithoutPrefix}/auth/hangfire`;

const getTargetUrl = (returnUrlString: string | undefined) => {
    const hangfireUrl = new URL(hangfireUrlString);

    if (returnUrlString) {
        const returnUrl = new URL(returnUrlString);
        if (
            returnUrl.origin === hangfireUrl.origin &&
            returnUrl.pathname.startsWith(hangfireUrl.pathname)
        ) {
            return returnUrl;
        }
        console.warn(
            `Invalid Hangfire return URL '${returnUrl}', redirecting to '${hangfireUrl}' instead`
        );
    }

    return hangfireUrl;
};

const HangfireRedirect = () => {
    const authContext = useContext(AuthContext);
    const authState = authContext?.authState;

    const [searchParams] = useSearchParams();
    const returnUrlString = searchParams.url;

    createEffect(async () => {
        if (!isAdmin(authState?.userDetails?.user)) {
            return;
        }

        const hangfireTokenResponse = await accountApi.getHangfireToken();
        const hangfireToken = hangfireTokenResponse.data;

        const targetUrl = getTargetUrl(returnUrlString);

        const hangfireAuthUrl = new URL(hangfireAuthUrlString);
        const appAuthUrl = new URL(window.location.href);
        appAuthUrl.pathname = '/hangfire/redirect';

        hangfireAuthUrl.searchParams.set('targetUrl', targetUrl.toString());
        hangfireAuthUrl.searchParams.set('hangfireToken', hangfireToken);
        hangfireAuthUrl.searchParams.set('appAuthUrl', appAuthUrl.toString());

        window.location.href = hangfireAuthUrl.toString();
    });

    return (
        <Show
            when={isAdmin(authState?.userDetails?.user)}
            fallback={<p class="text-danger">Access to Hangfire denied</p>}
        >
            <p>Redirecting to Hangfire...</p>
        </Show>
    );
};

export default HangfireRedirect;
