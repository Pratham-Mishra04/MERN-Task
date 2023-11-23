import * as dotenv from 'dotenv';

dotenv.config();

interface ENV_struct {
    NODE_ENV: string;
    PORT: string;
    DATABASE_URL: string;
    DATABASE_PASSWORD: string;
}

const ENV: ENV_struct = {
    NODE_ENV: 'development',
    PORT: '8000',
    DATABASE_URL: '',
    DATABASE_PASSWORD: '',
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
