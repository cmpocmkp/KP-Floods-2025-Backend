export interface IAppEnv {
  env: string;
  db: {
    connectionUrl: string;
  };
  server: {
    port: number;
    allowedClients: string[];
  };
}

export interface IDb {
  connectionUrl: string;
}

export interface IRoot {
  env: string;
}

export interface IServer {
  port: number;
  allowedClients: string[];
}

export interface ISendGridApiKey {
  sendGridApiKey: string;
}

export interface ITwilioSid {
  twilioSid: string;
}

export interface ITwilioAuthToken {
  twilioAuthToken: string;
}

export interface ITwilioPhoneNumber {
  twilioPhoneNumber: string;
}

export interface IEmailFrom {
  emailFrom: string;
}

export interface IOtpExpiryInMinutes {
  otpExpiryInMinutes: string;
}

export interface IPlatformInvitationExpiryInDays {
  platformInvitationExpiryInDays: string;
}

export interface ICustomDomainBaseUrl {
  customDomainBaseUrl: string;
}

export interface IS3SecretAccessKey {
  s3SecretAccessKey: string;
}

export interface IS3AccessKeyId {
  s3AccessKeyId: string;
}

export interface IS3Region {
  s3Region: string;
}

export interface IS3BucketName {
  s3BucketName: string;
}

export interface IOtpEmailLinkBaseUrl {
  otpEmailLinkBaseUrl: string;
}

export interface IOtpForgotPasswordBaseUrl {
  otpForgotPasswordBaseUrl: string;
}

export interface IJwtSecret {
  jwtSecret: string;
}

export interface IOnboardingInvitationBaseUrl {
  onboardingInvitationBaseUrl: string;
}
