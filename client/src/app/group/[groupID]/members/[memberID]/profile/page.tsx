"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getParamGroupIDAndMemberID } from "./wishlists/page";

export default function ProfilePage() {
  const router = useRouter();
  const { groupID, memberID } = getParamGroupIDAndMemberID(usePathname());

  useEffect(() => {
    return router.push(
      `/group/${groupID}/members/${memberID}/profile/basic-details`
    );
  });
  return null;
}
