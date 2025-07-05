import VideoSettingsBulkEdit from '@/components/VideoSettingsBulkEdit';

interface VideoBulkActionsProps {
    videoIds: string[];
    selectAll: boolean;
}

const VideoBulkActions = (props: VideoBulkActionsProps) => {
    let dialog!: HTMLDialogElement;

    return (
        <div>
            Video bulk actions
            <div class="d-flex">
                <button
                    onClick={() => dialog.showModal()}
                >
                    Edit archival settings
                </button>
            </div>
            <dialog ref={dialog}>
                <VideoSettingsBulkEdit videoIds={props.videoIds} selectAll={props.selectAll} />
            </dialog>
        </div>
    );
};

export default VideoBulkActions;
