import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh bg-gray-50 p-4 pb-28">
      <header className="flex items-center justify-between py-2">
        <h1 className="text-lg font-semibold">LifePlanner</h1>
        <Link href="/auth/login" className="text-sm text-blue-600">ログイン</Link>
      </header>

      <section className="mt-6 space-y-3">
        <Link href="/sim" className="block rounded-2xl bg-white shadow p-5 active:scale-[0.99]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium">シミュレーター</p>
              <p className="text-gray-500 text-sm">年齢別に収入/支出/収支を可視化</p>
            </div>
            <span className="text-2xl">›</span>
          </div>
        </Link>
      </section>

      <nav className="fixed inset-x-0 bottom-0 h-16 bg-white/95 backdrop-blur border-t flex items-center justify-around">
        <Link href="/" className="flex flex-col items-center text-xs">
          <span>ホーム</span>
        </Link>
        <Link href="/sim" className="flex flex-col items-center text-xs">
          <span>シミュレーター</span>
        </Link>
        <Link href="/account" className="flex flex-col items-center text-xs">
          <span>アカウント</span>
        </Link>
      </nav>
    </main>
  );
}
