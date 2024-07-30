export interface ProcessEnv {
  readonly NODE_ENV: string;
  readonly PORT: string;
  readonly MONGODB_URI: string;
  readonly JWT_SECRET_KEY: string;
  readonly S3_BUCKET: string;
  readonly AWS_ACCESS_KEY: string;
  readonly AWS_SECRET_KEY: string;
}