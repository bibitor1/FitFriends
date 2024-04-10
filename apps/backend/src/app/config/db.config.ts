import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { DatabaseEnvironment } from './db-environment';
import { plainToInstance } from 'class-transformer';
import { DefaultPorts } from '@fit-friends/types';

export interface DbConfig {
  name: string;
  port: number;
  user: string;
  password: string;
  pgAdminEmail: string;
  pgAdminPassword: string;
}

export default registerAs('db', (): DbConfig => {
  const config: DbConfig = {
    user: process.env['POSTGRES_USER'] ?? 'admin',
    password: process.env['POSTGRES_PASSWORD'] ?? 'test',
    name: process.env['POSTGRES_DB'] ?? 'fitfriends',
    port: parseInt(
      process.env['POSTGRES_PORT '] ??
        DefaultPorts.DefaultPostgresPort.toString(),
      10,
    ),
    pgAdminEmail:
      process.env['PGADMIN_DEFAULT_EMAIL'] ?? 'keks@htmlacademy.local',
    pgAdminPassword: process.env['PGADMIN_DEFAULT_PASSWORD'] ?? 'test',
  };

  const databaseEnvironment = plainToInstance(DatabaseEnvironment, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(databaseEnvironment, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
});
