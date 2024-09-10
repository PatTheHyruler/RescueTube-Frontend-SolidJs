import { baseApi } from './baseApi';
import type { VideoDownloadStatisticsByPlatformResponseDtoV1 } from '../apiModels';

const getVideoDownloadStatistics = async () => {
    return await baseApi.axios.get<VideoDownloadStatisticsByPlatformResponseDtoV1>(
        '/v1/statistics/videoDownloadStatistics'
    );
};

export const statisticsApi = {
    getVideoDownloadStatistics,
};
