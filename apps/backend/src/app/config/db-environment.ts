import { IsNumber, IsString, Max, Min } from 'class-validator';
import { PortRange } from '@fit-friends/types';

export enum EnvValidationMessage {
  DBpgAdminEmailRequired = 'pgAdmin email is required',
  DBNameRequired = 'Database name is required',
  DBPortRequired = 'DB port is required',
  DBUserRequired = 'DB user is required',
  DBPasswordRequired = 'DB password is required',
  DBpgAdminPasswordRequired = 'pgAdmin password is required',
}

export class DatabaseEnvironment {
  @IsString({
    message: EnvValidationMessage.DBNameRequired,
  })
  public name: string;

  @IsNumber(
    {},
    {
      message: EnvValidationMessage.DBPortRequired,
    },
  )
  @Min(PortRange.MinPort)
  @Max(PortRange.MaxPort)
  public port: number;

  @IsString({
    message: EnvValidationMessage.DBpgAdminEmailRequired,
  })
  public pgAdminEmail: string;

  @IsString({
    message: EnvValidationMessage.DBUserRequired,
  })
  public user: string;

  @IsString({
    message: EnvValidationMessage.DBPasswordRequired,
  })
  public password: string;

  @IsString({
    message: EnvValidationMessage.DBpgAdminPasswordRequired,
  })
  public pgAdminPassword: string;
}
