"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import { BattleAnalysisProps } from "@/types/pokemon"
import { typeColors } from "@/data/pokemon"
import { convertTypesToChinese } from "@/lib/pokemon-utils"

export function BattleAnalysis({ team, onBackToTeam }: BattleAnalysisProps) {
  // 將英文屬性轉換為中文顯示
  const getDisplayTypes = (types: string[]) => {
    return convertTypesToChinese(types)
  }

  return (
    <div className="text-center">
      <Card className="bg-black/60 border-2 border-red-500 backdrop-blur-sm mb-8">
        <CardContent className="p-8">
          <h2 className="text-4xl font-bold text-red-400 mb-6">⚔️ 對戰分析 ⚔️</h2>
          <div className="grid grid-cols-3 gap-6 mb-6">
            {team.map(
              (pokemon, index) => (
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
                      {getDisplayTypes(pokemon.types).map((type: string) => (
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