import { Pokemon } from "@/types/pokemon"
import pokemonDataCleaned from "@/lib/pokemon_data_cleaned.json"

// 使用整理後的資料
export const pokemonData: Pokemon[] = pokemonDataCleaned.map(pokemon => ({
  id: pokemon.id,
  name: pokemon.name,
  chineseName: pokemon.chineseName,
  types: pokemon.types,
  weaknesses: pokemon.weaknesses,
  resistances: pokemon.resistances,
  image: pokemon.image,
  stats: {
    hp: pokemon.stats.hp,
    attack: pokemon.stats.attack,
    defense: pokemon.stats.defense,
    speed: pokemon.stats.speed,
  }
}))

// 支援中英文屬性名稱的顏色配置
export const typeColors: { [key: string]: string } = {
  // 中文屬性
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
  龍: "bg-purple-600",
  
  // 英文屬性
  Fire: "bg-red-500",
  Water: "bg-blue-500",
  Grass: "bg-green-500",
  Electric: "bg-yellow-500",
  Poison: "bg-purple-500",
  Ground: "bg-amber-600",
  Flying: "bg-indigo-400",
  Bug: "bg-lime-500",
  Rock: "bg-stone-600",
  Steel: "bg-slate-500",
  Ice: "bg-cyan-400",
  Fighting: "bg-red-700",
  Psychic: "bg-pink-500",
  Fairy: "bg-pink-300",
  Ghost: "bg-purple-700",
  Dark: "bg-gray-800",
  Dragon: "bg-purple-600",
} 