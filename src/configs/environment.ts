export const environment = {
  port: process.env.PORT ?? 3000,
  mongoose: {
    host: process.env.MONGO_INITDB_HOST ?? 'database',
    port: process.env.MONGO_INITDB_PORT ?? 27017,
    user: process.env.MONGO_INITDB_ROOT_USERNAME ?? 'mongo',
    password: process.env.MONGO_INITDB_ROOT_PASSWORD ?? 'password',
    db: process.env.MONGO_INITDB_DATABASE ?? 'titere-test-db',
    options: {}
  }
};
