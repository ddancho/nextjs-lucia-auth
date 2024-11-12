// local development - mailhog
type MailService = "mailhog";

type MailerConfiguration = {
  host: string;
  port: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
};

const mailService: Record<MailService, MailerConfiguration> = {
  mailhog: { host: "localhost", port: 1025, secure: false },
};

export const mailhog = mailService.mailhog;
