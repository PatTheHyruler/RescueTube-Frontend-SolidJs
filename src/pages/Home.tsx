import SubmissionForm from '../components/SubmissionForm';
import { createResource, Show, useContext } from 'solid-js';
import { statisticsApi } from '../services/statisticsApi';
import AuthContext from '../auth/AuthContext';
import { jobsApi } from '../services/jobsApi';

const Home = () => {
    const authContext = useContext(AuthContext);
    const isAuthenticated = () => !!authContext?.authState.jwtState;

    const [videoDownloadStats, { refetch: refetchVideoStats }] =
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
        refetchVideoStats,
    );

    const [jobStats, { refetch: refetchJobStats }] = createResource(isAuthenticated(), async () => {
        if (!isAuthenticated()) { 
            return null;
        }
        const response = await jobsApi.getJobStats();
        return response.data;
    });
    setInterval(
        async (refetchFunc) => {
            await refetchFunc();
        },
        10_000,
        refetchJobStats,
    );

    return (
        <>
            <SubmissionForm />
            <Show when={videoDownloadStats()}>
                <div>
                    <pre>
                        {JSON.stringify(videoDownloadStats(), null, 2)}
                    </pre>
                </div>
            </Show>
            <Show when={jobStats()}>
                <div>
                    <pre>
                        {JSON.stringify(jobStats(), null, 2)}
                    </pre>
                </div>
            </Show>
        </>
    );
};

export default Home;
