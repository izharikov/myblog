import { mkdir, writeFile } from 'node:fs/promises';

const user = 'igor-zharikov';
const imageDir = 'src/images/credly';
const dataFile = 'src/data/credly.json';
const extensions = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' };

const response = await fetch(`https://www.credly.com/users/${user}/badges.json`);
if (!response.ok) throw new Error(`Credly responded ${response.status}`);
const { data } = await response.json();

await mkdir(imageDir, { recursive: true });

const badges = [];
for (const badge of data) {
  const image = await fetch(badge.image_url);
  if (!image.ok) throw new Error(`Image ${badge.image_url} responded ${image.status}`);
  const ext = extensions[image.headers.get('content-type')?.split(';')[0]] ?? 'png';
  await writeFile(`${imageDir}/${badge.id}.${ext}`, Buffer.from(await image.arrayBuffer()));
  badges.push({
    id: badge.id,
    name: badge.badge_template.name,
    issuer: badge.issuer.entities.find(e => e.primary)?.entity.name ?? badge.issuer.entities[0]?.entity.name,
    issuedAt: badge.issued_at_date,
    expiresAt: badge.expires_at_date,
    image: `/images/credly/${badge.id}.${ext}`,
    url: `https://www.credly.com/badges/${badge.id}`,
  });
}

badges.sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
await writeFile(dataFile, JSON.stringify(badges, null, 2) + '\n');
console.log(`Saved ${badges.length} badges to ${dataFile}`);
