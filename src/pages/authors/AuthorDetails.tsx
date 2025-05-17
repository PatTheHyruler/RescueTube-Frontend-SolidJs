import { useParams } from '@solidjs/router';
import { Show, createResource, For } from 'solid-js';
import AuthorSettings from '@/components/AuthorSettings';
import { authorsApi } from '@/services/authorsApi';
import type { AuthorSimpleDtoV1 } from '@/apiModels';

const AuthorDetails = () => {
    const params = useParams();
    const authorId = params.id;

    const [author] = createResource(async () => {
        if (!authorId) {
            throw new Error('No authorId provided');
        }
        const response = await authorsApi.getAuthor(authorId);
        return response.data;
    });

    const nameDisplay = (author: AuthorSimpleDtoV1) => {
        const { displayName, userName, idOnPlatform } = author;
        if (!displayName) {
            return userName ?? idOnPlatform;
        }
        if (!userName) {
            return displayName ?? idOnPlatform;
        }
        return `${displayName} (${userName})`;
    };

    return (
        <Show when={authorId}>
            {(authorId) => (<>
                <Show when={author()}>
                    {(author) => (<>
                        <h1>
                            <Show when={author().urlOnPlatform}
                                  fallback={<span>{nameDisplay(author())}</span>}
                                  children={url => (
                                      <a href={url()}>
                                          {nameDisplay(author())}
                                      </a>
                                  )}
                            />
                        </h1>
                        <For each={author().profileImages}>
                            {profileImage => (
                                <div class="d-inline-block">
                                    <img
                                        width={60}
                                        height={60}
                                        alt={`${nameDisplay(author())}'s PFP`}
                                        src={profileImage.url}
                                    />
                                </div>
                            )}
                        </For>
                    </>)}
                </Show>
                <AuthorSettings authorId={authorId()} />
            </>)}
        </Show>
    );
};

export default AuthorDetails;