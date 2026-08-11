import fs from 'fs';
import path from 'path';

export interface ShareData {
  id: string;
  format: string;
  imageUrl: string;
  metadata: any;
  createdAt: number;
}

const SHARES_FILE = path.join(process.cwd(), 'shares.json');
const PUBLIC_SHARES_DIR = path.join(process.cwd(), 'public', 'shares');

function ensureDirectories() {
  if (!fs.existsSync(PUBLIC_SHARES_DIR)) {
    fs.mkdirSync(PUBLIC_SHARES_DIR, { recursive: true });
  }
  if (!fs.existsSync(SHARES_FILE)) {
    fs.writeFileSync(SHARES_FILE, JSON.stringify([]));
  }
}

export async function createShare(base64Image: string, format: string, metadata: any): Promise<ShareData> {
  ensureDirectories();
  
  // Create a short 6-char ID
  const id = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Base64 to buffer
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Write image
  const fileName = `${id}.png`;
  const filePath = path.join(PUBLIC_SHARES_DIR, fileName);
  fs.writeFileSync(filePath, buffer);
  
  const publicUrl = `/shares/${fileName}`;
  
  const shareData: ShareData = {
    id,
    format,
    imageUrl: publicUrl,
    metadata,
    createdAt: Date.now()
  };
  
  // Read existing and append
  const existing = JSON.parse(fs.readFileSync(SHARES_FILE, 'utf-8'));
  existing.push(shareData);
  fs.writeFileSync(SHARES_FILE, JSON.stringify(existing, null, 2));
  
  return shareData;
}

export async function getShare(id: string): Promise<ShareData | null> {
  ensureDirectories();
  const existing: ShareData[] = JSON.parse(fs.readFileSync(SHARES_FILE, 'utf-8'));
  const found = existing.find(s => s.id === id.toUpperCase());
  return found || null;
}
