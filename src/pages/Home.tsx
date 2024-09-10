import SubmissionForm from '../components/SubmissionForm';
import { createResource, Show, useContext } from 'solid-js';
import { statisticsApi } from '../services/statisticsApi';
import AuthContext from '../auth/AuthContext';

const Home = () => {
    const authContext = useContext(AuthContext);
    const isAuthenticated = () => !!authContext?.authState.jwtState;

    const [videoDownloadStatistics, { refetch: refetchStatistics }] =
        createResource(isAuthenticated(), async () => {
            if (!isAuthenticated()) {
                return null;
            }
            const response = await statisticsApi.getVideoDownloadStatistics();
            return response.data;
        });
    setInterval(
        async (refetchFunc) => {
            await refetchFunc();
        },
        30_000,
        refetchStatistics
    );

    return (
        <>
            <SubmissionForm />
            <Show when={videoDownloadStatistics()}>
                <div>
                    <pre>
                        {JSON.stringify(videoDownloadStatistics(), null, 2)}
                    </pre>
                </div>
            </Show>
        </>
    );
};

export default Home;
