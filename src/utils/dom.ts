export const isButtonElement = (element: Element | null | undefined): element is HTMLButtonElement => {
    return !!element && element.tagName === 'BUTTON';
};