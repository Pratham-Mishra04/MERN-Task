import * as dotenv from 'dotenv';

dotenv.config();

type NODE_ENV = 'development' | 'production';

interface ENV_struct {
    NODE_ENV: NODE_ENV;
    PORT: string;
    FRONTEND_URL: string;
    DATABASE_URL: string;
    DATABASE_PASSWORD: string;
    JWT_KEY: string;
    JWT_EXP_TIME: string;
}

const ENV: ENV_struct = {
    NODE_ENV: 'development',
    PORT: '8000',
    FRONTEND_URL: 'http://127.0.0.1:3000',
    DATABASE_URL: '',
    DATABASE_PASSWORD: '',
    JWT_KEY: '',
    JWT_EXP_TIME: '',
};

const configENV = (): void => {
    Object.keys(ENV).forEach(envKey => {
        const key = envKey;
        const val = process.env[key];

        if (val === undefined) {
            console.error(`Fatal Error: Missing required environment variable: ${key}`);
            process.exit(1);
        }

        ENV[key] = val;
    });
};

export { ENV, configENV };
