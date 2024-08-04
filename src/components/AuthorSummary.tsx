import { type AuthorSimpleDtoV1 } from '../apiModels';
import { Show } from 'solid-js';

interface IProps {
    author: AuthorSimpleDtoV1;
}

export const AuthorSummary = (props: IProps) => {
    const nameDisplay = () => {
        const {
            author: { displayName, userName, idOnPlatform },
        } = props;
        if (!displayName) {
            return userName ?? idOnPlatform;
        }
        if (!userName) {
            return displayName ?? idOnPlatform;
        }
        return `${displayName} (${userName})`;
    };

    return (
        <div>
            <div class="d-inline-block">
                <img
                    width={40}
                    height={40}
                    alt={`${nameDisplay()}'s PFP`}
                    src={props.author.profileImages[0]?.url}
                />
            </div>
            <div class="d-inline-block">
                <Show
                    when={props.author.urlOnPlatform}
                    fallback={nameDisplay()}
                >
                    <a href={props.author.urlOnPlatform}>{nameDisplay()}</a>
                </Show>
            </div>
        </div>
    );
};

export default AuthorSummary;
