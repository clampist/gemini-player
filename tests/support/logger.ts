import { appendFile, mkdir } from 'fs/promises';
import path from 'path';
import { TestInfo } from '@playwright/test';

const LOG_DIR = 'logs';
const LOG_FILE = 'playwright.log';

export async function logMessage(testInfo: TestInfo, message: string) {
  const timestamp = new Date().toISOString();
  const scope = testInfo.titlePath.join(' > ');
  const line = `[${timestamp}] [${scope}] ${message}\n`;

  await mkdir(LOG_DIR, { recursive: true });
  await appendFile(path.join(LOG_DIR, LOG_FILE), line, 'utf8');
}

