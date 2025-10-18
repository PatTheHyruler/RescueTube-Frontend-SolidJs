import { Navigate, Route, useParams } from '@solidjs/router';
import { createResource, Match, Switch } from 'solid-js';
import type { GetEntityIdHandler } from '@/services/common/platformEntityEndpoints';

interface Props {
    fetchEntityId: GetEntityIdHandler;
    getRoute: (entityId: string) => string;
}

const PlatformEntityRedirect = (props: Props) => {
    const params = useParams();
    const entityArgs = () => ({ platform: params.platform, idOnPlatform: params.idOnPlatform });

    const [entityId] = createResource(
        () => ({
            entityArgs: entityArgs(),
            fetchEntityId: props.fetchEntityId,
        }),
        async ({ entityArgs, fetchEntityId }) => {
            if (!entityArgs.platform || !entityArgs.idOnPlatform) {
                throw new Error('Invalid entity args');
            }
            const response = await fetchEntityId({
                platform: entityArgs.platform,
                idOnPlatform: entityArgs.idOnPlatform,
            });
            return response.data;
        },
    );

    return (
        <Switch>
            <Match when={entityId()}>
                {entityId => <Navigate href={props.getRoute(entityId())} />}
            </Match>
            <Match when={entityId.loading}>
                Redirecting...
            </Match>
            <Match when={entityId.error}>
                <span class="text-danger">Something went wrong</span>
            </Match>
        </Switch>
    );
};

export const PlatformEntityRedirectRoute = (props: Props) => {
    return (
        <Route
            path="/:platform/:idOnPlatform"
            component={() => (
                <PlatformEntityRedirect {...props} />
            )}
        />
    );
};