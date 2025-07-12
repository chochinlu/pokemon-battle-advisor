"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Zap, Shield, Sword, Search, User } from "lucide-react"

interface Pokemon {
  id: number
  name: string
  chineseName: string
  types: string[]
  weaknesses: string[]
  resistances: string[]
  image: string
  stats: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
}

const pokemonData: Pokemon[] = [
  {
    id: 6,
    name: "Charizard",
    chineseName: "噴火龍",
    types: ["火", "飛行"],
    weaknesses: ["岩石", "水", "電"],
    resistances: ["蟲", "鋼", "火", "草", "妖精", "格鬥"],
    image: "/placeholder.svg?height=120&width=120",
    stats: { hp: 78, attack: 84, defense: 78, speed: 100 },
  },
  {
    id: 13,
    name: "Weedle",
    chineseName: "獨角蟲",
    types: ["蟲", "毒"],
    weaknesses: ["飛行", "岩石", "火", "超能力"],
    resistances: ["格鬥", "草", "毒", "蟲", "妖精"],
    image: "/placeholder.svg?height=120&width=120",
    stats: { hp: 40, attack: 35, defense: 30, speed: 50 },
  },
  {
    id: 31,
    name: "Nidoqueen",
    chineseName: "尼多后",
    types: ["毒", "地面"],
    weaknesses: ["地面", "超能力", "水", "冰"],
    resistances: ["格鬥", "毒", "蟲", "妖精", "岩石", "電"],
    image: "/placeholder.svg?height=120&width=120",
    stats: { hp: 90, attack: 92, defense: 87, speed: 76 },
  },
  {
    id: 25,
    name: "Pikachu",
    chineseName: "皮卡丘",
    types: ["電"],
    weaknesses: ["地面"],
    resistances: ["飛行", "鋼", "電"],
    image: "/placeholder.svg?height=120&width=120",
    stats: { hp: 35, attack: 55, defense: 40, speed: 90 },
  },
  {
    id: 1,
    name: "Bulbasaur",
    chineseName: "妙蛙種子",
    types: ["草", "毒"],
    weaknesses: ["飛行", "冰", "火", "超能力"],
    resistances: ["水", "電", "草", "格鬥", "妖精"],
    image: "/placeholder.svg?height=120&width=120",
    stats: { hp: 45, attack: 49, defense: 49, speed: 45 },
  },
  {
    id: 7,
    name: "Squirtle",
    chineseName: "傑尼龜",
    types: ["水"],
    weaknesses: ["草", "電"],
    resistances: ["鋼", "火", "水", "冰"],
    image: "/placeholder.svg?height=120&width=120",
    stats: { hp: 44, attack: 48, defense: 65, speed: 43 },
  },
  {
    id: 9,
    name: "Blastoise",
    chineseName: "水箭龜",
    types: ["水"],
    weaknesses: ["草", "電"],
    resistances: ["鋼", "火", "水", "冰"],
    image: "/placeholder.svg?height=120&width=120",
    stats: { hp: 79, attack: 83, defense: 100, speed: 78 },
  },
  {
    id: 150,
    name: "Mewtwo",
    chineseName: "超夢",
    types: ["超能力"],
    weaknesses: ["蟲", "幽靈", "惡"],
    resistances: ["格鬥", "超能力"],
    image: "/placeholder.svg?height=120&width=120",
    stats: { hp: 106, attack: 110, defense: 90, speed: 130 },
  },
]

const typeColors: { [key: string]: string } = {
  火: "bg-red-500",
  水: "bg-blue-500",
  草: "bg-green-500",
  電: "bg-yellow-500",
  毒: "bg-purple-500",
  地面: "bg-amber-600",
  飛行: "bg-indigo-400",
  蟲: "bg-lime-500",
  岩石: "bg-stone-600",
  鋼: "bg-slate-500",
  冰: "bg-cyan-400",
  格鬥: "bg-red-700",
  超能力: "bg-pink-500",
  妖精: "bg-pink-300",
  幽靈: "bg-purple-700",
  惡: "bg-gray-800",
}

interface PokemonSlotProps {
  slotIndex: number
  selectedPokemon: Pokemon | null
  onSelect: (pokemon: Pokemon) => void
  onClear: () => void
}

function PokemonSlot({ slotIndex, selectedPokemon, onSelect, onClear }: PokemonSlotProps) {
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
                    <img src={pokemon.image || "/placeholder.svg"} alt={pokemon.name} className="w-12 h-12" />
                    <div>
                      <div className="text-white font-semibold">
                        {pokemon.chineseName} ({pokemon.name})
                      </div>
                      <div className="flex gap-1">
                        {pokemon.types.map((type) => (
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
                src={selectedPokemon.image || "/placeholder.svg"}
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
              {selectedPokemon.types.map((type) => (
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

export default function PokemonBattleSystem() {
  const [team, setTeam] = useState<(Pokemon | null)[]>([null, null, null])
  const [battleMode, setBattleMode] = useState(false)

  const handlePokemonSelect = (slotIndex: number, pokemon: Pokemon) => {
    const newTeam = [...team]
    newTeam[slotIndex] = pokemon
    setTeam(newTeam)
  }

  const handlePokemonClear = (slotIndex: number) => {
    const newTeam = [...team]
    newTeam[slotIndex] = null
    setTeam(newTeam)
  }

  const startBattle = () => {
    if (team.every((pokemon) => pokemon !== null)) {
      setBattleMode(true)
    }
  }

  const resetTeam = () => {
    setTeam([null, null, null])
    setBattleMode(false)
  }

  const selectedCount = team.filter((pokemon) => pokemon !== null).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-400 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
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

        {!battleMode ? (
          <>
            {/* Team Selection */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">組建你的隊伍 ({selectedCount}/3)</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {team.map((pokemon, index) => (
                  <PokemonSlot
                    key={index}
                    slotIndex={index}
                    selectedPokemon={pokemon}
                    onSelect={(pokemon) => handlePokemonSelect(index, pokemon)}
                    onClear={() => handlePokemonClear(index)}
                  />
                ))}
              </div>

              <div className="text-center">
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={startBattle}
                    disabled={selectedCount !== 3}
                    className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-3 px-8 text-lg disabled:opacity-50"
                  >
                    <Sword className="w-5 h-5 mr-2" />
                    開始對戰分析
                  </Button>
                  <Button
                    onClick={resetTeam}
                    variant="outline"
                    className="border-2 border-white/50 text-white hover:bg-white/10 font-bold py-3 px-8 text-lg bg-transparent"
                  >
                    重置隊伍
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Battle Analysis Mode */
          <div className="text-center">
            <Card className="bg-black/60 border-2 border-red-500 backdrop-blur-sm mb-8">
              <CardContent className="p-8">
                <h2 className="text-4xl font-bold text-red-400 mb-6">⚔️ 對戰分析 ⚔️</h2>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  {team.map(
                    (pokemon, index) =>
                      pokemon && (
                        <div key={pokemon.id} className="text-center">
                          <div className="bg-gradient-to-br from-yellow-400/20 to-red-500/20 p-4 rounded-lg">
                            <h4 className="text-lg font-bold text-yellow-400 mb-2">位置 {index + 1}</h4>
                            <img
                              src={pokemon.image || "/placeholder.svg"}
                              alt={pokemon.name}
                              className="w-32 h-32 mx-auto mb-2"
                            />
                            <h3 className="text-xl font-bold text-white">{pokemon.chineseName}</h3>
                            <p className="text-white/70 mb-3">({pokemon.name})</p>

                            <div className="flex justify-center gap-1 mb-3">
                              {pokemon.types.map((type) => (
                                <Badge key={type} className={`${typeColors[type]} text-white text-xs`}>
                                  {type}
                                </Badge>
                              ))}
                            </div>

                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-red-400">HP:</span>
                                <span className="text-white">{pokemon.stats.hp}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-orange-400">攻擊:</span>
                                <span className="text-white">{pokemon.stats.attack}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-400">防禦:</span>
                                <span className="text-white">{pokemon.stats.defense}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-green-400">速度:</span>
                                <span className="text-white">{pokemon.stats.speed}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                  )}
                </div>

                <div className="bg-gradient-to-r from-yellow-400/20 to-red-500/20 p-6 rounded-lg mb-6">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">隊伍分析</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">隊伍優勢:</h4>
                      <ul className="text-white/80 space-y-1">
                        <li>• 屬性搭配均衡</li>
                        <li>• 攻防兼備</li>
                        <li>• 速度分配合理</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">戰術建議:</h4>
                      <ul className="text-white/80 space-y-1">
                        <li>• 善用屬性相剋</li>
                        <li>• 注意出戰順序</li>
                        <li>• 保護核心寶可夢</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setBattleMode(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 text-lg"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  返回隊伍選擇
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
