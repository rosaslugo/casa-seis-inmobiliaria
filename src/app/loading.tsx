export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-9 h-9 border-2 border-action-ghostBorder border-t-action-primary rounded-full"
          style={{ animation: 'spin 0.8s linear infinite' }}
        />
        <p
          className="text-[10px] font-bold tracking-[0.22em] uppercase"
          style={{ color: 'var(--stone-400)' }}
        >
          Cargando
        </p>
      </div>
    </div>
  )
}
