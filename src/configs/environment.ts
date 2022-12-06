export const environment = {
  port: process.env.PORT ?? 3000,
  mongoose: {
    port: process.env.MONGO_INITDB_PORT ?? 27017,
    user: process.env.MONGO_INITDB_ROOT_USERNAME ?? 'mongo',
    password: process.env.MONGO_INITDB_ROOT_PASSWORD ?? 'password',
    db: process.env.MONGO_INITDB_DATABASE ?? 'test',
    options: {}
  }
};
