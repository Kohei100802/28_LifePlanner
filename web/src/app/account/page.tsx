"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { status, data } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login?callbackUrl=/account");
  }, [status, router]);

  if (status !== "authenticated") return null;
  return (
    <main className="min-h-dvh bg-gray-50 p-4 pb-28">
      <h1 className="text-lg font-semibold">アカウント</h1>
      <div className="mt-4 bg-white rounded-2xl shadow p-4">
        <p className="text-sm">{data.user?.email}</p>
      </div>
      <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-6 rounded-xl bg-black text-white px-4 py-3">
        ログアウト
      </button>
    </main>
  );
}


