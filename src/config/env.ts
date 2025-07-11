
const env = {
    PORT:process.env.PORT as string,
    VERSION: process.env.VERSION,
    SECRET_KEY: process.env.SECRET_KEY as string,
    REDIS_PORT: process.env.REDIS_PORT as string,
    KAFKA_HOST:process.env.KAFKA_HOST as string
}

Object.freeze(env)
export {env} 

