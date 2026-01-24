import { ErrorBoundary } from "solid-js";
/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { Route, Router } from '@solidjs/router';
import Home from './pages/Home';
import Login from './auth/Login';
import Register from './auth/Register';
import VideoSearch from './pages/videos/VideoSearch';
import VideoWatch from './pages/videos/VideoWatch';
import { isGuid } from './utils';
import HangfireRedirect from './pages/hangfire/HangfireRedirect';
import AuthorDetails from './pages/authors/AuthorDetails';
import Settings from './pages/settings/Settings';
import RequireAuth from './auth/RequireAuth';
import { Roles } from './auth/Roles';
import { RootErrorHandler } from '@/components/RootErrorHandler';
import DataFetches from '@/pages/data-fetches/DataFetches';
import AuthorSearch from '@/pages/authors/AuthorSearch';
import PlaylistSearch from './pages/playlists/PlaylistSearch';
import PlaylistDetails from '@/pages/playlists/PlaylistDetails';
import { PlatformEntityRedirectRoute } from '@/components/PlatformEntityRedirect';
import { videosApi } from '@/services/videosApi';
import routes from '@/utils/routes';
import { authorsApi } from '@/services/authorsApi';
import { playlistsApi } from '@/services/playlistsApi';
import SubmissionSearch from '@/pages/submissions/submission-search';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    );
}

render(
    () => (
        <ErrorBoundary fallback={RootErrorHandler}>
            <Router root={App}>
                <Route path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/videos">
                    <Route path="/search" component={VideoSearch} />
                    <Route path="/:id/watch" component={VideoWatch} matchFilters={{ id: (id) => isGuid(id) }} />
                    <PlatformEntityRedirectRoute fetchEntityId={videosApi.getVideoId} getRoute={routes.videos.watch} />
                </Route>
                <Route path="/authors">
                    <Route path="/" component={AuthorSearch} />
                    <Route path=":id" component={AuthorDetails} matchFilters={{ id: (id) => isGuid(id) }} />
                    <PlatformEntityRedirectRoute
                        fetchEntityId={authorsApi.getAuthorId}
                        getRoute={routes.authors.details}
                    />
                </Route>
                <Route path="/playlists">
                    <Route path="/" component={PlaylistSearch} />
                    <Route path=":id" component={PlaylistDetails} matchFilters={{ id: isGuid }} />
                    <PlatformEntityRedirectRoute
                        fetchEntityId={playlistsApi.getPlaylistId}
                        getRoute={routes.playlists.details}
                    />
                </Route>
                <Route
                    path="/submissions"
                    component={() => (
                        <RequireAuth>
                            <SubmissionSearch />
                        </RequireAuth>
                    )}
                />
                <Route
                    path="/data-fetches"
                    component={() => (
                        <RequireAuth>
                            <DataFetches />
                        </RequireAuth>
                    )}
                />
                <Route
                    path="/settings"
                    component={() => (
                        <RequireAuth roles={Roles.AdminRoles}>
                            <Settings />
                        </RequireAuth>
                    )}
                />
                <Route path="/hangfire/redirect" component={HangfireRedirect} />
            </Router>
        </ErrorBoundary>
    ),
    root!
);
