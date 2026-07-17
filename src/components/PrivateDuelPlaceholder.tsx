type PrivateDuelPlaceholderProps = {
  onBack: () => void;
};

export function PrivateDuelPlaceholder({ onBack }: PrivateDuelPlaceholderProps) {
  return (
    <section className="w-full max-w-lg rounded-[1.75rem] border border-white/75 bg-white/90 px-5 py-7 text-center shadow-[0_20px_58px_rgba(15,23,42,0.2)] backdrop-blur sm:px-8 sm:py-9">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-3xl shadow-[0_12px_26px_rgba(37,99,235,0.28)]" aria-hidden="true">
        {"⚔️"}
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">1 CONTRA 1</p>
      <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">Duelo personalizado</h1>
      <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-6 text-slate-700 sm:text-base">
        Crie uma sala e convide um amigo para jogar
      </p>
      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        <button type="button" className="rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-500 px-5 py-3.5 text-sm font-black text-white shadow-[0_12px_24px_rgba(37,99,235,0.28)] focus:outline-none focus:ring-4 focus:ring-sky-200">Criar duelo</button>
        <button type="button" className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3.5 text-sm font-black text-sky-900 focus:outline-none focus:ring-4 focus:ring-sky-100">Entrar com código</button>
      </div>
      <button type="button" onClick={onBack} className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200">Voltar</button>
    </section>
  );
}