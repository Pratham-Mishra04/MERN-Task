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
    ACCESS_TOKEN_TTL: string;
    REFRESH_TOKEN_TTL: string;
    EMAIL_HOST: string;
    EMAIL_PORT: string;
    EMAIL_USER: string;
    EMAIL_USERNAME: string;
    EMAIL_PASS: string;
}

const ENV: ENV_struct = {
    NODE_ENV: 'development',
    PORT: '8000',
    FRONTEND_URL: 'http://127.0.0.1:3000',
    DATABASE_URL: 'mongo_url',
    DATABASE_PASSWORD: 'password',
    JWT_KEY: 'secret',
    ACCESS_TOKEN_TTL: '15', // minutes
    REFRESH_TOKEN_TTL: '15', // days
    EMAIL_HOST: '',
    EMAIL_PORT: '',
    EMAIL_USER: '',
    EMAIL_USERNAME: '',
    EMAIL_PASS: '',
};

const configENV = (): void => {
    Object.keys(ENV).forEach(envKey => {
        const key = envKey;
        const val = process.env[key];

        if (val === undefined) {
            console.error(`Fatal Error: Missing required environment variable: ${key}`);
            process.exit();
        }

        if (key == 'NODE_ENV' && val != 'development' && val != 'production') {
            console.error(`Fatal Error: Invalid environment variable: ${key}`);
            process.exit();
        }

        ENV[key] = val;
    });
    console.log('- All Environment Variables Present');
};

export { ENV, configENV };
