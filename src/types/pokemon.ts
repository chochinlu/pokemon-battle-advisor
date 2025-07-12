export interface Pokemon {
  id: number
  nationalId: number
  japaneseName: string
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
    specialAttack?: number
    specialDefense?: number
  }
  moves?: string[]
}

export interface PokemonSlotProps {
  slotIndex: number
  selectedPokemon: Pokemon | null
  onSelect: (pokemon: Pokemon) => void
  onClear: () => void
}

export interface TeamSelectionProps {
  team: (Pokemon | null)[]
  onPokemonSelect: (slotIndex: number, pokemon: Pokemon) => void
  onPokemonClear: (slotIndex: number) => void
  onStartBattle: () => void
  onResetTeam: () => void
}

export interface BattleAnalysisProps {
  team: Pokemon[]
  onBackToTeam: () => void
} 