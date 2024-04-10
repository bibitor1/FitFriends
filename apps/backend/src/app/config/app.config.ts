import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { AppEnvironment } from './app-environment';
import { plainToInstance } from 'class-transformer';
import { DefaultPorts } from '@fit-friends/types';

const DEFAULT_ENVIRONMENT = 'development';

export interface ApplicationConfig {
  environment: string;
  port: number;
  host: string;
  serveRoot: string;
  uploadDirectory: string;
}

export default registerAs('application', (): ApplicationConfig => {
  const config: ApplicationConfig = {
    environment: process.env.NODE_ENV || DEFAULT_ENVIRONMENT,
    port: parseInt(process.env.PORT || DefaultPorts.DefaultPort.toString(), 10),
    host: process.env.HOST || 'http://localhost',
    serveRoot: process.env.SERVE_ROOT || '/static',
    uploadDirectory: process.env.UPLOAD_DIRECTORY_PATH || '/uploads',
  };
  const appEnvironment = plainToInstance(AppEnvironment, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(appEnvironment, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
});
