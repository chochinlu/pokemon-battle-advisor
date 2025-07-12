"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Search, User } from "lucide-react"
import { PokemonSlotProps, Pokemon } from "@/types/pokemon"
import { pokemonData, typeColors } from "@/data/pokemon"

export function PokemonSlot({ slotIndex, selectedPokemon, onSelect, onClear }: PokemonSlotProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Pokemon[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = pokemonData.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pokemon.chineseName.includes(searchTerm) ||
          pokemon.types.some((type) => type.includes(searchTerm)),
      )
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

  return (
    <Card className="bg-black/40 border-2 border-yellow-400/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">位置 {slotIndex + 1}</h3>
        </div>

        {!selectedPokemon ? (
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="搜尋寶可夢..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-lg p-4 bg-white/10 border-2 border-white/20 text-white placeholder-white/60 focus:border-yellow-400"
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-black/90 border-2 border-yellow-400/50 rounded-lg mt-2 z-20 backdrop-blur-sm">
                {suggestions.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    className="p-3 hover:bg-yellow-400/20 cursor-pointer border-b border-white/10 last:border-b-0 flex items-center gap-3"
                    onClick={() => handleSelect(pokemon)}
                  >
                    <img src={pokemon.image} alt={pokemon.name} className="w-12 h-12" />
                    <div>
                      <div className="text-white font-semibold">
                        {pokemon.chineseName} ({pokemon.name})
                      </div>
                      <div className="flex gap-1">
                        {pokemon.types.map((type: string) => (
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
                <Search className="w-8 h-8 mx-auto mb-2" />
                <p>選擇一隻寶可夢</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={selectedPokemon.image}
                alt={selectedPokemon.name}
                className="w-24 h-24 mx-auto mb-3"
              />
              <button
                onClick={handleClear}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h4 className="text-lg font-bold text-white">{selectedPokemon.chineseName}</h4>
            <p className="text-white/70 mb-3">({selectedPokemon.name})</p>

                         <div className="flex justify-center gap-1 mb-3">
               {selectedPokemon.types.map((type: string) => (
                 <Badge key={type} className={`${typeColors[type]} text-white`}>
                   {type}
                 </Badge>
               ))}
             </div>

            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-red-400">HP:</span>
                <span className="text-white">{selectedPokemon.stats.hp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-400">攻擊:</span>
                <span className="text-white">{selectedPokemon.stats.attack}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400">防禦:</span>
                <span className="text-white">{selectedPokemon.stats.defense}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">速度:</span>
                <span className="text-white">{selectedPokemon.stats.speed}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 