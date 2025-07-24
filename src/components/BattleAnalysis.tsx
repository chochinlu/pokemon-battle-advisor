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
  stats: {
    attack: number
    defense: number
    specialDefense: number
  }
}

interface AnalysisResult {
  teamWeaknesses: { type: string; count: number }[]
  majorThreats: ThreatPokemon[]
  replacementSuggestions: ThreatPokemon[]
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">主要弱點屬性:</h4>
                      <div className="space-y-2">
                        {analysis.teamWeaknesses.slice(0, 3).map((weakness, index) => (
                          <div key={index} className="flex items-center justify-between bg-black/30 p-3 rounded">
                            <Badge className={`${typeColors[weakness.type] || 'bg-red-500'} text-white`}>
                              {weakness.type}
                            </Badge>
                            <span className="text-white">影響 {weakness.count} 隻寶可夢</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">主要威脅:</h4>
                      <div className="space-y-2">
                        {analysis.majorThreats.slice(0, 3).map((threat, index) => (
                          <div key={index} className="bg-black/30 p-3 rounded text-left">
                            <div className="text-white font-bold">{threat.chineseName}</div>
                            <div className="text-sm text-white/70">攻擊力: {threat.stats.attack}</div>
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
                    <h3 className="text-2xl font-bold text-purple-400 mb-4">🔄 替換建議</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {analysis.replacementSuggestions.map((suggestion, index) => (
                        <div key={index} className="bg-black/30 p-4 rounded text-center">
                          <div className="text-white font-bold">{suggestion.chineseName}</div>
                          <div className="text-sm text-white/70">
                            防禦: {suggestion.stats.defense + suggestion.stats.specialDefense}
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