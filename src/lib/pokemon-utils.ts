// 屬性名稱映射表（中文到英文）
export const typeMapping: { [key: string]: string } = {
  "火": "Fire",
  "水": "Water",
  "草": "Grass",
  "電": "Electric",
  "毒": "Poison",
  "地面": "Ground",
  "飛行": "Flying",
  "蟲": "Bug",
  "岩石": "Rock",
  "鋼": "Steel",
  "冰": "Ice",
  "格鬥": "Fighting",
  "超能力": "Psychic",
  "妖精": "Fairy",
  "幽靈": "Ghost",
  "惡": "Dark",
  "龍": "Dragon"
}

// 英文到中文的映射
export const englishToChineseType: { [key: string]: string } = {
  "Fire": "火",
  "Water": "水",
  "Grass": "草",
  "Electric": "電",
  "Poison": "毒",
  "Ground": "地面",
  "Flying": "飛行",
  "Bug": "蟲",
  "Rock": "岩石",
  "Steel": "鋼",
  "Ice": "冰",
  "Fighting": "格鬥",
  "Psychic": "超能力",
  "Fairy": "妖精",
  "Ghost": "幽靈",
  "Dark": "惡",
  "Dragon": "龍"
}

// 轉換中文屬性為英文屬性
export function convertTypesToEnglish(types: string[]): string[] {
  return types.map(type => typeMapping[type] || type)
}

// 轉換英文屬性為中文屬性
export function convertTypesToChinese(types: string[]): string[] {
  return types.map(type => englishToChineseType[type] || type)
}

// 格式化圖片連結
export function formatImageUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

// 驗證圖片連結是否可用
export function validateImageUrl(url: string): string {
  // 如果連結包含轉義字符，修正它
  return url.replace(/\\/g, '')
}

// 將原始 pokemon_data.json 轉換為清理格式
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertPokemonData(rawData: any[]): any[] {
  return rawData.map(pokemon => {
    // 處理屬性字串，轉換為英文陣列
    const typesString = pokemon["屬性"] || ""
    const types = typesString.split(", ").map((type: string) => {
      const trimmedType = type.trim()
      return typeMapping[trimmedType] || trimmedType
    })

    // 處理弱點字串，轉換為英文陣列
    const weaknessesString = pokemon["弱點"] || ""
    const weaknesses = weaknessesString.split(", ").map((weakness: string) => {
      const trimmedWeakness = weakness.trim()
      return typeMapping[trimmedWeakness] || trimmedWeakness
    })

    // 處理抗性字串，轉換為英文陣列
    const resistancesString = pokemon["抗性"] || ""
    const resistances = resistancesString.split(", ").map((resistance: string) => {
      const trimmedResistance = resistance.trim()
      return typeMapping[trimmedResistance] || trimmedResistance
    })

    // 處理圖片連結
    const imageUrl = validateImageUrl(pokemon["圖片連結"] || "")

    return {
      id: pokemon["全國編號"],
      nationalId: pokemon["全國編號"],
      japaneseName: pokemon["日文"],
      name: pokemon["英文"],
      chineseName: pokemon["中文譯名"],
      types: types,
      weaknesses: weaknesses,
      resistances: resistances,
      image: imageUrl,
      stats: {
        hp: pokemon["HP"],
        attack: pokemon["攻擊"],
        defense: pokemon["防禦"],
        specialAttack: pokemon["特殊攻擊"],
        specialDefense: pokemon["特殊防禦"],
        speed: pokemon["速度"]
      },
      moves: pokemon["可學習招式"] ? pokemon["可學習招式"].split(", ") : []
    }
  })
} 