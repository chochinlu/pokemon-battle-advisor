import { Zap } from "lucide-react"

export function Header() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
        寶可夢對戰系統
      </h1>
      <div className="flex items-center justify-center gap-2 text-white/80">
        <Zap className="w-6 h-6 text-yellow-400" />
        <span className="text-xl">POKEMON BATTLE ARENA</span>
        <Zap className="w-6 h-6 text-yellow-400" />
      </div>
    </div>
  )
} 