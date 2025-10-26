declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: number;
            MONGODB_URI_DEV: string;
            MONGODB_URI_PROD?: string;
            JWT_EXPIRES_IN?: StringValue;
            SALT_ROUNDS:number
        }
    }
}


export { };
