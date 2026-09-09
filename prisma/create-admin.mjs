import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";
import readline from "node:readline";

const prisma = new PrismaClient();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function ask(question, hidden = false) {
  return new Promise((resolve) => {
    if (!hidden) return rl.question(question, resolve);
    process.stdout.write(question); let answer = "";
    const onData = (chunk) => { const value = chunk.toString(); if (value === "\r" || value === "\n") { process.stdin.setRawMode(false); process.stdin.pause(); process.stdin.removeListener("data", onData); process.stdout.write("\n"); resolve(answer); return; } if (value === "\u0003") process.exit(1); if (value === "\u007f") { answer = answer.slice(0, -1); return; } answer += value; process.stdout.write("*"); };
    process.stdin.resume(); process.stdin.setRawMode(true); process.stdin.on("data", onData);
  });
}
function hashPassword(password) { const salt = randomBytes(16).toString("hex"); return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`; }
async function main() {
  const firstName = (await ask("Ad: ")).trim(); const lastName = (await ask("Soyad: ")).trim(); const username = (await ask("Kullanıcı adı: ")).trim().toLowerCase(); const email = (await ask("E-posta: ")).trim().toLowerCase(); const phone = (await ask("Telefon: ")).trim(); const password = await ask("Şifre: ", true);
  if (!firstName || !lastName || !phone || !/^[a-z0-9_.-]{3,30}$/.test(username) || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) throw new Error("Bilgiler geçersiz veya şifre 8 karakterden kısa.");
  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] }, include: { userRoles: { include: { role: true } } } }); const role = await prisma.role.upsert({ where: { name: "ADMIN" }, update: {}, create: { name: "ADMIN", description: "Yönetici" } });
  if (existing) { if (existing.userRoles.some((item) => item.role.name === "ADMIN" || item.role.name === "SUPER_ADMIN")) throw new Error("Bu kullanıcı zaten admin."); await prisma.userRole.create({ data: { userId: existing.id, roleId: role.id } }); console.log("Mevcut kullanıcıya ADMIN rolü verildi."); return; }
  const user = await prisma.user.create({ data: { firstName, lastName, username, email, phone, passwordHash: hashPassword(password), userRoles: { create: { roleId: role.id } } } }); console.log(`Admin oluşturuldu: ${user.username}`);
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect().then(() => rl.close()));
