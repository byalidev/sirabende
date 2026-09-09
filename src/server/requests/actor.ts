import "server-only";

import { requireUser } from "../auth/auth";

export async function getRequestActor() {
  const user = await requireUser();
  return { id: user.id, isActive: user.isActive };
}
