 const env = {
    PORT:process.env.PORT as string,
    VERSION: process.env.VERSION,
    SECRET_KEY: process.env.SECRET_KEY as string
}

Object.freeze(env)
export {env} 

