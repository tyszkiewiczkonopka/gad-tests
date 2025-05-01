import { STORAGE_STATE } from '../@_pw-config';
import * as fs from 'fs';

async function globalSetup(): Promise<void> {
  if (fs.existsSync(STORAGE_STATE)) {
    fs.unlinkSync(STORAGE_STATE);
  }
  // console.log('⚠️ Global setup - storage state deleted');
}

export default globalSetup;
