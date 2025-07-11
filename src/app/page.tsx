'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface AnalysisResult {
  selectedPokemon: PokemonData[];
  missingPokemon: string[];
  teamWeaknesses: { type: string; count: number }[];
  majorThreats: PokemonData[];
  replacementSuggestions: PokemonData[];
}

export default function Home() {
  const [pokemonInput, setPokemonInput] = useState<string>('');
  const [selectedPokemonNames, setSelectedPokemonNames] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allPokemonList, setAllPokemonList] = useState<PokemonData[]>([]);

  useEffect(() => {
    // Fetch all pokemon data for suggestions
    const fetchAllPokemon = async () => {
      try {
        const response = await fetch('/pokemon_data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch pokemon data');
        }
        const data: PokemonData[] = await response.json();
        setAllPokemonList(data);
      } catch (err) {
        console.error('Error fetching all pokemon:', err);
        setError('無法載入寶可夢資料，請檢查網路或檔案是否存在。');
      }
    };
    fetchAllPokemon();
  }, []);

  const handleAddPokemon = () => {
    const name = pokemonInput.trim();
    if (name && selectedPokemonNames.length < 3 && !selectedPokemonNames.includes(name)) {
      setSelectedPokemonNames([...selectedPokemonNames, name]);
      setPokemonInput('');
    }
  };

  const handleRemovePokemon = (nameToRemove: string) => {
    setSelectedPokemonNames(selectedPokemonNames.filter(name => name !== nameToRemove));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pokemonNames: selectedPokemonNames }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || '分析失敗');
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || '發生未知錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">寶可夢對戰建議系統</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>選擇你的寶可夢隊伍 (最多3隻)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="輸入寶可夢英文或中文名稱"
              value={pokemonInput}
              onChange={(e) => setPokemonInput(e.target.value)}
              list="pokemon-suggestions"
            />
            <datalist id="pokemon-suggestions">
              {allPokemonList.map((p) => (
                <option key={p["全國編號"]} value={p["英文"]}>
                  {p["中文譯名"]}
                </option>
              ))}
            </datalist>
            <Button
              onClick={handleAddPokemon}
              disabled={selectedPokemonNames.length >= 3 || !pokemonInput}
            >
              新增
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedPokemonNames.map((name) => (
              <span key={name} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                {name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePokemon(name)}
                  className="ml-2 h-auto p-0 text-red-500 hover:text-red-700"
                >
                  &times;
                </Button>
              </span>
            ))}
          </div>

          <Button
            onClick={handleAnalyze}
            className="w-full"
            disabled={selectedPokemonNames.length === 0 || loading}
          >
            {loading ? '分析中...' : '分析隊伍'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="bg-red-100 border border-red-400 text-red-700 mb-4">
          <CardContent className="py-3">
            <strong className="font-bold">錯誤!</strong>
            <span className="block sm:inline"> {error}</span>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 隊伍總覽 */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>你的隊伍</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {analysisResult.selectedPokemon.map((p) => (
                  <Card key={p["全國編號"]} className="p-4 text-center">
                    <Image src={p["圖片連結"]} alt={p["中文譯名"]} width={96} height={96} className="mx-auto mb-2" />
                    <h3 className="text-lg font-bold">{p["中文譯名"]} ({p["英文"]})</h3>
                    <p>屬性: {p["屬性"]}</p>
                    <p>弱點: {p["弱點"]}</p>
                    <p>抗性: {p["抗性"]}</p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 隊伍弱點 */}
          <Card>
            <CardHeader>
              <CardTitle>隊伍弱點分析</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult.teamWeaknesses.length > 0 ? (
                <ul className="list-disc list-inside">
                  {analysisResult.teamWeaknesses.map((w) => (
                    <li key={w.type}>對 {w.type} 屬性有 {w.count} 個弱點</li>
                  ))}
                </ul>
              ) : (
                <p>你的隊伍沒有明顯的共通弱點。</p>
              )}
            </CardContent>
          </Card>

          {/* 主要威脅 */}
          <Card>
            <CardHeader>
              <CardTitle>主要威脅 (基於隊伍最弱點)</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult.majorThreats.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {analysisResult.majorThreats.map((p) => (
                    <Card key={p["全國編號"]} className="p-4 flex items-center space-x-4">
                      <Image src={p["圖片連結"]} alt={p["中文譯名"]} width={64} height={64} />
                      <div>
                        <h3 className="font-bold">{p["中文譯名"]} ({p["英文"]})</h3>
                        <p>屬性: {p["屬性"]}</p>
                        <p>攻擊: {p["攻擊"]}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>目前沒有找到明顯的主要威脅。</p>
              )}
            </CardContent>
          </Card>

          {/* 替換建議 */}
          <Card>
            <CardHeader>
              <CardTitle>替換建議 (彌補隊伍弱點)</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult.replacementSuggestions.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {analysisResult.replacementSuggestions.map((p) => (
                    <Card key={p["全國編號"]} className="p-4 flex items-center space-x-4">
                      <Image src={p["圖片連結"]} alt={p["中文譯名"]} width={64} height={64} />
                      <div>
                        <h3 className="font-bold">{p["中文譯名"]} ({p["英文"]})</h3>
                        <p>屬性: {p["屬性"]}</p>
                        <p>防禦: {p["防禦"]}</p>
                        <p>特防: {p["特殊防禦"]}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>目前沒有找到合適的替換建議。</p>
              )}
            </CardContent>
          </Card>

          {analysisResult.missingPokemon.length > 0 && (
            <Card className="col-span-full bg-yellow-100 border border-yellow-400 text-yellow-700">
              <CardContent className="py-3">
                <strong className="font-bold">注意!</strong>
                <span className="block sm:inline"> 以下寶可夢名稱未找到或有誤: {analysisResult.missingPokemon.join(', ')}</span>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}