import { mkdir } from 'fs/promises';
import path from 'path';
import { Page, TestInfo } from '@playwright/test';
import { slugify, timestamp } from './utils';

function buildArtifactPath(testInfo: TestInfo, label: string) {
  const segments = testInfo.titlePath.slice(0, -1).map((segment) => slugify(segment));
  const dir = path.join('artifacts', ...segments);
  const fileName = `${slugify(label)}-${timestamp()}.png`;
  const filePath = path.join(dir, fileName);

  return { dir, filePath };
}

export async function captureScreenshot(
  testInfo: TestInfo,
  page: Page,
  label: string,
  options: { fullPage?: boolean } = {}
) {
  const { dir, filePath } = buildArtifactPath(testInfo, label);
  await mkdir(dir, { recursive: true });

  await page.screenshot({
    path: filePath,
    fullPage: options.fullPage ?? true
  });

  await testInfo.attach(label, {
    path: filePath,
    contentType: 'image/png'
  });

  return filePath;
}

export async function attachText(
  testInfo: TestInfo,
  label: string,
  body: string
) {
  await testInfo.attach(label, {
    body,
    contentType: 'text/plain'
  });
}

