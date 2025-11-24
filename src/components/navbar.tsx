export default function Navbar() {
  return (
    <header className="flex items-center justify-between w-full text-white">
      <div className="inline-flex items-center gap-2">
        <div className="h-8 w-8 grid place-items-center rounded-lg bg-yellow-400 text-black font-bold">
          A
        </div>

        {/* AQUI ESTAVA O PROBLEMA */}
        <span className="text-base font-semibold text-white">
          Academia <span className="text-yellow-400">Pro</span>
        </span>
      </div>

      <span className="text-sm text-gray-400">
        {new Date().toLocaleDateString()}
      </span>
    </header>
  );
}
