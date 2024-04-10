import { registerAs } from '@nestjs/config';
import { DefaultPorts } from '@fit-friends/types';
import * as Joi from 'joi';

export interface SubscriberConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export default registerAs('subscribe', (): SubscriberConfig => {
  const config: SubscriberConfig = {
    host: process.env.MAIL_SMTP_HOST,
    port: parseInt(
      process.env.MAIL_SMTP_PORT ?? DefaultPorts.DefaultSmtpPort.toString(),
      10,
    ),
    user: process.env.MAIL_USER_NAME,
    password: process.env.MAIL_USER_PASSWORD,
    from: process.env.MAIL_FROM,
  };

  const validationSchema = Joi.object<SubscriberConfig>({
    host: Joi.string().valid().hostname().required(),
    port: Joi.number().port().default(DefaultPorts.DefaultSmtpPort),
    user: Joi.string().required(),
    password: Joi.string().required(),
    from: Joi.string().required(),
  });

  const { error } = validationSchema.validate(config, { abortEarly: true });
  if (error) {
    throw new Error(
      `[Subscriber Config]: Environments validation failed. Please check .env file.
       Error message: ${error.message}`,
    );
  }
  return config;
});
