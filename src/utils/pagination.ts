import type {PaginationQuery, PaginationResult} from "../apiModels";
import {type Setter} from "solid-js";

export const useOnPaginationQueryUpdate = <TQuery extends PaginationQuery>(
    setQuery: Setter<TQuery>) =>
    (newPaginationQuery: PaginationQuery) => {
        setQuery(v => ({...v, limit: newPaginationQuery.limit, page: newPaginationQuery.page}));
    }

export const getPageRangeStart = (paginationResult: PaginationResult) => {
    return paginationResult.limit * paginationResult.page;
}

export const getPageRangeEnd = (paginationResult: PaginationResult) => {
    return paginationResult.limit * paginationResult.page + paginationResult.amountOnPage;
}

export const getMaxPageRangeEnd = (paginationResult: PaginationResult) => {
    return paginationResult.limit * paginationResult.page + paginationResult.limit;
}

export const isLastPage = (paginationResult: PaginationResult) => {
    const pageRangeEnd = getPageRangeEnd(paginationResult);
    if (paginationResult.totalResults) {
        if (pageRangeEnd > paginationResult.totalResults) {
            console.warn(`pageRangeEnd ${pageRangeEnd} > totalResults ${paginationResult.totalResults}`);
        }
        return pageRangeEnd >= paginationResult.totalResults;
    }
    return getMaxPageRangeEnd(paginationResult) > pageRangeEnd;
}

export const getLastPage = (totalResults: number | null | undefined, limit: number) => {
    if (totalResults && totalResults > 1 && limit > 0) {
        return Math.floor((totalResults - 1) / limit);
    }
    return null;
}