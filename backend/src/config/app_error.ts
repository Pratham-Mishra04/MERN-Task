export interface AppErrorInterface extends Error {
    statusCode: number;
    status: string;
    isOperationError: boolean;
}

class AppError extends Error {
    statusCode: number;
    status: string;
    isOperationError: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperationError = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
