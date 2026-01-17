import { For, Show } from 'solid-js';
import { submissionsApi } from '@/services/submissionsApi';
import type { SubmissionsSearchDtoV1 } from '@/apiModels';
import { clone, type DeepPartial, isDeepEqual, tryParseBool, tryParseInt } from '@/utils';
import { useSearch } from '@/utils/search';
import { type Params } from '@solidjs/router';
import SubmissionSearchForm from '@/components/SubmissionSearchForm';
import SubmissionListRow from '@/components/Submissions/SubmissionListRow';

const defaultSearch: SubmissionsSearchDtoV1 = {
    page: 0,
    limit: 50,
};

interface SearchParams extends Params {
    page: string;
    limit: string;
    completed: string;
}

const mapSearchToDto = (searchParams: Partial<SearchParams>): DeepPartial<SubmissionsSearchDtoV1> => ({
    page: tryParseInt(searchParams.page) ?? undefined,
    limit: tryParseInt(searchParams.limit) ?? undefined,
    completed: tryParseBool(searchParams.completed) ?? undefined,
});

const mapDtoToSearch = (dto: Partial<SubmissionsSearchDtoV1>): Partial<SearchParams> => ({
    page: dto.page?.toString() ?? undefined,
    limit: dto.limit?.toString() ?? undefined,
    completed: dto.completed?.toString() ?? undefined,
});

const SubmissionSearch = () => {
    const { searchResults, applySearch, query, setQuery } = useSearch({
        defaultSearch: defaultSearch,
        mapSearchToDto: mapSearchToDto,
        mapDtoToSearch: mapDtoToSearch,
        getSnapshot: clone,
        fetch: query => submissionsApi.getSubmissions(query),
        beforeApplySearch: args => {
            if (args.previousQuery.completed != args.query.completed) {
                setQuery('page', 0);
            }
        }
    });

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
                            </tr>
                        </thead>
                        <For each={data().results}>
                            {(submission) => (
                                <tbody>
                                    <SubmissionListRow submission={submission} />
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