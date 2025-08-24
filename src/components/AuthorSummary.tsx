import { type AuthorSimpleDtoV1 } from '@/apiModels';
import { Show } from 'solid-js';

interface IProps {
    author: AuthorSimpleDtoV1;
}

export const AuthorSummary = (props: IProps) => {
    const nameDisplay = () => {
        const displayName = props.author.displayName;
        const userName = props.author.userName;
        const idOnPlatform = props.author.idOnPlatform;

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
            <Show when={props.author.profileImages[0]?.url}>
                <div class="d-inline-block">
                    <img
                        width={40}
                        height={40}
                        alt={`${nameDisplay()}'s PFP`}
                        src={props.author.profileImages[0]?.url}
                    />
                </div>
            </Show>
            <div class="d-inline-block">
                <a href={`/authors/${props.author.id}`}>{nameDisplay()}</a>
                <Show
                    when={props.author.urlOnPlatform}
                    fallback={nameDisplay()}
                >
                    <a href={props.author.urlOnPlatform} class='ps-1' title={`View author on ${props.author.platform}`}>
                        🡵
                    </a>
                </Show>
            </div>
        </div>
    );
};

export default AuthorSummary;
