import "server-only";

import { Resend } from "resend";

let client: Resend | null = null;

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY tanımlı değil. Lütfen .env.local dosyasına ekleyin.");
  if (!client) client = new Resend(apiKey);
  return client;
}

function getFromAddress() {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM tanımlı değil. Lütfen .env.local dosyasına ekleyin.");
  return from;
}

export async function sendVerificationEmail(to: string, code: string) {
  const resend = getClient();
  const from = getFromAddress();
  const subject = "My Turn e-posta doğrulama kodunuz";
  const text = `My Turn doğrulama kodunuz: ${code}\n\nBu kod 10 dakika boyunca geçerlidir.\n\nBu işlemi siz yapmadıysanız hesabınızı kontrol etmenizi öneririz.`;
  const html = `
    <div style="margin: 0; padding: 0; background-color: #f5f7fb; font-family: Arial, Helvetica, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
        <div style="background-color: #ffffff; border: 1px solid #e6ebf2; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%); padding: 24px 20px; text-align: center;">
            <div style="font-size: 28px; line-height: 1.2; font-weight: 700; letter-spacing: 0.4px; color: #ffffff;">My Turn</div>
          </div>

          <div style="padding: 32px 24px 24px; text-align: center; color: #1f2937;">
            <div style="font-size: 20px; line-height: 1.4; font-weight: 700; margin-bottom: 12px; color: #111827;">E-posta adresinizi doğrulayın</div>
            <div style="font-size: 15px; line-height: 1.7; color: #4b5563; margin: 0 auto 26px; max-width: 420px;">
              Hesabınızı güvence altına almak için aşağıdaki 6 haneli doğrulama kodunu kullanın.
            </div>

            <div style="display: inline-block; background-color: #f8fafc; border: 1px solid #dfe7f1; border-radius: 14px; padding: 18px 22px; margin: 0 auto 18px; min-width: 210px;">
              <div style="font-size: 36px; line-height: 1; font-weight: 800; letter-spacing: 10px; color: #0f172a; text-align: center;">${code}</div>
            </div>

            <div style="font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 20px;">
              Kod <strong style="color: #111827;">10 dakika</strong> geçerlidir.
            </div>

            <div style="font-size: 13px; line-height: 1.7; color: #6b7280; max-width: 440px; margin: 0 auto;">
              İşlemi siz başlatmadıysanız maili yok sayabilirsiniz.
            </div>
          </div>

          <div style="padding: 20px 24px 26px; border-top: 1px solid #edf2f7; text-align: center; background-color: #fbfdff;">
            <div style="font-size: 13px; line-height: 1.5; color: #475569; letter-spacing: 0.2px;">
              My Turn • wwwmyturn.com
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  const { error } = await resend.emails.send({ from, to, subject, text, html });
  if (error) throw new Error(`Doğrulama e-postası gönderilemedi: ${error.message}`);
}
