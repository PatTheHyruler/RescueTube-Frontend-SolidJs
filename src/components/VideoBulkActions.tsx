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
                    filter={{
                        nameQuery: props.query.nameQuery,
                        authorQuery: props.query.authorQuery,
                        authorIds: props.query.authorIds,
                    }}
                    videoIds={props.videoIds}
                    selectAll={props.selectAll}
                    onClose={() => videoSettingsBulkEditDialog.close()}
                />
            </dialog>
        </div>
    );
};

export default VideoBulkActions;
