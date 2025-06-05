import { type JSX, Match, Switch } from 'solid-js';

import { useAuthContext } from '@/auth/AuthContext';

type Props = {
    roles?: string[];
    children?: JSX.Element;
};

const RequireAuth = (props: Props) => {
    const authContext = useAuthContext();

    const lacksAuth = () => !authContext.authState.userDetails;
    const lacksRoles = () => {
        if (!props.roles?.length) {
            return false;
        }

        const userRoles = authContext.authState.userDetails?.user.roles;
        return !userRoles || userRoles.findIndex(role => props.roles?.includes(role.name)) === -1;
    };

    return (
        <Switch fallback={props.children}>
            <Match when={lacksAuth()}>
                <div class="text-danger">You must be logged in to view this page</div>
            </Match>
            <Match when={lacksRoles()}>
                <div class="text-danger">You do not have the required roles to view this page</div>
            </Match>
        </Switch>
    );
};

export default RequireAuth;