import { LoginRequiredError } from '@/auth/authTypes';
import { createEffect } from 'solid-js';

export const RootErrorHandler = (err: Error | unknown | undefined) => {
    createEffect(() => {
        if (err instanceof LoginRequiredError) {
            // navigate(`/login?returnUrl=${encodeURIComponent(window.location.href)}`);
            window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.href)}`; // TODO: Figure out a way to use navigate here
        }
        throw err;
    });

    return <pre>
        {(err instanceof Error ? err.stack : err?.toString())}
    </pre>;
};
