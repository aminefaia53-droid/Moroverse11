'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("GLOBAL ERROR BOUNDARY CAUGHT:", error)
  }, [error])

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center p-8 bg-red-950 text-white z-[9999] fixed inset-0 overflow-auto">
      <div className="max-w-4xl w-full bg-black/50 p-6 rounded-xl border border-red-500/30">
        <h2 className="text-3xl font-bold mb-4 text-red-400">🚨 CRITICAL CLIENT CRASH 🚨</h2>
        <div className="mb-4">
          <p className="font-bold text-gray-300">Error Name:</p>
          <pre className="p-3 bg-white/5 rounded text-red-300 whitespace-pre-wrap font-mono text-sm">{error.name}</pre>
        </div>
        <div className="mb-4">
          <p className="font-bold text-gray-300">Error Message:</p>
          <pre className="p-3 bg-white/5 rounded text-red-200 whitespace-pre-wrap font-mono text-sm">{error.message}</pre>
        </div>
        <div className="mb-6">
          <p className="font-bold text-gray-300">Stack Trace:</p>
          <pre className="p-3 bg-white/5 rounded text-gray-400 whitespace-pre-wrap font-mono text-xs overflow-x-auto">{error.stack}</pre>
        </div>
        <button
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-colors"
          onClick={() => reset()}
        >
          Attempt Recovery
        </button>
      </div>
    </div>
  )
}
