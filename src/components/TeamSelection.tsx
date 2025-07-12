"use client"

import { Button } from "@/components/ui/button"
import { Sword } from "lucide-react"
import { TeamSelectionProps } from "@/types/pokemon"
import { PokemonSlot } from "./PokemonSlot"

export function TeamSelection({ team, onPokemonSelect, onPokemonClear, onStartBattle, onResetTeam }: TeamSelectionProps) {
  const selectedCount = team.filter((pokemon) => pokemon !== null).length

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">組建你的隊伍 ({selectedCount}/3)</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {team.map((pokemon, index) => (
            <PokemonSlot
              key={index}
              slotIndex={index}
              selectedPokemon={pokemon}
              onSelect={(pokemon) => onPokemonSelect(index, pokemon)}
              onClear={() => onPokemonClear(index)}
            />
          ))}
        </div>

        <div className="text-center">
          <div className="flex justify-center gap-4">
            <Button
              onClick={onStartBattle}
              disabled={selectedCount !== 3}
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-3 px-8 text-lg disabled:opacity-50"
            >
              <Sword className="w-5 h-5 mr-2" />
              開始對戰分析
            </Button>
            <Button
              onClick={onResetTeam}
              variant="outline"
              className="border-2 border-white/50 text-white hover:bg-white/10 font-bold py-3 px-8 text-lg bg-transparent"
            >
              重置隊伍
            </Button>
          </div>
        </div>
      </div>
    </>
  )
} 