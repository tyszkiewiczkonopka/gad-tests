import * as dotenv from 'dotenv';

dotenv.config({ override: true }); // Load environment variables from .env file before any other code runs

function getEnvVariable(envVariable: string): string {
  const envVariableValue = process.env[envVariable];
  if (envVariableValue === undefined) {
    throw new Error(`Environment variable ${envVariable} is not defined`);
  }
  return envVariableValue;
}

export const BASE_URL = getEnvVariable('BASE_URL');
export const USER_EMAIL = getEnvVariable('USER_EMAIL');
export const USER_PASSWORD = getEnvVariable('USER_PASSWORD');
