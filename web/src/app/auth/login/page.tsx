"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const schema = z.object({
  email: z.string().email("メール形式"),
  password: z.string().min(6, "6文字以上"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl,
    });
    if (!res) return;
    if (res.ok) router.push(callbackUrl);
  };

  return (
    <main className="min-h-dvh flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6 space-y-6">
        <h1 className="text-xl font-semibold text-center">ログイン</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input {...register("email")} placeholder="メールアドレス" className="w-full rounded-xl border px-4 py-3" />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          <input type="password" {...register("password")} placeholder="パスワード" className="w-full rounded-xl border px-4 py-3" />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          <button disabled={isSubmitting} className="w-full bg-black text-white rounded-xl py-3 active:opacity-80">
            ログイン
          </button>
        </form>
        <button className="w-full text-sm text-gray-600" onClick={() => router.push("/auth/register")}>新規登録</button>
      </div>
    </main>
  );
}


