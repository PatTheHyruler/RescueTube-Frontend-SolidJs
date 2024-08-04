import {type JSX} from "solid-js";

interface IProps {
    page: number,
    currentPage: number,
    onPageChange: (page: number) => void,
    children?: JSX.Element,
}

const PaginationButton = (props: IProps) => {
    return (
        <button onClick={() => props.onPageChange(props.page)}
                classList={{
                    'btn': true,
                    'btn-primary': props.page === props.currentPage,
                    'btn-outline-primary': props.page !== props.currentPage,
                }}
        >
            {props.children ?? <>{props.page + 1}</>}
        </button>
    );
}

export default PaginationButton;