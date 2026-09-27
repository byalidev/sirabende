export function resolvePostLoginPath(target?: string | null) {
  if (!target) return "/talepler";
  if (target.startsWith("/") && !target.startsWith("//")) {
    return target;
  }
  return "/talepler";
}
