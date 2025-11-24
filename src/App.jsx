import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DROPS = 2; // quantidade de etapas descartadas por piloto
const BONUS_POLE = 3; // Bônus de Pole Position
const BONUS_MV = 2; // Bônus de Melhor Volta
const BONUS_TOTAL_PARTICIPATION = 5; // Bônus por participação em todas as 8 etapas

// Tabela de pontuação (1º=25, 2º=20, 3º=18, 4º=15, 5º=12, 6º=11, 7º=10, 8º=8, 9º=6, 10º=4)
const POS_POINTS = [25, 20, 18, 15, 12, 11, 10, 8, 6, 4]; 
const getPointsForPosition = (position) => POS_POINTS[position - 1] || 0;


// Função para mapear nomes que apareceram diferentes nos PDFs
const normalizeDriverName = (name) => {
  // CORREÇÃO: Garante que é uma string antes de chamar .trim() e .toUpperCase()
  if (typeof name !== 'string' || !name) return ""; 

  const normalized = name.trim().toUpperCase();
  // Unificação de nomes longos e variações
  if (normalized.includes("GLAUCO AGUIAR")) return "Glauco Aguiar";
  if (normalized.includes("MARCOS VINICIUS")) return "Marcos Vinicius";
  if (normalized.includes("PEDRO CAVALCANTE")) return "Pedro Cavalcante";
  if (normalized.includes("ANTONIO ROCHA")) return "Antonio Rocha";
  if (normalized.includes("IGOR RODRIGUES")) return "Igor Rodrigues";
  if (normalized.includes("ERICK PACHECO")) return "Erick Pacheco";
  if (normalized.includes("CLEBER SANTOS")) return "Cleber Santos";
  if (normalized.includes("MARCUS BESSA")) return "Marcus Bessa";
  if (normalized.includes("MARJARA MAQUINÉ")) return "Marjara Maquiné";
  if (normalized.includes("ANA CRUZ")) return "Ana Cruz";
  if (normalized.includes("MARIO JUNIOR")) return "Mario Junior";
  if (normalized.includes("HUGO BERNARDES")) return "Hugo Bernardes";
  if (normalized.includes("WENDRIL")) return "Wendril Oliveira";
  if (normalized.includes("ENDERSON ALVES")) return "Enderson Alves";
  if (normalized.includes("AMARILDO VALE")) return "Amarildo Vale";
  if (normalized.includes("ERICK BITENCOURT")) return "Erick Bitencourt";
  if (normalized.includes("SAARA")) return "Saara Santos";
  if (normalized.includes("VITORIA")) return "Vitoria";
  if (normalized.includes("MATHEUS KEVENY")) return "Matheus Keveny";
  if (normalized.includes("DENILSON MARTINS")) return "Denilson Martins";
  if (normalized.includes("CLAUDIO AUGUSTO DE PAULA")) return "Claudio Augusto de Paula";
  if (normalized.includes("JUNIO")) return "Junio";
  if (normalized.includes("MARDEN ALMEIDA")) return "Marden Almeida";
  if (normalized.includes("BRUNO MATHEUS PINHEIRO")) return "Bruno Matheus";
  if (normalized.includes("PAULO HENRIQUE")) return "Paulo Henrique Silva";
  if (normalized.includes("FÁBIO OLIVEIRA")) return "Fábio Oliveira";
  
  return name.trim();
};

// ====================================================================================================
// FUNÇÃO PARA CALCULAR OS PONTOS TOTAIS DA ETAPA (Base + Bônus)
// Esta função será usada para recalcular os pontos históricos.
// ====================================================================================================

const calculateStagePoints = (resultsArray, poleWinner, mvWinner) => {
    const stageResults = {};
    resultsArray.forEach((r, index) => {
        const position = index + 1;
        const driverName = normalizeDriverName(r.driver);
        // Posições acima de 10 não pontuam na tabela base
        let points = getPointsForPosition(position);

        if (driverName === normalizeDriverName(poleWinner)) {
            points += BONUS_POLE;
        }
        if (driverName === normalizeDriverName(mvWinner)) {
            points += BONUS_MV;
        }
        stageResults[driverName] = points;
    });
    return stageResults;
};

// ====================================================================================================

// CORREÇÃO: Exportando a função diretamente
export default function App() {
  // ===== Dados iniciais (Atualizados com a nova regra de pontuação) =====
  const initialData = {
    totalStages: 8, // Total de etapas na temporada
    drivers: [
      "Glauco Aguiar", "Marcos Vinicius", "Pedro Cavalcante", "Antonio Rocha", 
      "Igor Rodrigues", "Erick Pacheco", "Cleber Santos", "Marcus Bessa", 
      "Marjara Maquiné", "Ana Cruz", "Mario Junior", "Hugo Bernardes", 
      "Wendril Oliveira", "Enderson Alves", "Amarildo Vale", "Erick Bitencourt", 
      "Saara Santos", "Vitoria", "Matheus Keveny", "Denilson Martins", 
      "Claudio Augusto de Paula", "Junio", "Marden Almeida", "Bruno Matheus",
      "Paulo Henrique Silva", "Fábio Oliveira"
    ].filter((d, i, self) => self.indexOf(d) === i), // Garante que a lista de pilotos é única
    stages: [
      {
        id: 1,
        name: "Etapa 1",
        poleWinner: "Glauco Aguiar",
        mvWinner: "Glauco Aguiar",
        results: calculateStagePoints([
          { driver: "Glauco Aguiar", position: 1 }, 
          { driver: "Marcos Vinicius", position: 2 }, 
          { driver: "Pedro Cavalcante", position: 3 }, 
          { driver: "Antonio Rocha", position: 4 }, 
          { driver: "Igor Rodrigues", position: 5 }, 
          { driver: "Erick Pacheco", position: 6 }, 
          { driver: "Cleber Santos", position: 7 }, 
          { driver: "Marcus Bessa", position: 8 }, 
        ], "Glauco Aguiar", "Glauco Aguiar"),
      },
      {
        id: 2,
        name: "Etapa 2",
        poleWinner: null,
        mvWinner: "Antonio Rocha",
        results: calculateStagePoints([
          { driver: "Antonio Rocha", position: 1 }, 
          { driver: "Mario Junior", position: 2 }, 
          { driver: "Hugo Bernardes", position: 3 }, 
          { driver: "Glauco Aguiar", position: 4 }, 
          { driver: "Marcos Vinicius", position: 5 }, 
          { driver: "Enderson Alves", position: 6 }, 
          { driver: "Wendril Oliveira", position: 7 }, 
          { driver: "Igor Rodrigues", position: 8 }, 
          { driver: "Amarildo Vale", position: 9 }, 
          { driver: "Cleber Santos", position: 10 }, 
        ], null, "Antonio Rocha"),
      },
      {
        id: 3,
        name: "Etapa 3",
        poleWinner: "Wendril Oliveira",
        mvWinner: "Wendril Oliveira",
        results: calculateStagePoints([
          { driver: "Wendril Oliveira", position: 1 }, 
          { driver: "Marcos Vinicius", position: 2 }, 
          { driver: "Pedro Cavalcante", position: 3 }, 
          { driver: "Antonio Rocha", position: 4 }, 
          { driver: "Glauco Aguiar", position: 5 }, 
          { driver: "Hugo Bernardes", position: 6 }, 
        ], "Wendril Oliveira", "Wendril Oliveira"),
      },
      {
        id: 4,
        name: "Etapa 4",
        poleWinner: "Wendril Oliveira",
        mvWinner: "Wendril Oliveira",
        results: calculateStagePoints([
          { driver: "Wendril Oliveira", position: 1 }, 
          { driver: "Marcos Vinicius", position: 2 }, 
          { driver: "Glauco Aguiar", position: 3 }, 
          { driver: "Saara Santos", position: 4 }, 
          { driver: "Pedro Cavalcante", position: 5 }, 
          { driver: "Vitoria", position: 6 }, 
          { driver: "Marcus Bessa", position: 7 }, 
          { driver: "Hugo Bernardes", position: 8 }, 
        ], "Wendril Oliveira", "Wendril Oliveira"),
      },
      {
        id: 5,
        name: "Etapa 5",
        poleWinner: null,
        mvWinner: "Wendril Oliveira",
        results: calculateStagePoints([
          { driver: "Mario Junior", position: 1 }, 
          { driver: "Glauco Aguiar", position: 2 }, 
          { driver: "Matheus Keveny", position: 3 }, 
          { driver: "Hugo Bernardes", position: 4 }, 
          { driver: "Denilson Martins", position: 5 }, 
          { driver: "Saara Santos", position: 6 }, 
          { driver: "Claudio Augusto de Paula", position: 7 }, 
          { driver: "Wendril Oliveira", position: 8 }, 
        ], null, "Wendril Oliveira"),
      },
      {
        id: 6,
        name: "Etapa 6",
        poleWinner: "Glauco Aguiar",
        mvWinner: "Mario Junior",
        results: calculateStagePoints([
          { driver: "Mario Junior", position: 1 }, 
          { driver: "Glauco Aguiar", position: 2 }, 
          { driver: "Junio", position: 3 }, 
          { driver: "Wendril Oliveira", position: 4 }, 
          { driver: "Marden Almeida", position: 5 }, 
          { driver: "Marcos Vinicius", position: 6 }, 
          { driver: "Bruno Matheus", position: 7 }, 
          { driver: "Pedro Cavalcante", position: 8 }, 
          { driver: "Hugo Bernardes", position: 9 }, 
          { driver: "Igor Rodrigues", position: 10 }, 
          // Pilotos com 0 pontos ou NC
          { driver: "Claudio Augusto de Paula", position: 11 }, 
          { driver: "Matheus Keveny", position: 12 }, 
          { driver: "Saara Santos", position: 13 }, 
        ], "Glauco Aguiar", "Mario Junior"),
      },
      {
        id: 7,
        name: "Etapa 7",
        poleWinner: "Mario Junior",
        mvWinner: "Mario Junior",
        results: calculateStagePoints([
          { driver: "Mario Junior", position: 1 }, // Base 25 + Pole 3 + MV 2 = 30
          { driver: "Paulo Henrique Silva", position: 2 }, // Base 20 = 20
          { driver: "Wendril Oliveira", position: 3 }, // Base 18 = 18
          { driver: "Saara Santos", position: 4 }, // Base 15 = 15
          { driver: "Hugo Bernardes", position: 5 }, // Base 12 = 12
          { driver: "Matheus Keveny", position: 6 }, // Base 11 = 11
          { driver: "Claudio Augusto de Paula", position: 7 }, // Base 10 = 10
          { driver: "Fábio Oliveira", position: 8 }, // Base 8 = 8
          { driver: "Marcos Vinicius", position: 9 }, // Base 6 = 6
          // Pilotos ausentes (0 pontos): Glauco Aguiar, Antonio Rocha, etc.
        ], "Mario Junior", "Mario Junior"),
      },
    ],
  };

  // ===== Estados =====
  const [championshipData, setChampionshipData] = useState(initialData);
  const [view, setView] = useState('total'); // 'total' | 'totalWithDrops' | stageId | 'analysis'
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [totalScoresNoDrop, setTotalScoresNoDrop] = useState([]);
  const [totalScoresWithDrop, setTotalScoresWithDrop] = useState([]);
  const [uniqueDrivers, setUniqueDrivers] = useState([]);

  // Atualiza a lista de pilotos únicos sempre que os dados mudam
  useEffect(() => {
    const driversSet = new Set(initialData.drivers);
    championshipData.stages.forEach((stage) => {
      Object.keys(stage.results).forEach((d) => driversSet.add(d));
    });
    setUniqueDrivers(Array.from(driversSet).sort());
  }, [championshipData, initialData.drivers]);

  // ===== Helpers de descarte =====
  const getDriverStageArray = (driver) =>
    championshipData.stages.map((stage) => ({
      stageId: stage.id,
      stageName: stage.name,
      points: stage.results[driver] ?? 0,
    }));

  const computeDropSetForDriver = (driver) => {
    const arr = getDriverStageArray(driver);
    
    // Se o número total de etapas é menor ou igual ao número de drops, nada é descartado
    if (arr.length <= DROPS) {
        return new Set();
    }

    // Ordena TODOS os resultados, incluindo pontuação 0 (ausências), do menor para o maior
    const sorted = arr
      .map((s) => ({ stageId: s.stageId, points: s.points }))
      .sort((a, b) => a.points - b.points); 

    // Seleciona os DROPS piores resultados (as ausências virão primeiro)
    const toDrop = sorted.slice(0, DROPS).map((o) => o.stageId);
    return new Set(toDrop);
  };
  // =========================================================

  const sumPointsWithDrops = (driver) => {
    const dropSet = computeDropSetForDriver(driver);
    let sum = 0;
    let stagesParticipated = 0;
    championshipData.stages.forEach((stage) => {
      const pts = stage.results[driver] ?? 0;
      if (pts > 0) stagesParticipated++;
      if (!dropSet.has(stage.id)) sum += pts;
    });
    
    // Verifica o bônus de participação total, mas só aplica no final da temporada
    if (championshipData.stages.length === initialData.totalStages && stagesParticipated === initialData.totalStages) {
        sum += BONUS_TOTAL_PARTICIPATION;
    }
    
    return { sum, dropSet, stagesParticipated };
  };

  // ===== Cálculo dos dois rankings =====
  useEffect(() => {
    const driversToRank = uniqueDrivers;

    // Sem descarte
    const scoresNoDrop = {};
    driversToRank.forEach((d) => (scoresNoDrop[d] = 0));
    championshipData.stages.forEach((stage) => {
      for (const d in stage.results) {
          const normalizedName = normalizeDriverName(d);
          if (scoresNoDrop.hasOwnProperty(normalizedName)) {
              scoresNoDrop[normalizedName] += stage.results[d];
          }
      }
    });
    const sortedNoDrop = Object.entries(scoresNoDrop)
      .map(([driver, score]) => ({ driver, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 18); // Limita ao Top 18
    setTotalScoresNoDrop(sortedNoDrop);

    // Com descarte
    const scoresWithDrop = {};
    driversToRank.forEach((d) => {
      const { sum } = sumPointsWithDrops(d);
      scoresWithDrop[d] = sum;
    });
    const sortedWithDrop = Object.entries(scoresWithDrop)
      .map(([driver, score]) => ({ driver, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 18); // Limita ao Top 18
    setTotalScoresWithDrop(sortedWithDrop);
  }, [championshipData, uniqueDrivers]);


  // ===== UI: itens de piloto =====
  const renderDriverItem = (item, index) => {
    const position = index + 1;
    let liClasses =
      "flex items-center justify-between p-4 md:p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] cursor-pointer ";
    let nameClasses = "text-lg md:text-xl ";
    let pointsClasses = "text-lg md:text-xl font-bold ";

    switch (position) {
      case 1:
        liClasses += "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold transform scale-105";
        nameClasses += "text-gray-900 font-bold";
        pointsClasses += "text-gray-900";
        break;
      case 2:
        liClasses += "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900 font-semibold";
        nameClasses += "text-gray-900 font-semibold";
        pointsClasses += "text-gray-900";
        break;
      case 3:
        liClasses += "bg-gradient-to-r from-yellow-800 to-yellow-900 text-gray-100 font-semibold";
        nameClasses += "text-gray-100 font-semibold";
        pointsClasses += "text-gray-100";
        break;
      default:
        liClasses += "bg-gray-700 hover:bg-gray-600";
        nameClasses += "text-white";
        pointsClasses += "text-green-400";
        break;
    }

    return (
      <li
        key={item.driver}
        className={liClasses}
        onClick={(e) => { // CAPTURA E PREVINE O EVENTO AQUI
          e.stopPropagation();
          setSelectedDriver(item.driver);
          setView("analysis");
        }}
      >
        <div className="flex items-center space-x-4">
          {position === 1 && <span className="text-3xl md:text-4xl">🥇</span>}
          {position === 2 && <span className="text-3xl md:text-4xl">🥈</span>}
          {position === 3 && <span className="text-3xl md:text-4xl">🥉</span>}
          {position > 3 && (
            <span className="text-2xl font-bold text-gray-300 w-8 text-center">{position}º</span>
          )}
          <span className={nameClasses}>{item.driver}</span>
        </div>
        <div className={pointsClasses}>{item.score} Pontos</div>
      </li>
    );
  };

  const renderScoreboard = (title, subtitle, list) => (
    <div className="p-6 rounded-3xl w-full animate-fadeIn">
      <h2 className="text-3xl font-bold mb-2 text-white text-center">{title}</h2>
      {subtitle && <p className="text-gray-400 text-center mb-6">{subtitle}</p>}
      <ul className="space-y-4">{list.map((item, index) => renderDriverItem(item, index))}</ul>
    </div>
  );

  const renderStageScoreboard = (stageId) => {
    const stage = championshipData.stages.find((s) => s.id === stageId);
    if (!stage) return <div className="text-white text-center p-8">Etapa não encontrada.</div>;

    const sortedResults = Object.entries(stage.results)
      .map(([driver, score]) => ({ driver, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 18); // Limita ao Top 18

    return (
      <div className="p-6 rounded-3xl w-full animate-fadeIn">
        <h2 className="text-3xl font-bold mb-2 text-white text-center">{stage.name}</h2>
        {stage.poleWinner && <p className="text-yellow-400 text-center text-sm">Pole Position: {stage.poleWinner} (+{BONUS_POLE} pts)</p>}
        {stage.mvWinner && <p className="text-blue-400 text-center text-sm mb-4">Melhor Volta: {stage.mvWinner} (+{BONUS_MV} pts)</p>}
        <p className="text-gray-400 text-center mb-6">Resultados da Etapa</p>
        <ul className="space-y-4">
          {sortedResults.map((item, index) => renderDriverItem(item, index))}
        </ul>
      </div>
    );
  };

  // ===== Análise do piloto =====
  const generatePilotAnalysis = (driverName, rankNoDrop, totalNoDrop, rankWithDrop, totalWithDrop, driverStages) => {
    const stagesCompleted = driverStages.length;
    const stagesRemaining = Math.max(initialData.totalStages - stagesCompleted, 0);

    // Encontra a posição real na etapa
    const detailedStages = driverStages.map(stage => {
        let position = "Ausente";
        if (stage.points > 0) {
            const stageData = championshipData.stages.find(s => s.id === stage.id);
            const sortedStageResults = Object.entries(stageData.results)
                .map(([driver, score]) => ({ driver: normalizeDriverName(driver), score }))
                .sort((a, b) => b.score - a.score);
            position = sortedStageResults.findIndex((d) => d.driver === driverName) + 1;
        }
        return { ...stage, position };
    });

    const performanceData = detailedStages.filter((stage) => stage.points > 0);

    const podios = performanceData.filter((stage) => typeof stage.position === "number" && stage.position <= 3).length;
    const vitorias = performanceData.filter((stage) => stage.position === 1).length;

    let parts = [];
    parts.push(
      `${driverName} está na posição ${rankNoDrop}º (sem descarte, ${totalNoDrop} pts) e ${rankWithDrop}º (com descarte, ${totalWithDrop} pts).`
    );

    if (performanceData.length > 0) {
      parts.push(`Pontuou em ${performanceData.length} de ${stagesCompleted} etapas.`);
    } else {
      parts.push(`Ainda busca os primeiros pontos na temporada.`);
    }

    if (podios > 0) parts.push(`Tem ${podios} pódio(s), sendo ${vitorias} vitória(s).`);

    let projection = "";
    if (stagesRemaining === 0) {
        if (rankWithDrop === 1) projection = "Parabéns! É o virtual campeão, aguardando a oficialização.";
        else if (rankWithDrop <= 3) projection = "Temporada excelente! Garantiu um lugar no pódio do campeonato.";
        else projection = "Temporada concluída. Foco na preparação para o próximo ano!";
    } else if (rankWithDrop <= 2) {
      projection = `Mantendo a performance, o título está próximo. Concentração total nas últimas ${stagesRemaining} etapas.`;
    } else if (rankWithDrop <= 5) {
      projection = `A briga pelo Top 3 está aberta. Pódios nas próximas ${stagesRemaining} etapas são cruciais para subir no ranking.`;
    } else {
      projection = `O foco agora é recuperação e consistência: cada ponto restante será vital para melhorar o ranking final.`;
    }

    parts.push(`Projeção: ${projection}`);
    return parts.join(" ");
  };

  const renderDriverAnalysis = () => {
    if (!selectedDriver) return null;

    const dropSet = computeDropSetForDriver(selectedDriver);

    const driverStages = championshipData.stages.map((stage) => {
      const points = stage.results[selectedDriver] ?? 0;

      let position = "Ausente";
      let isPole = normalizeDriverName(stage.poleWinner) === selectedDriver;
      let isMV = normalizeDriverName(stage.mvWinner) === selectedDriver;
      
      if (points > 0) {
        const sortedStageResults = Object.entries(stage.results)
          .map(([driver, score]) => ({ driver: normalizeDriverName(driver), score }))
          .sort((a, b) => b.score - a.score);
        position = sortedStageResults.findIndex((d) => d.driver === selectedDriver) + 1;
      }

      return {
        id: stage.id,
        name: stage.name,
        points,
        position,
        isPole,
        isMV,
        dropped: dropSet.has(stage.id),
      };
    });

    const totalNoDrop = totalScoresNoDrop.find((d) => d.driver === selectedDriver)?.score ?? 0;
    const totalWithDrop = totalScoresWithDrop.find((d) => d.driver === selectedDriver)?.score ?? 0;

    const rankNoDrop = (totalScoresNoDrop.findIndex((d) => d.driver === selectedDriver) + 1) || 0;
    const rankWithDrop = (totalScoresWithDrop.findIndex((d) => d.driver === selectedDriver) + 1) || 0;

    const chartData = driverStages.map((stage) => ({
      name: stage.name,
      position: stage.position === "Ausente" ? null : stage.position,
      invertedPosition: stage.position === "Ausente" ? null : stage.position,
    }));

    const analysisText = generatePilotAnalysis(
      selectedDriver,
      rankNoDrop,
      totalNoDrop,
      rankWithDrop,
      totalWithDrop,
      driverStages
    );

    const droppedInfo = driverStages
      .filter((s) => s.dropped)
      .map((s) => `${s.name} (${s.points} pts)`)
      .join(", ");

    return (
      <div className="bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-700 w-full animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">{selectedDriver}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-200">
              Sem descarte: <span className="font-bold">{rankNoDrop}º</span>
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-700 text-white">
              c/ descarte: <span className="font-bold">{rankWithDrop}º</span>
            </span>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-xl mb-3">
          <p className="text-md text-gray-300">
            Pontuação Bruta (Sem descarte):&nbsp;
            <span className="font-semibold text-gray-100">{totalNoDrop}</span> pts
          </p>
          <p className="text-md text-gray-300">
            Pontuação Válida (Com descarte):&nbsp;
            <span className="font-semibold text-green-400">{totalWithDrop}</span> pts
          </p>
        </div>

        <div className="bg-gray-700 p-3 rounded-xl mb-6">
          <p className="text-sm text-gray-300">
            Descartes ({DROPS} piores etapas com pontos): <span className="font-medium text-gray-100">{droppedInfo || "Nenhum resultado descartado"}</span>
          </p>
        </div>

        <div className="bg-gray-700 p-4 rounded-xl mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Análise da Temporada</h3>
          <p className="text-gray-300 whitespace-pre-line">{analysisText}</p>
        </div>

        <h3 className="text-2xl font-bold text-white mb-4">Evolução de Posição</h3>
        <div className="w-full h-80 bg-gray-900 rounded-lg p-4 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="name" stroke="#cbd5e0" />
              <YAxis
                label={{ value: "Posição", angle: -90, position: "insideLeft", fill: "#cbd5e0" }}
                stroke="#cbd5e0"
                domain={[12, 1]} // Limita de 1º a 12º e inverte a ordem
                tickCount={12}
                reversed={true} // O maior número (12) fica na base, 1 no topo
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#2d3748", border: "none", borderRadius: "8px" }}
                labelStyle={{ color: "#e2e8f0" }}
                itemStyle={{ color: "#e2e8f0" }}
                formatter={(value, name, props) => {
                  const realPosition = props.payload.position;
                  if (realPosition === null) return ["Ausente", "Posição"];
                  return [`Posição: ${realPosition}º`, "Posição"];
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="invertedPosition" stroke="#4299e1" strokeWidth={2} name="Posição" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h3 className="text-2xl font-bold text-white mb-4">Performance Detalhada</h3>
        <ul className="space-y-3">
          {driverStages.map((stage) => (
            <li
              key={stage.id}
              className={`p-4 rounded-lg flex justify-between items-center ${
                stage.dropped ? "bg-gray-800 border border-dashed border-gray-600 opacity-70" : "bg-gray-900"
              }`}
              title={stage.dropped ? "Etapa descartada" : undefined}
            >
              <div className="flex items-center space-x-3">
                <span className="text-gray-300 text-lg">
                  {stage.name}: {stage.position === "Ausente" ? "Ausente" : `P${stage.position}`}
                </span>
                {stage.isPole && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-600 text-gray-900 font-bold">POLE</span>}
                {stage.isMV && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">MV</span>}
                {stage.dropped && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-200">
                    descartada
                  </span>
                )}
              </div>
              <span
                className={`font-bold text-lg ${
                  stage.dropped ? "text-gray-400 line-through" : "text-green-400"
                }`}
              >
                {stage.points} Pontos
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setView("total")}
          className="mt-8 flex items-center justify-center w-full py-3 px-6 rounded-full font-bold text-white bg-gray-700 hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
        >
          Voltar para Geral
        </button>
      </div>
    );
  }

  // ===== Render principal (CORRIGIDO) =====
  return (
    <div className="bg-gray-900 min-h-screen p-8 font-sans flex flex-col items-center">
      <div className="max-w-xl w-full">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">TEMPORADA DE KART 2025</h1>
        </header>

        {/* Controles de visualização */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          {/* Geral */}
          <button
            onClick={() => {
              setView("total");
              setSelectedDriver(null);
            }}
            className={`py-3 px-6 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
              view === "total" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Geral
          </button>

          {/* Final (com descarte) */}
          <button
            onClick={() => {
              setView("totalWithDrops");
              setSelectedDriver(null);
            }}
            className={`py-3 px-6 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
              view === "totalWithDrops" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            title={`Aplica descarte das ${DROPS} piores etapas por piloto`}
          >
            Final
          </button>

          {/* Etapas */}
          <div className="relative inline-block w-full sm:w-auto">
            <select
              value={view === "total" || view === "totalWithDrops" || view === "analysis" ? "" : view}
              onChange={(e) => {
                setView(parseInt(e.target.value, 10));
                setSelectedDriver(null);
              }}
              className="appearance-none bg-gray-700 text-gray-300 py-3 px-6 pr-10 rounded-full font-bold transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-center"
            >
              <option value="" disabled className="bg-gray-800">
                Etapas
              </option>
              {championshipData.stages.map((stage) => (
                <option key={stage.id} value={stage.id} className="bg-gray-800">
                  {stage.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.05 6.879 4.636 8.293 9.293 12.95z" />
              </svg>
            </div>
          </div>

          {/* Regulamento */}
          <a
            href="https://drive.google.com/file/d/1Hq_C-DA0437ZDJR8Ob8Rg3NM0lLAbUka/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-6 rounded-full font-bold transition-all duration-300 transform hover:scale-105 bg-gray-700 text-gray-300 hover:bg-gray-600 w-full sm:w-auto"
          >
            Regulamento
          </a>
        </div>

        {/* Conteúdo principal */}
        <main className="mt-8">
          {view === "total" &&
            renderScoreboard(
              "Classificação Geral",
              `Ranking após ${championshipData.stages.length} etapa(s) (sem descarte)`,
              totalScoresNoDrop
            )}

          {view === "totalWithDrops" &&
            renderScoreboard(
              "Classificação Final",
              `Ranking após ${championshipData.stages.length} etapa(s) — descartando as ${DROPS} piores por piloto`,
              totalScoresWithDrop
            )}

          {view !== "total" && view !== "totalWithDrops" && view !== "analysis" && renderStageScoreboard(view)}
          {view === "analysis" && renderDriverAnalysis()}
        </main>
      </div>
    </div>
  );
}
