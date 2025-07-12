import { Badge } from "@/components/ui/badge"
import { typeColors } from "@/data/pokemon"
import { convertTypesToChinese } from "@/lib/pokemon-utils"
import { Pokemon } from "@/types/pokemon"
import React from "react"

interface PokemonCardProps {
  pokemon: Pokemon
  slotIndex?: number
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, slotIndex }) => {
  const getDisplayTypes = (types: string[]) => convertTypesToChinese(types)
  return (
    <div className="relative w-full h-[370px] flex flex-row items-center justify-center">
      {/* 左欄：圖片、名稱、屬性 */}
      <div className="flex flex-col items-center justify-center flex-1 min-w-0">
        {typeof slotIndex === 'number' && (
          <div className="text-lg font-bold text-yellow-400 mb-1">位置 {slotIndex + 1}</div>
        )}
        <div className="flex flex-col items-center mb-2">
          <img
            src={pokemon.image || "/placeholder.svg"}
            alt={pokemon.name}
            className="w-40 h-40 mx-auto mb-2 object-contain drop-shadow-xl"
            style={{ maxWidth: '100%', maxHeight: '180px' }}
          />
        </div>
        <div className="mb-1 w-full text-center">
          <div className="text-2xl font-extrabold text-white leading-tight truncate">{pokemon.chineseName}</div>
          <div className="text-xl text-white/80 font-bold truncate">{pokemon.name}</div>
          <div className="text-lg text-white/60 font-semibold truncate">{pokemon.japaneseName}</div>
        </div>
        <div className="flex justify-center gap-2 mb-1 flex-wrap">
          {getDisplayTypes(pokemon.types).map((type: string) => (
            <Badge key={type} className={`${typeColors[type]} text-white text-xl px-4 py-1`}>{type}</Badge>
          ))}
        </div>
      </div>
      {/* 右欄：弱點與抗性 */}
      <div className="flex flex-col items-start justify-center flex-1 min-w-0 pl-4">
        {/* 弱點區塊 */}
        <div className="mb-6 w-full">
          <div className="text-xl text-red-400 font-extrabold mb-2">弱點</div>
          <div className="flex flex-wrap gap-2">
            {getDisplayTypes(pokemon.weaknesses).map((type: string) => (
              <Badge key={type} className={`${typeColors[type] || 'bg-red-500'} text-white text-xl px-3 py-1`}>{type}</Badge>
            ))}
          </div>
        </div>
        {/* 抗性區塊 */}
        <div className="w-full">
          <div className="text-xl text-blue-400 font-extrabold mb-2">抗性</div>
          <div className="flex flex-wrap gap-2">
            {getDisplayTypes(pokemon.resistances).map((type: string) => (
              <Badge key={type} className={`${typeColors[type] || 'bg-blue-500'} text-white text-xl px-3 py-1`}>{type}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 