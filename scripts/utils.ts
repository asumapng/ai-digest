import fs from 'fs';
import path from 'path';

export function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        let value = valueParts.join('=');
        // Remove trailing comments and whitespace
        value = value.split('#')[0].trim();
        // Remove quotes if present
        if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
          value = value.slice(1, -1);
        }
        process.env[key.trim()] = value;
      }
    }
  }
}
