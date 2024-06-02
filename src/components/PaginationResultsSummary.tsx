import {PaginationResult} from "../apiModels";
import {getPageRangeEnd, getPageRangeStart, isLastPage} from "../utils/pagination";
import {Match, Switch} from "solid-js";

const PaginationResultsSummary = (props: { paginationResult?: PaginationResult | null }) => {
    const start = () => props.paginationResult ? getPageRangeStart(props.paginationResult) + 1 : null;
    const end = () => props.paginationResult ? getPageRangeEnd(props.paginationResult) : null;

    return (
        <div>
            <Switch>
                <Match when={!props.paginationResult}>
                    No results yet
                </Match>
                <Match when={props.paginationResult?.amountOnPage === 0}>
                    0 results on page
                </Match>
                <Match when={props.paginationResult?.totalResults}>
                    Showing {start()}-{end()} of {props.paginationResult?.totalResults} results
                </Match>
                <Match when={props.paginationResult && isLastPage(props.paginationResult)}>
                    Showing {start()}-{end()} of {end()} results
                </Match>
                <Match when={props.paginationResult}>
                    Showing {start()}-{end()} results (of unknown total)
                </Match>
            </Switch>
        </div>
    );
}

export default PaginationResultsSummary;