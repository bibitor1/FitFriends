import { IsNumber, IsString, Max, Min } from 'class-validator';
import { PortRange } from '@fit-friends/types';

export enum EnvValidationMessage {
  EnvironmentRequired = 'environment is required',
  PortRequired = 'port is required',
  ServeRootRequired = 'Serve root is required',
  HostRequired = 'Host is required',
  UploadDirectoryRequired = 'Upload directory is required',
}

export class AppEnvironment {
  @IsNumber(
    { maxDecimalPlaces: PortRange.MaxPort },
    {
      message: EnvValidationMessage.PortRequired,
    },
  )
  @Min(PortRange.MinPort)
  @Max(PortRange.MaxPort)
  public port: number;

  @IsString({
    message: EnvValidationMessage.EnvironmentRequired,
  })
  public environment: string;

  @IsString({
    message: EnvValidationMessage.ServeRootRequired,
  })
  public serveRoot: string;

  @IsString({
    message: EnvValidationMessage.HostRequired,
  })
  public host: string;

  @IsString({
    message: EnvValidationMessage.UploadDirectoryRequired,
  })
  public uploadDirectory: string;
}
