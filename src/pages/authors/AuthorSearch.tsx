import { createResource, createSignal, For, Show } from 'solid-js';
import { authorsApi } from '@/services/authorsApi';
import type { AuthorSearchRequestDtoV1 } from '@/apiModels';
import AuthorSummary from '@/components/AuthorSummary';

const AuthorSearch = () => {
    const [query, setQuery] = createSignal<AuthorSearchRequestDtoV1>({
        page: 0,
        limit: 50,
        name: null,
    });

    const [searchResults, searchResultActions] = createResource(() => authorsApi.searchAuthors(query()));

    return (
        <div>
            <form onSubmit={async e => {
                e.preventDefault();
                await searchResultActions.refetch();
            }}>
                <label>
                    <input
                        type="search"
                        value={query().name ?? ''}
                        onChange={e => setQuery(q => ({ ...q, name: e.currentTarget.value }))}
                    />
                </label>
                <button type="submit">Search</button>
            </form>
            <Show when={searchResults()?.data}>
                {(data) => (
                    <div>
                        <For each={data().authors}>
                            {(author) => (
                                <AuthorSummary author={author} />
                            )}
                        </For>
                    </div>
                )}
            </Show>
        </div>
    );
};

export default AuthorSearch;