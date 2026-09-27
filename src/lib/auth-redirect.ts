export function resolvePostLoginPath(target?: string | null) {
  if (!target) return "/";
  if (target.startsWith("/") && !target.startsWith("//")) {
    return target;
  }
  return "/";
}
