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