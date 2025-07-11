import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 屬性中英文對照表 (與 Python 腳本保持一致)
const typeTranslation: { [key: string]: string } = {
    "normal": "一般", "fire": "火", "water": "水", "electric": "電", "grass": "草",
    "ice": "冰", "fighting": "格鬥", "poison": "毒", "ground": "地面", "flying": "飛行",
    "psychic": "超能力", "bug": "蟲", "rock": "岩石", "ghost": "幽靈", "dragon": "龍",
    "dark": "惡", "steel": "鋼", "fairy": "妖精"
};

// 屬性相剋表 (簡化版，只包含雙倍傷害)
// key: 攻擊方屬性 (英文)
// value: 被攻擊方屬性 (英文) - 受到雙倍傷害
const typeWeaknesses: { [key: string]: string[] } = {
    "normal": ["fighting"],
    "fire": ["water", "ground", "rock"],
    "water": ["electric", "grass"],
    "electric": ["ground"],
    "grass": ["fire", "ice", "poison", "flying", "bug"],
    "ice": ["fire", "fighting", "rock", "steel"],
    "fighting": ["flying", "psychic", "fairy"],
    "poison": ["ground", "psych"],
    "ground": ["water", "grass", "ice"],
    "flying": ["electric", "ice", "rock"],
    "psychic": ["bug", "ghost", "dark"],
    "bug": ["fire", "flying", "rock"],
    "rock": ["fighting", "steel", "ground", "water", "grass"],
    "ghost": ["ghost", "dark"],
    "dragon": ["ice", "dragon", "fairy"],
    "dark": ["fighting", "bug", "fairy"],
    "steel": ["fire", "fighting", "ground"],
    "fairy": ["poison", "steel"],
};

interface PokemonData {
    "全國編號": number;
    "日文": string;
    "英文": string;
    "中文譯名": string;
    "屬性": string;
    "弱點": string;
    "抗性": string;
    "圖片連結": string;
    "HP": number;
    "攻擊": number;
    "防禦": number;
    "特殊攻擊": number;
    "特殊防禦": number;
    "速度": number;
    "可學習招式": string;
}

export async function POST(request: Request) {
    const { pokemonNames } = await request.json();

    if (!pokemonNames || !Array.isArray(pokemonNames) || pokemonNames.length === 0) {
        return NextResponse.json({ error: "請提供寶可夢名稱列表" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'pokemon_data.json');
    let allPokemon: PokemonData[] = [];

    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        allPokemon = JSON.parse(fileContents);
    } catch (error) {
        console.error("Error reading or parsing pokemon_data.json:", error);
        return NextResponse.json({ error: "無法載入寶可夢資料" }, { status: 500 });
    }

    const selectedPokemon: PokemonData[] = [];
    const missingPokemon: string[] = [];

    for (const name of pokemonNames) {
        const found = allPokemon.find(p => 
            p["英文"].toLowerCase() === name.toLowerCase() || 
            p["中文譯名"].toLowerCase() === name.toLowerCase()
        );
        if (found) {
            selectedPokemon.push(found);
        } else {
            missingPokemon.push(name);
        }
    }

    if (selectedPokemon.length === 0) {
        return NextResponse.json({ error: "找不到任何指定的寶可夢" }, { status: 404 });
    }

    // 分析隊伍弱點
    const teamWeaknesses: { [key: string]: number } = {};
    selectedPokemon.forEach(p => {
        const weaknesses = p["弱點"].split(', ').map(w => w.trim().toLowerCase());
        weaknesses.forEach(w => {
            if (w !== "n/a" && w !== "") {
                teamWeaknesses[w] = (teamWeaknesses[w] || 0) + 1;
            }
        });
    });

    const sortedWeaknesses = Object.entries(teamWeaknesses)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([type, count]) => ({ type: typeTranslation[type] || type, count }));

    // 找出主要威脅 (簡化版：找出攻擊力高且能克制隊伍弱點的寶可夢)
    const majorThreats: PokemonData[] = [];
    const topWeakness = sortedWeaknesses.length > 0 ? sortedWeaknesses[0].type : null;

    if (topWeakness) {
        const englishTopWeakness = Object.keys(typeTranslation).find(key => typeTranslation[key] === topWeakness);
        if (englishTopWeakness) {
            const counterTypes = typeWeaknesses[englishTopWeakness]; // 找出能克制此弱點的屬性
            if (counterTypes) {
                const potentialThreats = allPokemon.filter(p => {
                    const pokemonTypes = p["屬性"].split(', ').map(t => t.trim().toLowerCase());
                    return pokemonTypes.some(pt => counterTypes.includes(pt));
                });

                // 根據攻擊力排序，選出前幾名
                potentialThreats.sort((a, b) => b["攻擊"] - a["攻擊"]);
                majorThreats.push(...potentialThreats.slice(0, 5)); // 取前5名
            }
        }
    }

    // 提供替換建議 (簡化版：找出能抵抗隊伍主要弱點的寶可夢)
    const replacementSuggestions: PokemonData[] = [];
    if (topWeakness) {
        const englishTopWeakness = Object.keys(typeTranslation).find(key => typeTranslation[key] === topWeakness);
        if (englishTopWeakness) {
            // 找出能抵抗此弱點的寶可夢 (即該寶可夢的屬性是隊伍主要弱點的抗性)
            const resistantPokemon = allPokemon.filter(p => {
                const resistances = p["抗性"].split(', ').map(r => r.trim().toLowerCase());
                return resistances.includes(englishTopWeakness);
            });
            resistantPokemon.sort((a, b) => (b["防禦"] + b["特殊防禦"]) - (a["防禦"] + a["特殊防禦"])); // 根據防禦力排序
            replacementSuggestions.push(...resistantPokemon.slice(0, 3)); // 取前3名
        }
    }

    return NextResponse.json({
        selectedPokemon,
        missingPokemon,
        teamWeaknesses: sortedWeaknesses,
        majorThreats,
        replacementSuggestions,
    });
}
