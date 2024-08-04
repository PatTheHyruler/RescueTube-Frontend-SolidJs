import type { PaginationQuery, PaginationResult } from '../apiModels';
import PaginationResultsSummary from './PaginationResultsSummary';
import { createEffect, For, Show } from 'solid-js';
import PaginationButton from './PaginationButton';
import { getLastPage, isLastPage } from '../utils/pagination';

interface IProps {
    paginationQuery: PaginationQuery;
    paginationResult?: PaginationResult | null;
    onUpdate: (paginationQuery: PaginationQuery) => void;
    onSubmit: () => void;
}

const getPagesSelection = (
    page: number,
    limit: number,
    totalResults: number | null | undefined,
    amountOnPage: number | null | undefined
): number[] => {
    const pages = new Set<number>();
    pages.add(0);

    const pageRadius = 2;
    let lowPage = page - pageRadius;
    let highPage = page + pageRadius;
    for (let i = lowPage; i <= highPage; i++) {
        pages.add(i);
    }

    const lastPage = getLastPage(totalResults, limit);
    if (lastPage) {
        pages.add(lastPage);
    }

    const isCurrentPageOrLower = (v: number) => v <= page;
    const currentPageIsLast =
        amountOnPage != null &&
        isLastPage({
            page: page,
            limit: limit,
            amountOnPage: amountOnPage,
            totalResults: totalResults ?? null,
        });
    const limitToCurrentPageOrLowerIfNecessary = (v: number) => {
        if (currentPageIsLast) {
            return isCurrentPageOrLower(v);
        }
        return true;
    };
    const limitMaxPage: (value: number) => boolean =
        lastPage != null
            ? (v) => v <= lastPage
            : limitToCurrentPageOrLowerIfNecessary;

    return Array.from(pages)
        .filter((v) => v >= 0 && limitMaxPage(v))
        .toSorted((a, b) => a - b);
};

const PaginationComponent = (props: IProps) => {
    const limit = () =>
        props.paginationResult?.limit ?? props.paginationQuery.limit;
    const page = () =>
        props.paginationResult?.page ?? props.paginationQuery.page;

    const pagesSelection = () =>
        getPagesSelection(
            page(),
            limit(),
            props.paginationResult?.totalResults,
            props.paginationResult?.amountOnPage
        );

    createEffect(() => {
        const paginationResult = props.paginationResult;
        if (paginationResult) {
            props.onUpdate({
                page: paginationResult.page,
                limit: paginationResult.limit,
            });
        }
    });

    const setPage = (page: number) =>
        props.onUpdate({ page: page, limit: props.paginationQuery.limit });
    const setLimit = (limit: number) =>
        props.onUpdate({ page: props.paginationQuery.page, limit: limit });
    const onPageChange = (page: number) => {
        setPage(page);
        return props.onSubmit();
    };
    const onSubmit = (e: Event) => {
        e.preventDefault();
        return props.onSubmit();
    };

    const getMaxPageInput = () => {
        const lastPage = getLastPage(
            props.paginationResult?.totalResults,
            limit()
        );
        if (lastPage != null) {
            return lastPage + 1;
        }
        return undefined;
    };

    return (
        <div>
            <div class="d-inline-flex gap-1">
                <form onSubmit={onSubmit}>
                    <label>
                        Page:
                        <input
                            style={{ width: '4rem' }}
                            value={props.paginationQuery.page + 1}
                            onInput={(e) =>
                                setPage(parseInt(e.currentTarget.value, 10) - 1)
                            }
                            type="number"
                            min={1}
                            max={getMaxPageInput()}
                            step={1}
                        />
                    </label>
                    <label>
                        Limit:
                        <input
                            style={{ width: '4rem' }}
                            value={props.paginationQuery.limit}
                            onInput={(e) =>
                                setLimit(parseInt(e.currentTarget.value, 10))
                            }
                            type="number"
                            min={1}
                            step={1}
                        />
                    </label>
                    <button type="submit" class="btn btn-primary">
                        Apply
                    </button>
                </form>
                <Show
                    when={
                        getLastPage(
                            props.paginationResult?.totalResults,
                            limit()
                        ) || page() > 0
                    }
                >
                    <For each={pagesSelection()}>
                        {(selectionPage) => (
                            <div>
                                <PaginationButton
                                    page={selectionPage}
                                    currentPage={page()}
                                    onPageChange={onPageChange}
                                />
                            </div>
                        )}
                    </For>
                </Show>
                <Show
                    when={
                        props.paginationResult &&
                        !props.paginationResult.totalResults &&
                        props.paginationResult.amountOnPage >=
                            props.paginationResult.limit
                    }
                >
                    <PaginationButton
                        page={props.paginationResult!.page + 1}
                        currentPage={props.paginationResult!.page}
                        onPageChange={onPageChange}
                    >
                        Next
                    </PaginationButton>
                </Show>
            </div>
            <PaginationResultsSummary
                paginationResult={props.paginationResult}
            />
        </div>
    );
};

export default PaginationComponent;
