import { For, Show } from 'solid-js';
import { submissionsApi } from '@/services/submissionsApi';
import type { OrderByPropertyDtoV1, SubmissionsSearchDtoV1 } from '@/apiModels';
import { clone, type DeepPartial, tryParseBool, tryParseInt } from '@/utils';
import { useSearch } from '@/utils/search';
import { type Params } from '@solidjs/router';
import SubmissionSearchForm from '@/components/SubmissionSearchForm';
import SubmissionListRow from '@/components/Submissions/SubmissionListRow';
import { useAuthContext } from '@/auth/AuthContext';
import { isAdmin } from '@/auth/authUtils';

const parseOrderBy = (orderByString: string | undefined): OrderByPropertyDtoV1[] | null => {
    if (!orderByString) return null;

    try {
        const parts = orderByString.split(',');
        return parts.map((part) => {
            const descending = part.endsWith('↓') || part.endsWith('desc');
            const propertyName = part.replace(/[↓↑]|asc|desc$/i, '').trim();
            return { propertyName, descending };
        });
    } catch {
        return null;
    }
};

const stringifyOrderBy = (orderBy: OrderByPropertyDtoV1[] | undefined): string | undefined => {
    if (!orderBy || orderBy.length === 0) return undefined;

    return orderBy.map((order) => `${order.propertyName}${order.descending ? '↓' : '↑'}`).join(',');
};

const defaultSearch: SubmissionsSearchDtoV1 = {
    page: 0,
    limit: 50,
    completed: null,
    orderBy: null,
};

interface SearchParams extends Params {
    page: string;
    limit: string;
    completed: string;
    orderBy: string;
}

const mapSearchToDto = (searchParams: Partial<SearchParams>): DeepPartial<SubmissionsSearchDtoV1> => ({
    page: tryParseInt(searchParams.page) ?? undefined,
    limit: tryParseInt(searchParams.limit) ?? undefined,
    completed: tryParseBool(searchParams.completed) ?? undefined,
    orderBy: parseOrderBy(searchParams.orderBy) || undefined,
});

const mapDtoToSearch = (dto: Partial<SubmissionsSearchDtoV1>): Partial<SearchParams> => ({
    page: dto.page?.toString() ?? undefined,
    limit: dto.limit?.toString() ?? undefined,
    completed: dto.completed?.toString() ?? undefined,
    orderBy: stringifyOrderBy(dto.orderBy || undefined),
});

const SubmissionSearch = () => {
    const { searchResults, applySearch, query, setQuery, searchResultActions } = useSearch({
        defaultSearch: defaultSearch,
        mapSearchToDto: mapSearchToDto,
        mapDtoToSearch: mapDtoToSearch,
        getSnapshot: clone,
        fetch: (query) => submissionsApi.getSubmissions(query),
        beforeApplySearch: (args) => {
            if (args.previousQuery.completed != args.query.completed) {
                setQuery('page', 0);
            }
        },
    });

    const { authState } = useAuthContext();
    const isCurrentUserAdmin = () => isAdmin(authState.userDetails?.user);

    return (
        <div class="center-container">
            <SubmissionSearchForm
                query={query}
                onSubmit={applySearch}
                setQuery={setQuery}
                paginationResult={searchResults()?.data.paginationResult}
            />
            <Show
                when={searchResults()?.data}
                children={(data) => (
                    <table class="results-table" style={{ 'min-width': '650px' }}>
                        <thead>
                            <tr>
                                <th />
                                <th />
                                <th />
                                <Show when={isCurrentUserAdmin()}>
                                    <th />
                                </Show>
                            </tr>
                        </thead>
                        <For each={data().results}>
                            {(submission) => (
                                <tbody>
                                    <SubmissionListRow
                                        submission={submission}
                                        allowManualHandling={isCurrentUserAdmin()}
                                        refreshResults={searchResultActions.refetch}
                                    />
                                </tbody>
                            )}
                        </For>
                    </table>
                )}
            />
        </div>
    );
};

export default SubmissionSearch;
