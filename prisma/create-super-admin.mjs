import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";
import readline from "node:readline";

const prisma = new PrismaClient();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function ask(question, hidden = false) {
  return new Promise((resolve) => {
    if (!hidden) return rl.question(question, resolve);
    process.stdout.write(question); let answer = "";
    const onData = (chunk) => { const value = chunk.toString(); if (value === "\r" || value === "\n") { process.stdin.setRawMode(false); process.stdin.pause(); process.stdin.removeListener("data", onData); process.stdout.write("\n"); resolve(answer); return; } if (value === "\u0003") process.exit(1); if (value === "\u007f") { answer = answer.slice(0, -1); return; } answer += value; };
    process.stdin.resume(); process.stdin.setRawMode(true); process.stdin.on("data", onData);
  });
}
function hashPassword(password) { const salt = randomBytes(16).toString("hex"); return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`; }
async function main() {
  const existing = await prisma.user.findFirst({ where: { OR: [{ ownerKey: "SUPER_ADMIN_OWNER" }, { userRoles: { some: { role: { name: "SUPER_ADMIN" } } } }] }, select: { id: true } });
  if (existing) { console.log("A SUPER_ADMIN account already exists."); return; }
  const username = (await ask("Username: ")).trim().toLowerCase();
  const password = await ask("Password: ", true);
  if (!/^[a-z0-9_.-]{3,30}$/.test(username) || password.length < 8) throw new Error("Username is invalid or password is shorter than 8 characters.");
  const duplicate = await prisma.user.findFirst({ where: { username }, select: { id: true } });
  if (duplicate) throw new Error("This username is already in use.");
  const role = await prisma.role.upsert({ where: { name: "SUPER_ADMIN" }, update: {}, create: { name: "SUPER_ADMIN", description: "Platform owner" } });
  const user = await prisma.user.create({ data: { username, email: `${username}@owner.local`, ownerKey: "SUPER_ADMIN_OWNER", passwordHash: hashPassword(password), userRoles: { create: { roleId: role.id } } } });
  console.log(`SUPER_ADMIN created: ${user.username}`);
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect().then(() => rl.close()));