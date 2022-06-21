module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: 'Z',
  synchronize: false,
  logging: true,
  entities: ['dist/app/database/entities/*.entity.{js,ts}'],
  migrations: ['dist/app/database/migrations/**/*.{js,ts}'],
  migrationsTableName: 'system_migrations',
  cli: {
    entitiesDir: 'src/app/database/entities',
    migrationsDir: 'src/app/database/migrations',
  },
};
