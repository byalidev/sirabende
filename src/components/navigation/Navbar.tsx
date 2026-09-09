import { getCurrentUser } from "../../server/auth/auth";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const user = await getCurrentUser();
  return <NavbarClient user={user ? { firstName: user.firstName, username: user.username } : null} />;
}
