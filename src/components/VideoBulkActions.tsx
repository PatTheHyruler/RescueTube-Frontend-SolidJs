import VideoSettingsBulkEdit from '@/components/VideoSettingsBulkEdit';

interface VideoBulkActionsProps {
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
                    videoIds={props.videoIds}
                    selectAll={props.selectAll}
                    onClose={() => videoSettingsBulkEditDialog.close()}
                />
            </dialog>
        </div>
    );
};

export default VideoBulkActions;
