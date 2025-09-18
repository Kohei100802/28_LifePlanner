"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Row = { id: string; age: number; kind: "income" | "expense"; label: string; amount: number };

export default function SimPage() {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login?callbackUrl=/sim");
  }, [status, router]);

  const [baseAge, setBaseAge] = useState<number>(20);
  const [rows, setRows] = useState<Row[]>([
    { id: crypto.randomUUID(), age: 25, kind: "income", label: "給与", amount: 400 },
    { id: crypto.randomUUID(), age: 25, kind: "expense", label: "家賃", amount: 120 },
  ]);
  const [title, setTitle] = useState<string>("マイプラン");

  const addRow = (kind: "income" | "expense") => {
    setRows((prev) => [...prev, { id: crypto.randomUUID(), age: baseAge, kind, label: "", amount: 0 }]);
  };
  const updateRow = (id: string, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };
  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  // 年齢毎合計: 収入/支出/収支
  const chartData = useMemo(() => {
    const ages = Array.from(new Set(rows.map((r) => r.age))).sort((a, b) => a - b);
    return ages.map((age) => {
      const income = rows.filter((r) => r.age === age && r.kind === "income").reduce((s, r) => s + r.amount, 0);
      const expense = rows.filter((r) => r.age === age && r.kind === "expense").reduce((s, r) => s + r.amount, 0);
      return { age, income, expense, balance: income - expense };
    });
  }, [rows]);

  return (
    <main className="min-h-dvh bg-gray-50 pb-28">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-base font-semibold">シミュレーター</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => addRow("income")} className="rounded-full bg-emerald-600 text-white px-3 py-1.5 text-xs">収入追加</button>
          <button onClick={() => addRow("expense")} className="rounded-full bg-rose-600 text-white px-3 py-1.5 text-xs">支出追加</button>
          <button
            onClick={async () => {
              const res = await fetch("/api/simulations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, baseAge, entries: rows }),
              });
              if (res.ok) alert("保存しました");
            }}
            className="rounded-full bg-blue-600 text-white px-3 py-1.5 text-xs"
          >
            保存
          </button>
        </div>
      </header>

      <section className="px-4 pt-4 space-y-4">
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <label className="text-sm text-gray-600">タイトル</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
          <div className="h-2" />
          <label className="text-sm text-gray-600">開始年齢</label>
          <input
            type="number"
            value={baseAge}
            onChange={(e) => setBaseAge(parseInt(e.target.value || "0", 10))}
            className="w-28 rounded-xl border px-3 py-2"
          />
        </div>

        <div className="bg-white rounded-2xl shadow p-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="p-2">年齢</th>
                <th className="p-2">区分</th>
                <th className="p-2">名称</th>
                <th className="p-2">金額(万円)</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2 w-20">
                    <input type="number" value={r.age} onChange={(e) => updateRow(r.id, { age: parseInt(e.target.value || "0", 10) })} className="w-20 rounded-xl border px-2 py-1" />
                  </td>
                  <td className="p-2 w-24">
                    <select value={r.kind} onChange={(e) => updateRow(r.id, { kind: e.target.value as Row["kind"] })} className="w-24 rounded-xl border px-2 py-1">
                      <option value="income">収入</option>
                      <option value="expense">支出</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input value={r.label} onChange={(e) => updateRow(r.id, { label: e.target.value })} className="w-full rounded-xl border px-2 py-1" placeholder="名称" />
                  </td>
                  <td className="p-2 w-32">
                    <input type="number" value={r.amount} onChange={(e) => updateRow(r.id, { amount: parseInt(e.target.value || "0", 10) })} className="w-28 rounded-xl border px-2 py-1" />
                  </td>
                  <td className="p-2 w-14 text-right">
                    <button onClick={() => removeRow(r.id)} className="text-rose-600">削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" tickFormatter={(v) => `${v}歳`} />
                <YAxis tickFormatter={(v) => `${v}万`} />
                <Tooltip formatter={(v: number) => `${v}万円`} labelFormatter={(l) => `${l}歳`} />
                <Legend />
                <Line type="monotone" dataKey="income" name="収入" stroke="#059669" strokeWidth={2} />
                <Line type="monotone" dataKey="expense" name="支出" stroke="#e11d48" strokeWidth={2} />
                <Line type="monotone" dataKey="balance" name="収支" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <nav className="fixed inset-x-0 bottom-0 h-16 bg-white/95 backdrop-blur border-t flex items-center justify-around">
        <span className="text-xs">ホーム</span>
        <span className="text-xs font-semibold">シミュレーター</span>
        <span className="text-xs">アカウント</span>
      </nav>
    </main>
  );
}


