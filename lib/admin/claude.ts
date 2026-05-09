import { spawn, ChildProcess } from 'child_process';
import path from 'path';

const PROJECT_DIR = process.cwd();

export function runClaude(prompt: string): ChildProcess {
  return spawn('claude', ['-p', prompt, '--cwd', PROJECT_DIR], {
    env: { ...process.env },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}
