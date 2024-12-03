"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      router.replace("/dashboard");
      return;
    }
  }, [router]);

  return <></>;

  // );
}
