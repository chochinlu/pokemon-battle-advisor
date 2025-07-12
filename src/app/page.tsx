"use client"

import { useState } from "react"
import { Pokemon } from "@/types/pokemon"
import { Header } from "@/components/Header"
import { AnimatedBackground } from "@/components/AnimatedBackground"
import { TeamSelection } from "@/components/TeamSelection"
import { BattleAnalysis } from "@/components/BattleAnalysis"

export default function Home() {
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

  const backToTeam = () => {
    setBattleMode(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Header />

        {!battleMode ? (
          <TeamSelection
            team={team}
            onPokemonSelect={handlePokemonSelect}
            onPokemonClear={handlePokemonClear}
            onStartBattle={startBattle}
            onResetTeam={resetTeam}
          />
        ) : (
          <BattleAnalysis
            team={team.filter((pokemon): pokemon is Pokemon => pokemon !== null)}
            onBackToTeam={backToTeam}
          />
        )}
      </div>
    </div>
  )
}