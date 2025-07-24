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
    id: number;
    nationalId: number;
    japaneseName: string;
    name: string;
    chineseName: string;
    types: string[];
    weaknesses: string[];
    resistances: string[];
    image: string;
    stats: {
        hp: number;
        attack: number;
        defense: number;
        specialAttack: number;
        specialDefense: number;
        speed: number;
    };
    moves?: string[];
}

// 分析出場順序
function analyzeBattleOrder(team: PokemonData[]) {
    // 根據速度、攻擊力、防禦力和屬性平衡來建議出場順序
    const pokemonWithScores = team.map((pokemon, index) => {
        const speed = pokemon.stats.speed;
        const attack = pokemon.stats.attack;
        const defense = pokemon.stats.defense + pokemon.stats.specialDefense;
        const hp = pokemon.stats.hp;
        
        // 計算綜合評分 (先鋒偏重速度和攻擊，中堅平衡，後衛偏重防禦和血量)
        const pioneerScore = speed * 0.4 + attack * 0.4 + (defense + hp) * 0.2;
        const coreScore = speed * 0.3 + attack * 0.3 + (defense + hp) * 0.4;
        const anchorScore = speed * 0.2 + attack * 0.2 + (defense + hp) * 0.6;
        
        return {
            pokemon,
            index,
            pioneerScore,
            coreScore,
            anchorScore,
            speed,
            attack,
            defense: defense + hp
        };
    });

    // 建議出場順序
    const pioneer = pokemonWithScores.reduce((best, current) => 
        current.pioneerScore > best.pioneerScore ? current : best
    );
    
    const anchor = pokemonWithScores.reduce((best, current) => 
        current.anchorScore > best.anchorScore ? current : best
    );
    
    const core = pokemonWithScores.find(p => 
        p.index !== pioneer.index && p.index !== anchor.index
    ) || pokemonWithScores[0];

    return {
        order: [pioneer, core, anchor],
        explanation: {
            pioneer: `${pioneer.pokemon.chineseName} (先鋒) - 速度${pioneer.speed}，攻擊${pioneer.attack}，適合首發制敵`,
            core: `${core.pokemon.chineseName} (中堅) - 平衡型角色，能應對多種情況`,
            anchor: `${anchor.pokemon.chineseName} (後衛) - 防禦${Math.round(anchor.defense/2)}，血量高，適合收尾`
        }
    };
}

// 分析對策建議
function analyzeCounterStrategies(team: PokemonData[], teamWeaknesses: { type: string; count: number }[]) {
    const strategies: { threatType: string; affectedPokemon: number; strategy: string; priority: string }[] = [];
    
    // 針對每個主要弱點提供對策
    teamWeaknesses.slice(0, 3).forEach(weakness => {
        const englishType = Object.keys(typeTranslation).find(key => typeTranslation[key] === weakness.type);
        if (!englishType) return;

        // 找出隊伍中能抵抗此屬性的寶可夢
        const resistantTeamMembers = team.filter(pokemon => {
            return pokemon.resistances.map(r => r.toLowerCase()).includes(englishType.toLowerCase());
        });

        // 找出能克制此屬性的隊伍成員
        const counterTeamMembers = team.filter(pokemon => {
            return pokemon.types.some(pt => typeWeaknesses[englishType]?.includes(pt.toLowerCase()));
        });

        let strategy = `面對${weakness.type}屬性威脅時：\n`;
        
        if (resistantTeamMembers.length > 0) {
            strategy += `• 派出 ${resistantTeamMembers[0].chineseName} 承受傷害（具有抗性）\n`;
        }
        
        if (counterTeamMembers.length > 0) {
            strategy += `• 使用 ${counterTeamMembers[0].chineseName} 進行反擊（屬性相剋）\n`;
        } else {
            strategy += `• 建議使用小招磨耗或切換寶可夢避戰\n`;
        }
        
        // 如果既沒有抗性也沒有相剋優勢
        if (resistantTeamMembers.length === 0 && counterTeamMembers.length === 0) {
            strategy += `• 這是隊伍的重大弱點，建議優先切換或使用狀態技能拖延\n`;
        }

        strategies.push({
            threatType: weakness.type,
            affectedPokemon: weakness.count,
            strategy: strategy.trim(),
            priority: weakness.count >= 2 ? "高" : "中"
        });
    });

    return strategies;
}

export async function POST(request: Request) {
    const { pokemonNames } = await request.json();

    if (!pokemonNames || !Array.isArray(pokemonNames) || pokemonNames.length === 0) {
        return NextResponse.json({ error: "請提供寶可夢名稱列表" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'lib', 'pokemon_data_cleaned.json');
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
            p.name.toLowerCase() === name.toLowerCase() || 
            p.chineseName.toLowerCase() === name.toLowerCase()
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
        p.weaknesses.forEach(w => {
            const weaknessLower = w.toLowerCase();
            teamWeaknesses[weaknessLower] = (teamWeaknesses[weaknessLower] || 0) + 1;
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
                    return p.types.some(pt => counterTypes.includes(pt.toLowerCase()));
                });

                // 根據攻擊力排序，選出前幾名
                potentialThreats.sort((a, b) => b.stats.attack - a.stats.attack);
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
                return p.resistances.map(r => r.toLowerCase()).includes(englishTopWeakness.toLowerCase());
            });
            resistantPokemon.sort((a, b) => (b.stats.defense + b.stats.specialDefense) - (a.stats.defense + a.stats.specialDefense)); // 根據防禦力排序
            replacementSuggestions.push(...resistantPokemon.slice(0, 3)); // 取前3名
        }
    }

    // 分析出場順序建議
    const battleOrder = analyzeBattleOrder(selectedPokemon);
    
    // 分析對策建議
    const counterStrategies = analyzeCounterStrategies(selectedPokemon, sortedWeaknesses);

    return NextResponse.json({
        selectedPokemon,
        missingPokemon,
        teamWeaknesses: sortedWeaknesses,
        majorThreats,
        replacementSuggestions,
        battleOrder,
        counterStrategies,
    });
}
