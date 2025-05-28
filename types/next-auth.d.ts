import "next-auth";
import { MembershipStatus } from "@/lib/constants";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      status?: MembershipStatus;
    };
  }
}
