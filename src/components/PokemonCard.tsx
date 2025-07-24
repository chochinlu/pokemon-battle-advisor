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
  
  const StatBar = ({ label, value, maxValue = 150, color }: { label: string; value: number; maxValue?: number; color: string }) => {
    const getBarColor = (textColor: string) => {
      const colorMap: { [key: string]: string } = {
        'text-red-400': 'bg-red-500',
        'text-orange-400': 'bg-orange-500',
        'text-blue-400': 'bg-blue-500',
        'text-purple-400': 'bg-purple-500',
        'text-green-400': 'bg-green-500',
        'text-yellow-400': 'bg-yellow-500'
      }
      return colorMap[textColor] || 'bg-gray-500'
    }
    
    return (
      <div className="flex items-center gap-2 mb-0.5">
        <div className={`text-xs font-bold ${color} min-w-[35px] text-right`}>{label}</div>
        <div className="flex-1 bg-gray-700 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${getBarColor(color)}`}
            style={{ width: `${Math.min((value / maxValue) * 100, 100)}%` }}
          />
        </div>
        <div className="text-xs text-white font-bold min-w-[25px] text-left">{value}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* 上半部：原有的水平佈局 - 固定高度確保一致性 */}
      <div className="flex flex-row items-start justify-center h-[320px]">
        {/* 左欄：圖片、名稱、屬性 */}
        <div className="flex flex-col items-center justify-start flex-1 min-w-0 pt-4">
          <div className="flex flex-col items-center mb-3">
            <img
              src={pokemon.image || "/placeholder.svg"}
              alt={pokemon.name}
              className="w-32 h-32 mx-auto mb-3 object-contain drop-shadow-xl"
            />
          </div>
          <div className="mb-3 w-full text-center">
            <div className="text-xl font-extrabold text-white leading-tight truncate h-6">{pokemon.chineseName}</div>
            <div className="text-lg text-white/80 font-bold truncate h-6">{pokemon.name}</div>
            <div className="text-sm text-white/60 font-semibold truncate h-5">{pokemon.japaneseName}</div>
          </div>
          <div className="flex justify-center gap-2 mb-3 flex-wrap min-h-[2.5rem]">
            {getDisplayTypes(pokemon.types).map((type: string) => (
              <Badge key={type} className={`${typeColors[type]} text-white text-sm px-2 py-0.5 h-6 min-w-[2.5rem] flex items-center justify-center`}>{type}</Badge>
            ))}
          </div>
        </div>
        {/* 右欄：弱點與抗性 */}
        <div className="flex flex-col items-start justify-start flex-1 min-w-0 pl-4 pt-4">
          {/* 弱點區塊 - 固定高度 */}
          <div className="mb-4 w-full h-[120px]">
            <div className="text-lg text-red-400 font-extrabold mb-2">弱點</div>
            <div className="flex flex-wrap gap-2 h-[90px] overflow-hidden">
              {getDisplayTypes(pokemon.weaknesses).map((type: string) => (
                <Badge key={type} className={`${typeColors[type] || 'bg-red-500'} text-white text-sm px-2 py-0.5 h-6 min-w-[2.5rem] flex items-center justify-center`}>{type}</Badge>
              ))}
            </div>
          </div>
          {/* 抗性區塊 - 固定高度 */}
          <div className="w-full h-[120px]">
            <div className="text-lg text-blue-400 font-extrabold mb-2">抗性</div>
            <div className="flex flex-wrap gap-2 h-[90px] overflow-hidden">
              {getDisplayTypes(pokemon.resistances).map((type: string) => (
                <Badge key={type} className={`${typeColors[type] || 'bg-blue-500'} text-white text-sm px-2 py-0.5 h-6 min-w-[2.5rem] flex items-center justify-center`}>{type}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 下半部：數值統計區域 - 固定位置和高度 */}
      <div className="bg-black/30 rounded-lg p-2 mt-2 flex-shrink-0 h-[100px]">
        <div className="text-center text-yellow-400 font-bold text-sm mb-1">基礎數值</div>
        <div className="grid grid-cols-2 gap-x-3">
          <div>
            <StatBar label="HP" value={pokemon.stats.hp} color="text-red-400" />
            <StatBar label="攻擊" value={pokemon.stats.attack} color="text-orange-400" />
            <StatBar label="防禦" value={pokemon.stats.defense} color="text-blue-400" />
          </div>
          <div>
            <StatBar label="特攻" value={pokemon.stats.specialAttack || 0} color="text-purple-400" />
            <StatBar label="特防" value={pokemon.stats.specialDefense || 0} color="text-green-400" />
            <StatBar label="速度" value={pokemon.stats.speed} color="text-yellow-400" />
          </div>
        </div>
      </div>
    </div>
  )
} 