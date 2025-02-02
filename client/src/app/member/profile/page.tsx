"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  useEffect(() => {
    return router.push("/member/profile/basic-details");
  });
  return null;
}
