import type {LinkSubmissionResponseDtoV1} from "../apiModels";

interface IProps {
    response: LinkSubmissionResponseDtoV1,
}

const SubmissionSuccess = (props: IProps) => {
    return (
        <div class="text-success">
            {JSON.stringify(props.response)}
        </div>
    );
}

export default SubmissionSuccess;