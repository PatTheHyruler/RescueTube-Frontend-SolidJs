import VideoSettingsBulkEdit from '@/components/VideoSettingsBulkEdit';
import type { VideoSearchDtoV1 } from '@/apiModels';

interface VideoBulkActionsProps {
    query: VideoSearchDtoV1;
    videoIds: string[];
    selectAll: boolean;
}

const VideoBulkActions = (props: VideoBulkActionsProps) => {
    let videoSettingsBulkEditDialog!: HTMLDialogElement;

    return (
        <div>
            Video bulk actions
            <div class="d-flex">
                <button
                    onClick={() => videoSettingsBulkEditDialog.showModal()}
                >
                    Edit archival settings
                </button>
            </div>
            <dialog ref={videoSettingsBulkEditDialog}>
                <VideoSettingsBulkEdit
                    filter={props.query.filter}
                    videoIds={props.videoIds}
                    selectAll={props.selectAll}
                    onClose={() => videoSettingsBulkEditDialog.close()}
                />
            </dialog>
        </div>
    );
};

export default VideoBulkActions;
