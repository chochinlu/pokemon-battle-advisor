const fs = require('fs');
const path = require('path');

// 屬性名稱映射表（中文到英文）
const typeMapping = {
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
};

// 驗證圖片連結是否可用
function validateImageUrl(url) {
  return url.replace(/\\/g, '');
}

// 將原始 pokemon_data.json 轉換為清理格式
function convertPokemonData(rawData) {
  return rawData.map(pokemon => {
    // 處理屬性字串，轉換為英文陣列
    const typesString = pokemon["屬性"] || "";
    const types = typesString.split(", ").map((type) => {
      const trimmedType = type.trim();
      return typeMapping[trimmedType] || trimmedType;
    });

    // 處理弱點字串，轉換為英文陣列
    const weaknessesString = pokemon["弱點"] || "";
    const weaknesses = weaknessesString.split(", ").map((weakness) => {
      const trimmedWeakness = weakness.trim();
      return typeMapping[trimmedWeakness] || trimmedWeakness;
    });

    // 處理抗性字串，轉換為英文陣列
    const resistancesString = pokemon["抗性"] || "";
    const resistances = resistancesString.split(", ").map((resistance) => {
      const trimmedResistance = resistance.trim();
      return typeMapping[trimmedResistance] || trimmedResistance;
    });

    // 處理圖片連結
    const imageUrl = validateImageUrl(pokemon["圖片連結"] || "");

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
    };
  });
}

// 讀取原始資料
const rawDataPath = path.join(__dirname, '../src/lib/pokemon_data.json');
const outputPath = path.join(__dirname, '../src/lib/pokemon_data_cleaned.json');

try {
  console.log('讀取原始寶可夢資料...');
  const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
  
  console.log('轉換資料格式...');
  const convertedData = convertPokemonData(rawData);
  
  console.log('寫入清理後的資料...');
  fs.writeFileSync(outputPath, JSON.stringify(convertedData, null, 2), 'utf8');
  
  console.log(`成功轉換 ${convertedData.length} 隻寶可夢的資料！`);
  console.log(`輸出檔案：${outputPath}`);
  
} catch (error) {
  console.error('轉換過程中發生錯誤：', error);
  process.exit(1);
} 