import { MessageModerationSeverity, MessageModerationType } from "@prisma/client";
import { messageModerationSeverity } from "./config";

export type DetectedMessageFlag = {
  type: MessageModerationType;
  severity: MessageModerationSeverity;
  matchedRule: string;
  maskedText: string | null;
};

const profanityRules: Array<{ rule: string; pattern: RegExp; severity: MessageModerationSeverity }> = [
  { rule: "Türkçe küfür kısaltması", pattern: /\bamk\b|\baq\b|\bmk\b/i, severity: messageModerationSeverity.PROFANITY_MEDIUM },
  { rule: "Aileye yönelik hakaret", pattern: /orospu\s*çocuğu|anan[ıi]z?\s*sik|anan[ıi]\s*sikeyim/i, severity: messageModerationSeverity.PROFANITY_HIGH },
  { rule: "Ağır hakaret", pattern: /orospu|siktir|yarr?ak|piç|şerefsiz/i, severity: messageModerationSeverity.PROFANITY_MEDIUM },
  { rule: "Aşağılayıcı ifade", pattern: /gerizekalı|salak|aptal/i, severity: messageModerationSeverity.PROFANITY_LOW },
];

const externalContactRules: Array<{ rule: string; pattern: RegExp; severity: MessageModerationSeverity }> = [
  { rule: "WhatsApp yönlendirmesi", pattern: /what\s*s?app|wahtsapp/i, severity: messageModerationSeverity.EXTERNAL_CONTACT_MEDIUM },
  { rule: "Harici iletişim yönlendirmesi", pattern: /telegram|discord|instagram|sosyal\s*medya|d[ıi]şam?dan\s*konuş|ba[şs]ka\s*y?erden|özelden\s*yaz|\bdm\b/i, severity: messageModerationSeverity.EXTERNAL_CONTACT_LOW },
  { rule: "Telefonla iletişim yönlendirmesi", pattern: /numaram|telefon(?:dan)?|ara(?:yabilirsin)?/i, severity: messageModerationSeverity.EXTERNAL_CONTACT_LOW },
];

const suspiciousContentRule = /kapora|doğrulama\s*kodu|şifre(?:ni)?\s*paylaş|acil\s*ödeme/i;

function compactForDetection(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[.\-_\s]+/g, "");
}

function maskSensitive(value: string) {
  const compact = value.replace(/\s+/g, "");
  if (compact.length <= 4) return "***";
  return `${compact.slice(0, 2)}***${compact.slice(-2)}`;
}

function isValidTurkishPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const national = digits.startsWith("0090") ? digits.slice(4) : digits.startsWith("90") ? digits.slice(2) : digits;
  return /^(?:0?5[0-9]{9})$/.test(national);
}

function isValidIban(value: string) {
  const compact = value.replace(/\s+/g, "").toUpperCase();
  if (!/^TR[0-9]{2}[0-9A-Z]{22}$/.test(compact)) return false;
  const rearranged = `${compact.slice(4)}${compact.slice(0, 4)}`;
  const numeric = rearranged.replace(/[A-Z]/g, (letter) => String(letter.charCodeAt(0) - 55));
  let remainder = 0;
  for (const digit of numeric) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder === 1;
}

export function detectMessageFlags(content: string): DetectedMessageFlag[] {
  const flags: DetectedMessageFlag[] = [];
  const compact = compactForDetection(content);

  for (const item of profanityRules) {
    const spacedPattern = new RegExp(item.pattern.source.replace(/\\s\*/g, "[.\\s_-]*"), item.pattern.flags);
    if (item.pattern.test(content) || spacedPattern.test(content) || item.pattern.test(compact)) {
      flags.push({ type: "PROFANITY", severity: item.severity, matchedRule: item.rule, maskedText: null });
      break;
    }
  }

  const phoneMatch = content.match(/(?:\+?90|0090)?[\s.-]*0?5\d{2}[\s.-]*\d{3}[\s.-]*\d{2}[\s.-]*\d{2}/);
  if (phoneMatch && isValidTurkishPhone(phoneMatch[0])) flags.push({ type: "PHONE_NUMBER", severity: messageModerationSeverity.PHONE_NUMBER, matchedRule: "Türkiye telefon numarası", maskedText: maskSensitive(phoneMatch[0]) });

  const ibanMatch = content.match(/\bTR\s*[0-9]{2}(?:\s*[0-9A-Z]){22,26}\b/i);
  if (ibanMatch && isValidIban(ibanMatch[0])) flags.push({ type: "BANKING", severity: messageModerationSeverity.BANKING, matchedRule: "Geçerli Türkiye IBAN formatı", maskedText: maskSensitive(ibanMatch[0]) });

  for (const item of externalContactRules) {
    if (item.pattern.test(content) || item.pattern.test(compact)) {
      flags.push({ type: "EXTERNAL_CONTACT", severity: item.severity, matchedRule: item.rule, maskedText: null });
      break;
    }
  }

  if (suspiciousContentRule.test(content)) flags.push({ type: "SUSPICIOUS_CONTENT", severity: messageModerationSeverity.SUSPICIOUS_CONTENT, matchedRule: "Şüpheli ödeme veya hesap bilgisi talebi", maskedText: null });

  return flags;
}
