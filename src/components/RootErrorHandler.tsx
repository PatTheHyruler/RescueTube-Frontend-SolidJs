import { LoginRequiredError } from '../auth/authTypes';
import { useNavigate } from '@solidjs/router';

export const RootErrorHandler = (err: Error | undefined) => {
    const navigate = useNavigate();

    if (err instanceof LoginRequiredError) {
        navigate('/login');
    }

    return <div>{err?.toString()}</div>;
};
