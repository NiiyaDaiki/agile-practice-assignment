import "next-auth";
import { MembershipStatus } from "@/lib/constants";

declare module "next-auth" {
  interface User {
    status?: MembershipStatus;
  }

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

declare module "next-auth/jwt" {
  interface JWT {
    status?: MembershipStatus;
  }
}
