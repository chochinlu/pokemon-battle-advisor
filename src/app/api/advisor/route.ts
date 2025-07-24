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
// value: 被攻擊方屬性 (英文) - 造成雙倍傷害
const typeAdvantages: { [key: string]: string[] } = {
    "normal": [],
    "fire": ["grass", "ice", "bug", "steel"],
    "water": ["fire", "ground", "rock"],
    "electric": ["water", "flying"],
    "grass": ["water", "ground", "rock"],
    "ice": ["grass", "ground", "flying", "dragon"],
    "fighting": ["normal", "ice", "rock", "dark", "steel"],
    "poison": ["grass", "fairy"],
    "ground": ["fire", "electric", "poison", "rock", "steel"],
    "flying": ["grass", "fighting", "bug"],
    "psychic": ["fighting", "poison"],
    "bug": ["grass", "psychic", "dark"],
    "rock": ["fire", "ice", "flying", "bug"],
    "ghost": ["psychic", "ghost"],
    "dragon": ["dragon"],
    "dark": ["psychic", "ghost"],
    "steel": ["ice", "rock", "fairy"],
    "fairy": ["fighting", "dragon", "dark"],
};

// 各屬性的代表性強力招式
const dangerousMoves: { [key: string]: { name: string; power: number; description: string }[] } = {
    "fire": [
        { name: "大字爆炎", power: 110, description: "高威力火屬性特殊攻擊，有機率造成燒傷" },
        { name: "閃焰衝鋒", power: 120, description: "高威力火屬性物理攻擊，自身會受到反作用力傷害" },
        { name: "噴射火焰", power: 90, description: "穩定的火屬性特殊攻擊，有機率造成燒傷" }
    ],
    "water": [
        { name: "水炮", power: 110, description: "高威力水屬性特殊攻擊" },
        { name: "潮旋", power: 35, description: "困住對手4-5回合，每回合造成傷害" },
        { name: "衝浪", power: 90, description: "穩定的水屬性特殊攻擊，範圍技能" }
    ],
    "grass": [
        { name: "花瓣舞", power: 120, description: "連續使用2-3回合的高威力草屬性特殊攻擊" },
        { name: "葉片風暴", power: 130, description: "極高威力草屬性特殊攻擊，使用後特攻大幅下降" },
        { name: "能量球", power: 90, description: "草屬性特殊攻擊，有機率降低對手特防" }
    ],
    "electric": [
        { name: "十萬伏特", power: 90, description: "經典電屬性特殊攻擊，有機率造成麻痺" },
        { name: "打雷", power: 110, description: "高威力電屬性特殊攻擊，雨天必中" },
        { name: "伏特攻擊", power: 120, description: "高威力電屬性物理攻擊，自身會受到反作用力傷害" }
    ],
    "ice": [
        { name: "暴風雪", power: 110, description: "高威力冰屬性特殊攻擊，有機率造成冰凍" },
        { name: "冰凍光束", power: 90, description: "穩定的冰屬性特殊攻擊，有機率造成冰凍" },
        { name: "絕對零度", power: 999, description: "一擊必殺技，命中後直接倒下" }
    ],
    "fighting": [
        { name: "近身戰", power: 120, description: "高威力格鬥屬性物理攻擊，使用後防禦和特防下降" },
        { name: "爆裂拳", power: 100, description: "格鬥屬性物理攻擊，有機會讓對手混亂" },
        { name: "飛膝踢", power: 130, description: "極高威力格鬥屬性物理攻擊，失敗會自己受傷" }
    ],
    "poison": [
        { name: "污泥炸彈", power: 90, description: "毒屬性特殊攻擊，有機率造成中毒" },
        { name: "劇毒", power: 0, description: "讓對手陷入劇毒狀態，傷害逐回合遞增" },
        { name: "毒擊", power: 80, description: "毒屬性物理攻擊，有較高機率造成中毒" }
    ],
    "ground": [
        { name: "地震", power: 100, description: "高威力地面屬性物理攻擊，範圍技能" },
        { name: "大地之力", power: 90, description: "地面屬性特殊攻擊，有機率提升特攻" },
        { name: "裂縫", power: 999, description: "一擊必殺技，對飛行屬性無效" }
    ],
    "flying": [
        { name: "暴風", power: 110, description: "高威力飛行屬性特殊攻擊，有機率讓對手混亂" },
        { name: "神鳥猛擊", power: 140, description: "極高威力飛行屬性物理攻擊，需要蓄力一回合" },
        { name: "空氣斬", power: 75, description: "飛行屬性特殊攻擊，有機率讓對手畏縮" }
    ],
    "psychic": [
        { name: "精神強念", power: 90, description: "超能力屬性特殊攻擊，有機率降低對手特防" },
        { name: "精神衝擊", power: 80, description: "超能力屬性物理攻擊，必定命中" },
        { name: "預知未來", power: 120, description: "2回合後發動的高威力超能力特殊攻擊" }
    ],
    "bug": [
        { name: "蟲鳴", power: 90, description: "蟲屬性特殊攻擊，有機率降低對手特防" },
        { name: "超級角擊", power: 120, description: "高威力蟲屬性物理攻擊，需要蓄力一回合" },
        { name: "蟲咬", power: 60, description: "蟲屬性物理攻擊，可以吃掉對手的樹果" }
    ],
    "rock": [
        { name: "岩石爆擊", power: 150, description: "極高威力岩石屬性物理攻擊，命中率較低" },
        { name: "石刃", power: 100, description: "岩石屬性物理攻擊，容易擊中要害" },
        { name: "原始之力", power: 60, description: "岩石屬性特殊攻擊，有機率提升全能力" }
    ],
    "ghost": [
        { name: "暗影球", power: 80, description: "幽靈屬性特殊攻擊，有機率降低對手特防" },
        { name: "詛咒", power: 0, description: "減少自己HP，讓對手每回合損失HP" },
        { name: "暗影爪", power: 70, description: "幽靈屬性物理攻擊，容易擊中要害" }
    ],
    "dragon": [
        { name: "龍之波動", power: 85, description: "龍屬性特殊攻擊，沒有副作用" },
        { name: "逆鱗", power: 120, description: "連續使用2-3回合的高威力龍屬性物理攻擊" },
        { name: "流星群", power: 130, description: "極高威力龍屬性特殊攻擊，使用後特攻大幅下降" }
    ],
    "dark": [
        { name: "惡之波動", power: 80, description: "惡屬性特殊攻擊，有機率讓對手畏縮" },
        { name: "咬碎", power: 80, description: "惡屬性物理攻擊，有機率降低對手防禦" },
        { name: "暗襲要害", power: 70, description: "惡屬性物理攻擊，必定擊中要害" }
    ],
    "steel": [
        { name: "彗星拳", power: 90, description: "鋼屬性物理攻擊，有機率提升攻擊" },
        { name: "鐵頭", power: 80, description: "鋼屬性物理攻擊，有機率讓對手畏縮" },
        { name: "加農光炮", power: 120, description: "高威力鋼屬性特殊攻擊，有機率降低對手特攻" }
    ],
    "fairy": [
        { name: "月亮之力", power: 95, description: "妖精屬性特殊攻擊，有機率降低對手特攻" },
        { name: "嬉鬧", power: 90, description: "妖精屬性物理攻擊，有機率降低對手攻擊" },
        { name: "魅惑之聲", power: 40, description: "妖精屬性特殊攻擊，必定命中且無視替身" }
    ]
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
            return pokemon.types.some(pt => typeAdvantages[pt.toLowerCase()]?.includes(englishType.toLowerCase()));
        });

        let strategy = `面對${weakness.type}屬性威脅時：\n`;
        
        // 1. 優先推薦有抗性的隊員
        if (resistantTeamMembers.length > 0) {
            const resistant = resistantTeamMembers[0];
            strategy += `• 首選：派出 ${resistant.chineseName}（具有抗性，傷害減半）\n`;
            
            // 分析該寶可夢的戰術建議
            if (resistant.stats.attack > resistant.stats.specialAttack) {
                strategy += `  - 以物理攻擊為主，尋找機會近身作戰\n`;
            } else {
                strategy += `  - 以特殊攻擊為主，保持距離輸出\n`;
            }
        }
        
        // 2. 推薦能反擊的隊員
        if (counterTeamMembers.length > 0) {
            const counter = counterTeamMembers[0];
            strategy += `• 反擊手：使用 ${counter.chineseName}（屬性相剋，造成雙倍傷害）\n`;
            strategy += `  - 優先使用${counter.types.join('/')}屬性招式\n`;
            
            if (counter.stats.speed > 90) {
                strategy += `  - 速度優勢：可搶先攻擊\n`;
            } else {
                strategy += `  - 需注意先手問題，可考慮先使用其他隊員消耗\n`;
            }
        }
        
        // 3. 如果沒有直接克制，提供實戰策略
        if (resistantTeamMembers.length === 0 && counterTeamMembers.length === 0) {
            strategy += `• 劣勢應對策略：\n`;
            
            // 找出不會被剋制且最耐打的隊員作為肉盾
            const nonWeakMembers = team.filter(p => 
                !p.weaknesses.some(w => w.toLowerCase() === englishType.toLowerCase())
            );
            
            if (nonWeakMembers.length > 0) {
                const tankiest = nonWeakMembers.reduce((prev, current) => 
                    (prev.stats.hp + prev.stats.defense + prev.stats.specialDefense) > 
                    (current.stats.hp + current.stats.defense + current.stats.specialDefense) ? prev : current
                );
                strategy += `  - 肉盾戰術：派出 ${tankiest.chineseName}（不會被剋制，相對安全）\n`;
            } else {
                // 如果所有隊員都有弱點，選擇傷害最小的
                const leastWeak = team.reduce((prev, current) => {
                    const prevDefense = prev.stats.hp + prev.stats.defense + prev.stats.specialDefense;
                    const currentDefense = current.stats.hp + current.stats.defense + current.stats.specialDefense;
                    return prevDefense > currentDefense ? prev : current;
                });
                strategy += `  - 無奈之選：派出 ${leastWeak.chineseName}（最耐打，但仍有弱點）\n`;
                strategy += `  - ⚠️ 注意：所有隊員都會被剋制，務必快速切換\n`;
            }
            
            strategy += `  - 狀態戰術：使用睡眠粉、麻痺粉、毒粉等削弱對手\n`;
            strategy += `  - 消耗戰術：小招磨血，避免硬碰硬對決\n`;
            
            // 找出速度最快且不會被剋制的隊員
            const fastNonWeak = nonWeakMembers.length > 0 ? 
                nonWeakMembers.reduce((prev, current) => 
                    prev.stats.speed > current.stats.speed ? prev : current
                ) : null;
            
            if (fastNonWeak && fastNonWeak.stats.speed > 80) {
                strategy += `  - 速攻戰術：用 ${fastNonWeak.chineseName} 搶先手，打了就跑\n`;
            } else {
                const fastest = team.reduce((prev, current) => 
                    prev.stats.speed > current.stats.speed ? prev : current
                );
                strategy += `  - 孤注一擲：用 ${fastest.chineseName} 搶先手，但要承擔風險\n`;
            }
        }
        
        // 4. 通用戰術提醒
        const affectedMembers = team.filter(p => 
            p.weaknesses.some(w => w.toLowerCase() === englishType.toLowerCase())
        );
        
        if (affectedMembers.length > 0) {
            strategy += `• 切換時機：當${affectedMembers.map(p => p.chineseName).join('、')}面臨危險時立即切換\n`;
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
    const teamWeaknesses: { [key: string]: { count: number; affectedPokemon: string[] } } = {};
    selectedPokemon.forEach(p => {
        p.weaknesses.forEach(w => {
            const weaknessLower = w.toLowerCase();
            if (!teamWeaknesses[weaknessLower]) {
                teamWeaknesses[weaknessLower] = { count: 0, affectedPokemon: [] };
            }
            teamWeaknesses[weaknessLower].count += 1;
            teamWeaknesses[weaknessLower].affectedPokemon.push(p.chineseName);
        });
    });

    const sortedWeaknesses = Object.entries(teamWeaknesses)
        .sort(([, a], [, b]) => b.count - a.count)
        .map(([type, data]) => {
            const chineseType = typeTranslation[type] || type;
            const dangerousMovesList = dangerousMoves[type] || [];
            
            return { 
                type: chineseType, 
                count: data.count,
                affectedPokemon: data.affectedPokemon,
                dangerousMoves: dangerousMovesList.slice(0, 3) // 取前3個最危險的招式
            };
        });

    // 分析主要威脅並提供詳細理由
    const majorThreats: (PokemonData & { 
        threatReason: string; 
        advantageAgainst: string[];
        keyAdvantages: string[];
    })[] = [];

    // 分析所有主要弱點的威脅
    sortedWeaknesses.slice(0, 3).forEach(weakness => {
        const englishWeakness = Object.keys(typeTranslation).find(key => typeTranslation[key] === weakness.type);
        if (englishWeakness) {
            // 找出能使用該屬性攻擊的寶可夢
            const threateningPokemon = allPokemon.filter(p => {
                return p.types.some(pt => pt.toLowerCase() === englishWeakness.toLowerCase());
            });

            // 為每個威脅分析理由
            threateningPokemon.forEach(threat => {
                const affectedPokemon = selectedPokemon.filter(teamMember => 
                    teamMember.weaknesses.some(w => w.toLowerCase() === englishWeakness.toLowerCase())
                );

                if (affectedPokemon.length > 0) {
                    const keyAdvantages = [];
                    
                    // 分析攻擊優勢
                    if (threat.stats.attack > 100) {
                        keyAdvantages.push(`高攻擊力(${threat.stats.attack})`);
                    }
                    if (threat.stats.specialAttack > 100) {
                        keyAdvantages.push(`高特攻(${threat.stats.specialAttack})`);
                    }
                    if (threat.stats.speed > 80) {
                        keyAdvantages.push(`高速度(${threat.stats.speed})`);
                    }

                    const threatReason = `${threat.chineseName}的${weakness.type}屬性攻擊對${affectedPokemon.map(p => p.chineseName).join('、')}造成雙倍傷害`;

                    majorThreats.push({
                        ...threat,
                        threatReason,
                        advantageAgainst: affectedPokemon.map(p => p.chineseName),
                        keyAdvantages
                    });
                }
            });
        }
    });

    // 根據攻擊力和威脅程度排序，取前5名
    majorThreats.sort((a, b) => {
        const aScore = a.stats.attack + a.stats.specialAttack + (a.advantageAgainst.length * 50);
        const bScore = b.stats.attack + b.stats.specialAttack + (b.advantageAgainst.length * 50);
        return bScore - aScore;
    });

    const topThreats = majorThreats.slice(0, 8); // 增加到8個威脅

    // 提供替換建議 (簡化版：找出能抵抗隊伍主要弱點的寶可夢)
    const replacementSuggestions: PokemonData[] = [];
    if (sortedWeaknesses.length > 0) {
        const topWeakness = sortedWeaknesses[0];
        const englishTopWeakness = Object.keys(typeTranslation).find(key => typeTranslation[key] === topWeakness.type);
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
        majorThreats: topThreats,
        replacementSuggestions,
        battleOrder,
        counterStrategies,
    });
}
