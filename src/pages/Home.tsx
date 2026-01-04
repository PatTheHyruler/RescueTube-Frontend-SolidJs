import SubmissionForm from '@/components/SubmissionForm';
import { createResource, onCleanup, Show } from 'solid-js';
import { statisticsApi } from '@/services/statisticsApi';
import { useAuthContext } from '@/auth/AuthContext';

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

    onCleanup(() => {
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
        </>
    );
};

export default Home;
