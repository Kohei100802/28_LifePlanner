"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    name: z.string().min(1, "必須"),
    email: z.string().email("メール形式"),
    password: z.string().min(6, "6文字以上"),
    confirm: z.string().min(6, "6文字以上"),
  })
  .refine((v) => v.password === v.confirm, { message: "パスワード不一致", path: ["confirm"] });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) router.push("/auth/login");
  };

  return (
    <main className="min-h-dvh flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6 space-y-6">
        <h1 className="text-xl font-semibold text-center">アカウント作成</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input {...register("name")} placeholder="名前" className="w-full rounded-xl border px-4 py-3" />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          <input {...register("email")} placeholder="メールアドレス" className="w-full rounded-xl border px-4 py-3" />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          <input type="password" {...register("password")} placeholder="パスワード" className="w-full rounded-xl border px-4 py-3" />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          <input type="password" {...register("confirm")} placeholder="パスワード(確認)" className="w-full rounded-xl border px-4 py-3" />
          {errors.confirm && <p className="text-sm text-red-600">{errors.confirm.message}</p>}
          <button disabled={isSubmitting} className="w-full bg-black text-white rounded-xl py-3 active:opacity-80">
            作成する
          </button>
        </form>
        <button className="w-full text-sm text-gray-600" onClick={() => router.push("/auth/login")}>ログインへ</button>
      </div>
    </main>
  );
}


