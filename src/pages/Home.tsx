import SubmissionForm from '@/components/SubmissionForm';
import { createResource, onCleanup, Show } from 'solid-js';
import { statisticsApi } from '@/services/statisticsApi';
import { useAuthContext } from '@/auth/AuthContext';
import { jobsApi } from '@/services/jobsApi';

const Home = () => {
    const authContext = useAuthContext();
    const isAuthenticated = () => !!authContext.authState.jwtState;

    const [videoDownloadStats, { refetch: refetchVideoStats }] =
        createResource(isAuthenticated(), async () => {
            if (!isAuthenticated()) {
                return null;
            }
            const response = await statisticsApi.getVideoDownloadStatistics();
            return response.data;
        });
    const videoStatsIntervalId = setInterval(
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
    const jobStatsIntervalId = setInterval(
        async (refetchFunc) => {
            await refetchFunc();
        },
        10_000,
        refetchJobStats,
    );

    onCleanup(() => {
        clearInterval(jobStatsIntervalId);
        clearInterval(videoStatsIntervalId);
    });

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
