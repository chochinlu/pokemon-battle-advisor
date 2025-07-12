"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Search, User } from "lucide-react"
import { PokemonSlotProps, Pokemon } from "@/types/pokemon"
import { pokemonData, typeColors } from "@/data/pokemon"
import { convertTypesToChinese, englishToChineseType } from "@/lib/pokemon-utils"

export function PokemonSlot({ slotIndex, selectedPokemon, onSelect, onClear }: PokemonSlotProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Pokemon[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = pokemonData.filter((pokemon) => {
        const searchLower = searchTerm.toLowerCase()
        
        // 搜尋英文名稱
        const nameMatch = pokemon.name.toLowerCase().includes(searchLower)
        
        // 搜尋中文名稱
        const chineseNameMatch = pokemon.chineseName.includes(searchTerm)
        
        // 搜尋日文名稱
        const japaneseNameMatch = pokemon.japaneseName.includes(searchTerm)
        
        // 搜尋英文屬性
        const englishTypeMatch = pokemon.types.some((type) => 
          type.toLowerCase().includes(searchLower)
        )
        
        // 搜尋中文屬性
        const chineseTypes = convertTypesToChinese(pokemon.types)
        const chineseTypeMatch = chineseTypes.some((type) => 
          type.includes(searchTerm)
        )
        
        // 搜尋屬性中文名稱（支援部分匹配）
        const chineseTypePartialMatch = Object.entries(englishToChineseType).some(([english, chinese]) => {
          if (chinese.includes(searchTerm)) {
            return pokemon.types.includes(english)
          }
          return false
        })
        
        return nameMatch || chineseNameMatch || japaneseNameMatch || englishTypeMatch || chineseTypeMatch || chineseTypePartialMatch
      })
      
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchTerm])

  const handleSelect = (pokemon: Pokemon) => {
    onSelect(pokemon)
    setSearchTerm("")
    setShowSuggestions(false)
  }

  const handleClear = () => {
    onClear()
    setSearchTerm("")
    setShowSuggestions(false)
  }

  // 將英文屬性轉換為中文顯示
  const getDisplayTypes = (types: string[]) => {
    return convertTypesToChinese(types)
  }

  return (
    <Card className="bg-black/40 border-2 border-yellow-400/50 backdrop-blur-sm h-[480px] flex flex-col justify-between relative">
      {/* 卡片右上角 X 按鈕 */}
      {selectedPokemon && (
        <button
          onClick={handleClear}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 z-20 shadow-lg"
        >
          <X className="w-7 h-7" />
        </button>
      )}
      <CardContent className="p-6 h-full flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-yellow-400" />
          <h3 className="text-2xl font-extrabold text-white">位置 {slotIndex + 1}</h3>
        </div>

        {!selectedPokemon ? (
          <div className="relative flex flex-col justify-center h-[370px]">
            <Input
              ref={inputRef}
              type="text"
              placeholder="搜尋寶可夢..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xl p-4 bg-white/10 border-2 border-white/20 text-white placeholder-white/60 focus:border-yellow-400"
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-black/90 border-2 border-yellow-400/50 rounded-lg mt-2 z-20 backdrop-blur-sm">
                {suggestions.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    className="p-3 hover:bg-yellow-400/20 cursor-pointer border-b border-white/10 last:border-b-0 flex items-center gap-3"
                    onClick={() => handleSelect(pokemon)}
                  >
                    <img src={pokemon.image || "/placeholder.svg"} alt={pokemon.name} className="w-12 h-12" />
                    <div>
                      <div className="text-xl text-white font-bold">
                        {pokemon.chineseName} ({pokemon.name})
                      </div>
                      <div className="text-base text-white/70">
                        {pokemon.japaneseName}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {getDisplayTypes(pokemon.types).map((type: string) => (
                          <Badge key={type} className={`${typeColors[type]} text-white text-xs`}>
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 h-32 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
              <div className="text-center text-white/50">
                <Search className="w-10 h-10 mx-auto mb-2" />
                <p className="text-lg">選擇一隻寶可夢</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-row h-[370px] w-full items-center justify-center">
            {/* 左欄：圖片、名稱、屬性 */}
            <div className="flex flex-col items-center justify-center flex-1 min-w-0">
              <div className="flex flex-col items-center mb-2">
                <img
                  src={selectedPokemon.image || "/placeholder.svg"}
                  alt={selectedPokemon.name}
                  className="w-40 h-40 mx-auto mb-2 object-contain drop-shadow-xl"
                  style={{ maxWidth: '100%', maxHeight: '180px' }}
                />
              </div>
              <div className="mb-1 w-full text-center">
                <div className="text-2xl font-extrabold text-white leading-tight truncate">{selectedPokemon.chineseName}</div>
                <div className="text-xl text-white/80 font-bold truncate">{selectedPokemon.name}</div>
                <div className="text-lg text-white/60 font-semibold truncate">{selectedPokemon.japaneseName}</div>
              </div>
              <div className="flex justify-center gap-2 mb-1 flex-wrap">
                {getDisplayTypes(selectedPokemon.types).map((type: string) => (
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
                  {getDisplayTypes(selectedPokemon.weaknesses).map((type: string) => (
                    <Badge key={type} className={`${typeColors[type] || 'bg-red-500'} text-white text-xl px-3 py-1`}>{type}</Badge>
                  ))}
                </div>
              </div>
              {/* 抗性區塊 */}
              <div className="w-full">
                <div className="text-xl text-blue-400 font-extrabold mb-2">抗性</div>
                <div className="flex flex-wrap gap-2">
                  {getDisplayTypes(selectedPokemon.resistances).map((type: string) => (
                    <Badge key={type} className={`${typeColors[type] || 'bg-blue-500'} text-white text-xl px-3 py-1`}>{type}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 