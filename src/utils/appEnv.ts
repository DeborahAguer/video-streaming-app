import { ProcessEnv } from '@interfaces/env-interface';
import dotenv from 'dotenv';
dotenv.config();

const appEnv = (variableName: keyof ProcessEnv | string): string => {
  const value = process.env[variableName];

  if (variableName && value) {
    return value;
  } else {
    throw new Error(
      `Variable {name: ${variableName}, value: ${value}} - not found in .env file`
    );
  }
};

export default appEnv;
