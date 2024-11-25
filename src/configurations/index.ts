import * as process from "process";

export default () => ({
    port: process.env.PORT,
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    db_name: process.env.DB_NAME,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,

    secret_jwt: process.env.SECRET,
    expire_jwt_sec: process.env.EXPIRE_JWT_SEC
})
