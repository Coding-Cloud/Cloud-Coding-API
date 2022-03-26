import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST as string,
  port: process.env.DATABASE_PORT as unknown as number,
  username: process.env.DATABASE_USER as string,
  password: process.env.DATABASE_PASSWORD as string,
  database: 'nest_cloud_4',
  synchronize: false,
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  migrationsRun: true,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  //autoLoadEntities: true,
  cli: {
    migrationsDir: 'src/infrastructure/config/migrations',
  },
};

export default config;
