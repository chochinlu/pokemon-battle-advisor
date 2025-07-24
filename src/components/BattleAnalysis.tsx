"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Target, Users } from "lucide-react"
import { BattleAnalysisProps } from "@/types/pokemon"
import { typeColors } from "@/data/pokemon"
import { PokemonCard } from "./PokemonCard"
import { useState, useEffect } from "react"

interface ThreatPokemon {
  chineseName: string
  image: string
  stats: {
    attack: number
    defense: number
    specialDefense: number
  }
  threatReason?: string
  advantageAgainst?: string[]
  keyAdvantages?: string[]
}

interface ReplacementPokemon {
  chineseName: string
  image: string
  stats: {
    attack: number
    defense: number
    specialDefense: number
  }
  replaceTarget: string
  replaceReason: string
  advantages: string[]
  keyStats: string
  teamComboAdvantage: string
}

interface DangerousMove {
  name: string
  power: number
  description: string
}

interface AnalysisResult {
  teamWeaknesses: { 
    type: string; 
    count: number; 
    affectedPokemon: string[];
    dangerousMoves: DangerousMove[];
  }[]
  majorThreats: ThreatPokemon[]
  replacementSuggestions: ReplacementPokemon[]
  battleOrder: {
    order: { pokemon: ThreatPokemon; index: number }[]
    explanation: {
      pioneer: string
      core: string
      anchor: string
    }
  }
  counterStrategies: {
    threatType: string
    affectedPokemon: number
    strategy: string
    priority: string
  }[]
}

export function BattleAnalysis({ team, onBackToTeam }: BattleAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)


  // 調用API進行分析
  useEffect(() => {
    const analyzeTeam = async () => {
      try {
        const response = await fetch('/api/advisor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pokemonNames: team.map(p => p.name)
          }),
        })

        if (response.ok) {
          const result = await response.json()
          setAnalysis(result)
        }
      } catch (error) {
        console.error('分析失敗:', error)
      } finally {
        setLoading(false)
      }
    }

    analyzeTeam()
  }, [team])

  if (loading) {
    return (
      <div className="text-center">
        <Card className="bg-black/60 border-2 border-red-500 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <h2 className="text-4xl font-bold text-red-400 mb-6">⚔️ 對戰分析中... ⚔️</h2>
            <div className="text-white">正在分析隊伍數據...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6">
      <Card className="bg-black/60 border-2 border-red-500 backdrop-blur-sm">
        <CardContent className="p-8">
          <h2 className="text-4xl font-bold text-red-400 mb-6">⚔️ 對戰分析 ⚔️</h2>
          
          {/* 隊伍展示 */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {team.map((pokemon, index) => (
              <div key={pokemon.id} className="text-center">
                <div className="bg-gradient-to-br from-yellow-400/20 to-red-500/20 p-4 rounded-lg">
                  <PokemonCard pokemon={pokemon} slotIndex={index} />
                </div>
              </div>
            ))}
          </div>

          {analysis && (
            <>
              {/* 隊伍弱點分析 */}
              <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 mb-6">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-red-400 mb-4 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 mr-2" />
                    隊伍弱點分析
                  </h3>
                  <div className="space-y-6">
                    {/* 隊伍弱點區域 */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">隊伍弱點屬性:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysis.teamWeaknesses.map((weakness, index) => (
                          <div key={index} className="bg-black/30 p-3 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={`${typeColors[weakness.type] || 'bg-red-500'} text-white`}>
                                {weakness.type}
                              </Badge>
                              <span className="text-white text-sm">影響 {weakness.count} 隻</span>
                            </div>
                            <div className="text-xs text-white/70 mb-2">
                              受影響: {weakness.affectedPokemon.join('、')}
                            </div>
                            {weakness.dangerousMoves.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-white/20">
                                <div className="text-xs text-yellow-300 font-semibold mb-1">⚠️ 小心招式:</div>
                                <div className="space-y-1">
                                  {weakness.dangerousMoves.slice(0, 2).map((move, moveIndex) => (
                                    <div key={moveIndex} className="text-xs">
                                      <span className="text-red-300 font-medium">{move.name}</span>
                                      {move.power > 0 && (
                                        <span className="text-white/60"> (威力{move.power})</span>
                                      )}
                                      <div className="text-white/50 text-[10px] mt-0.5">
                                        {move.description}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 主要威脅區域 */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">主要威脅寶可夢:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {analysis.majorThreats.slice(0, 6).map((threat, index) => (
                          <div key={index} className="bg-black/30 p-3 rounded flex items-start space-x-3">
                            <img
                              src={threat.image || "/placeholder.svg"}
                              alt={threat.chineseName}
                              className="w-16 h-16 object-contain flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-bold text-sm mb-1 truncate">{threat.chineseName}</div>
                              {threat.threatReason && (
                                <div className="text-xs text-red-300 mb-1 line-clamp-2">{threat.threatReason}</div>
                              )}
                              {threat.keyAdvantages && threat.keyAdvantages.length > 0 && (
                                <div className="text-xs text-white/70 truncate">
                                  {threat.keyAdvantages.slice(0, 2).join('、')}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 出場順序建議 */}
              <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-6">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center justify-center">
                    <Users className="w-6 h-6 mr-2" />
                    建議出場順序
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/30 p-4 rounded text-center">
                      <div className="text-yellow-400 font-bold text-lg mb-2">🥇 先鋒</div>
                      <div className="text-white text-sm">{analysis.battleOrder.explanation.pioneer}</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded text-center">
                      <div className="text-yellow-400 font-bold text-lg mb-2">🥈 中堅</div>
                      <div className="text-white text-sm">{analysis.battleOrder.explanation.core}</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded text-center">
                      <div className="text-yellow-400 font-bold text-lg mb-2">🥉 後衛</div>
                      <div className="text-white text-sm">{analysis.battleOrder.explanation.anchor}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 對策建議 */}
              <Card className="bg-gradient-to-r from-green-500/20 to-teal-500/20 mb-6">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center justify-center">
                    <Target className="w-6 h-6 mr-2" />
                    對戰策略建議
                  </h3>
                  <div className="space-y-4">
                    {analysis.counterStrategies.map((strategy, index) => (
                      <div key={index} className="bg-black/30 p-4 rounded text-left">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${typeColors[strategy.threatType] || 'bg-gray-500'} text-white`}>
                            {strategy.threatType}屬性威脅
                          </Badge>
                          <Badge variant={strategy.priority === "高" ? "destructive" : "secondary"}>
                            {strategy.priority}優先級
                          </Badge>
                        </div>
                        <div className="text-white whitespace-pre-line text-sm">
                          {strategy.strategy}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 替換建議 */}
              {analysis.replacementSuggestions.length > 0 && (
                <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-purple-400 mb-4">🔄 隊伍替換建議</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.replacementSuggestions.map((suggestion, index) => (
                        <div key={index} className="bg-black/30 p-4 rounded flex items-start space-x-3">
                          <img
                            src={suggestion.image || "/placeholder.svg"}
                            alt={suggestion.chineseName}
                            className="w-16 h-16 object-contain flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-white font-bold text-sm">{suggestion.chineseName}</div>
                              <div className="text-xs text-white/60">{suggestion.keyStats}</div>
                            </div>
                            
                            <div className="mb-2">
                              <div className="text-xs text-orange-300 font-medium">
                                替換目標: {suggestion.replaceTarget}
                              </div>
                              <div className="text-xs text-white/70 mt-1">
                                {suggestion.replaceReason}
                              </div>
                            </div>

                            {/* 組合優勢分析 */}
                            <div className="mb-2 p-2 bg-blue-500/20 rounded">
                              <div className="text-xs text-blue-300 font-medium">
                                {suggestion.teamComboAdvantage}
                              </div>
                            </div>
                            
                            {suggestion.advantages.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-xs text-green-300 font-medium">個體優勢:</div>
                                <div className="flex flex-wrap gap-1">
                                  {suggestion.advantages.slice(0, 3).map((advantage, advIndex) => (
                                    <Badge key={advIndex} className="bg-green-600/30 text-green-200 text-[10px] px-1 py-0 border-green-500/50">
                                      {advantage}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Button
            onClick={onBackToTeam}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 text-lg"
          >
            <Shield className="w-5 h-5 mr-2" />
            返回隊伍選擇
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 