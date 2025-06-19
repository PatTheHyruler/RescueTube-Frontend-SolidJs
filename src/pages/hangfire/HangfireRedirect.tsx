import { useNavigate, useSearchParams } from '@solidjs/router';
import { createEffect, Match, Switch } from 'solid-js';
import { accountApi } from '@/auth/accountApi';
import { baseApi } from '@/services/baseApi';
import { useAuthContext } from '@/auth/AuthContext';
import { isAdmin } from '@/auth/authUtils';

const hangfireUrlString = `${baseApi.baseUrlWithoutPrefix}/hangfire-dashboard`;
const hangfireAuthUrlString = `${baseApi.baseUrl}/v1/auth/hangfire`;

const getTargetUrl = (returnUrlString: string | undefined) => {
    const hangfireUrl = new URL(hangfireUrlString, window.location.origin);

    if (returnUrlString) {
        const returnUrl = new URL(returnUrlString);
        if (
            returnUrl.origin === hangfireUrl.origin &&
            returnUrl.pathname.startsWith(hangfireUrl.pathname)
        ) {
            return returnUrl;
        }
        console.warn(
            `Invalid Hangfire return URL '${returnUrl}', redirecting to '${hangfireUrl}' instead`,
        );
    }

    return hangfireUrl;
};

const HangfireRedirect = () => {
    const authContext = useAuthContext();
    const authState = authContext.authState;

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const returnUrlString = searchParams.url;

    createEffect(async () => {
        const userDetailsResource = authContext.userDetailsResource;
        if (!userDetailsResource || userDetailsResource.loading) {
            return;
        }

        const userDetails = userDetailsResource();
        if (!userDetails?.user) {
            navigate(`/login?returnUrl=${encodeURIComponent(window.location.href)}`);
            return;
        }

        if (!isAdmin(userDetails?.user)) {
            return;
        }

        const hangfireTokenResponse = await accountApi.getHangfireToken();
        const hangfireToken = hangfireTokenResponse.data;

        const targetUrl = getTargetUrl(returnUrlString);

        const hangfireAuthUrl = new URL(hangfireAuthUrlString, window.location.origin);
        const appAuthUrl = new URL(window.location.href);
        appAuthUrl.pathname = '/hangfire/redirect';
        appAuthUrl.search = '';

        hangfireAuthUrl.searchParams.set('targetUrl', targetUrl.toString());
        hangfireAuthUrl.searchParams.set('hangfireToken', hangfireToken);
        hangfireAuthUrl.searchParams.set('appAuthUrl', appAuthUrl.toString());

        window.location.href = hangfireAuthUrl.toString();
    });

    return (
        <Switch fallback={<p class="text-danger">Access to Hangfire denied</p>}>
            <Match when={isAdmin(authState?.userDetails?.user)}>
                <p>Redirecting to Hangfire...</p>
            </Match>
            <Match when={!authState?.userDetails}>
                Waiting for user details fetch...
            </Match>
            <Match when={!authState?.userDetails?.user}>
                Redirecting to login...
            </Match>
        </Switch>
    );
};

export default HangfireRedirect;
