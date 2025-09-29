import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Quantidade de etapas descartadas por piloto
const DROPS = 2;

// Total de etapas na temporada para calcular o bônus de participação
const TOTAL_SEASON_STAGES = 8; 

// Constantes dos bônus de pontuação
const PP_BONUS = 3; // Pole Position
const MV_BONUS = 2; // Volta Mais Rápida
const TOTAL_PARTICIPATION_BONUS = 5; // Bônus por 100% de presença (aplicado no ranking final, ao final da temporada)

/**
 * Função utilitária para transformar um número de classificação (1º, 2º, 3º...)
 * em uma cor/emoji de medalha para a lista de resultados.
 * @param {number} position - Posição do piloto (1, 2, 3, ...)
 * @returns {{liClasses: string, nameClasses: string, pointsClasses: string, icon: JSX.Element}}
 */
const getPositionStyles = (position) => {
  let liClasses =
    "flex items-center justify-between p-4 md:p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] cursor-pointer ";
  let nameClasses = "text-lg md:text-xl ";
  let pointsClasses = "text-lg md:text-xl font-bold ";
  let icon = null;

  switch (position) {
    case 1:
      liClasses += "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold transform scale-105";
      nameClasses += "text-gray-900 font-bold";
      pointsClasses += "text-gray-900";
      icon = <span className="text-3xl md:text-4xl">🥇</span>;
      break;
    case 2:
      liClasses += "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900 font-semibold";
      nameClasses += "text-gray-900 font-semibold";
      pointsClasses += "text-gray-900";
      icon = <span className="text-3xl md:text-4xl">🥈</span>;
      break;
    case 3:
      liClasses += "bg-gradient-to-r from-yellow-800 to-yellow-900 text-gray-100 font-semibold";
      nameClasses += "text-gray-100 font-semibold";
      pointsClasses += "text-gray-100";
      icon = <span className="text-3xl md:text-4xl">🥉</span>;
      break;
    default:
      liClasses += "bg-gray-700 hover:bg-gray-600";
      nameClasses += "text-white";
      pointsClasses += "text-green-400";
      icon = (
        <span className="text-2xl font-bold text-gray-300 w-8 text-center">{position}º</span>
      );
      break;
  }

  return { liClasses, nameClasses, pointsClasses, icon };
};

const App = () => {
  // ===== Dados iniciais =====
  // Pontuações atualizadas para 25 (1º), 20 (2º), 18 (3º), mais bônus.
  const initialData = {
    drivers: [
      "Glauco Aguiar",
      "Marcos Vinicius",
      "Pedro Cavalcante",
      "Antonio Rocha",
      "Igor Rodrigues",
      "Erick Pacheco",
      "Cleber Santos",
      "Marcus Bessa",
      "Marjara Maquiné",
      "Ana Cruz",
      "Mario Junior",
      "Hugo Bernardes",
      "Wendril Oliveira",
      "Enderson Alves",
      "Amarildo Vale",
      "Erick Bitencourt",
      "Saara Santos",
      "Vitoria",
      "Matheus Keveny",
      "Denilson Martins",
      "Claudio Augusto de Paula"
    ],
    stages: [
      {
        id: 1,
        name: "Etapa 1",
        poleWinner: "Glauco Aguiar", // +3 pts
        mvWinner: "Glauco Aguiar", // +2 pts
        results: {
          "Glauco Aguiar": 25 + PP_BONUS + MV_BONUS, // 30
          "Marcos Vinicius": 20,
          "Pedro Cavalcante": 18,
          "Antonio Rocha": 15,
          "Igor Rodrigues": 12,
          "Erick Pacheco": 11,
          "Cleber Santos": 10,
          "Marcus Bessa": 8,
          // Os demais pilotos não pontuaram
          "Marjara Maquiné": 0, "Ana Cruz": 0, "Mario Junior": 0, "Hugo Bernardes": 0, "Wendril Oliveira": 0, 
          "Enderson Alves": 0, "Amarildo Vale": 0, "Erick Bitencourt": 0, "Saara Santos": 0, "Vitoria": 0,
          "Matheus Keveny": 0, "Denilson Martins": 0, "Claudio Augusto de Paula": 0,
        },
      },
      {
        id: 2,
        name: "Etapa 2",
        poleWinner: null, // +0 pts
        mvWinner: "Antonio Rocha", // +2 pts
        results: {
          "Antonio Rocha": 25 + MV_BONUS, // 27
          "Mario Junior": 20,
          "Hugo Bernardes": 18,
          "Glauco Aguiar": 15,
          "Marcos Vinicius": 12,
          "Enderson Alves": 11,
          "Wendril Oliveira": 10,
          "Igor Rodrigues": 8,
          "Amarildo Vale": 6,
          "Cleber Santos": 4,
          // Os demais pilotos não pontuaram
          "Pedro Cavalcante": 0, "Erick Bitencourt": 0, "Erick Pacheco": 0, "Marcus Bessa": 0, "Marjara Maquiné": 0, 
          "Ana Cruz": 0, "Saara Santos": 0, "Vitoria": 0, "Matheus Keveny": 0, "Denilson Martins": 0, "Claudio Augusto de Paula": 0,
        },
      },
      {
        id: 3,
        name: "Etapa 3",
        poleWinner: "Wendril Oliveira", // +3 pts
        mvWinner: "Wendril Oliveira", // +2 pts
        results: {
          "Wendril Oliveira": 25 + PP_BONUS + MV_BONUS, // 30
          "Marcos Vinicius": 20,
          "Pedro Cavalcante": 18,
          "Antonio Rocha": 15,
          "Glauco Aguiar": 12,
          "Hugo Bernardes": 11,
          // Os demais pilotos não pontuaram
          "Mario Junior": 0, "Enderson Alves": 0, "Igor Rodrigues": 0, "Amarildo Vale": 0, "Erick Bitencourt": 0, 
          "Erick Pacheco": 0, "Marcus Bessa": 0, "Marjara Maquiné": 0, "Ana Cruz": 0, "Cleber Santos": 0, 
          "Saara Santos": 0, "Vitoria": 0, "Matheus Keveny": 0, "Denilson Martins": 0, "Claudio Augusto de Paula": 0,
        },
      },
      {
        id: 4,
        name: "Etapa 4",
        poleWinner: "Wendril Oliveira", // +3 pts
        mvWinner: "Wendril Oliveira", // +2 pts
        results: {
          "Wendril Oliveira": 25 + PP_BONUS + MV_BONUS, // 30
          "Marcos Vinicius": 20,
          "Glauco Aguiar": 18,
          "Saara Santos": 15,
          "Pedro Cavalcante": 12,
          "Vitoria": 11,
          "Marcus Bessa": 10,
          "Hugo Bernardes": 8,
          // Os demais pilotos não pontuaram
          "Antonio Rocha": 0, "Igor Rodrigues": 0, "Erick Pacheco": 0, "Cleber Santos": 0, "Marjara Maquiné": 0, 
          "Ana Cruz": 0, "Mario Junior": 0, "Enderson Alves": 0, "Amarildo Vale": 0, "Erick Bitencourt": 0, 
          "Matheus Keveny": 0, "Denilson Martins": 0, "Claudio Augusto de Paula": 0,
        },
      },
      {
        id: 5,
        name: "Etapa 5",
        poleWinner: null, // +0 pts
        mvWinner: "Wendril Oliveira", // +2 pts
        results: {
          "Mario Junior": 25, // 1º lugar, sem bônus
          "Glauco Aguiar": 20, // 2º lugar
          "Matheus Keveny": 18, // 3º lugar
          "Hugo Bernardes": 15, // 4º lugar
          "Denilson Martins": 12, // 5º lugar
          "Saara Santos": 11, // 6º lugar
          "Claudio Augusto de Paula": 10, // 7º lugar
          "Wendril Oliveira": 8 + MV_BONUS, // 8º lugar + Bônus MV = 10
          // Listagem completa dos demais com 0 pontos
          "Marcos Vinicius": 0, "Pedro Cavalcante": 0, "Antonio Rocha": 0, "Igor Rodrigues": 0, 
          "Erick Pacheco": 0, "Cleber Santos": 0, "Marcus Bessa": 0, "Marjara Maquiné": 0, "Ana Cruz": 0,
          "Enderson Alves": 0, "Amarildo Vale": 0, "Erick Bitencourt": 0, "Vitoria": 0,
        },
      },
    ],
  };

  // ===== Estados =====
  const [championshipData, setChampionshipData] = useState(initialData);
  // Controla a visualização: 'total' | 'totalWithDrops' | stageId (number) | 'analysis'
  const [view, setView] = useState('total');
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Rankings calculados
  const [totalScoresNoDrop, setTotalScoresNoDrop] = useState([]);
  const [totalScoresWithDrop, setTotalScoresWithDrop] = useState([]);

  // ===== Lógica de Cálculo e Descarte =====

  /**
   * Calcula o conjunto de IDs das etapas que devem ser descartadas para um piloto.
   * @param {string} driver - Nome do piloto
   * @returns {Set<number>} - IDs das etapas a serem descartadas.
   */
  const computeDropSetForDriver = (driver) => {
    // 1. Array de objetos { pontos, índice da etapa }
    const arr = championshipData.stages.map((s, idx) => ({
      idx,
      points: s.results[driver] ?? 0
    }));

    // 2. Ordena pelos pontos em ordem crescente (do pior para o melhor)
    const sorted = arr.sort((a, b) => a.points - b.points);

    // 3. Pega os DROPS piores (mínimo entre DROPS e o número total de etapas)
    const stagesToDropIndices = sorted.slice(0, Math.min(DROPS, arr.length)).map((o) => o.idx);

    // 4. Mapeia de volta para os IDs das etapas e retorna como um Set para consulta rápida
    return new Set(stagesToDropIndices.map((i) => championshipData.stages[i].id));
  };

  /**
   * Soma os pontos de um piloto, aplicando a regra de descarte.
   * @param {string} driver - Nome do piloto
   * @returns {{ sum: number, dropSet: Set<number> }} - Soma total e o Set de etapas descartadas.
   */
  const sumPointsWithDrops = (driver) => {
    const dropSet = computeDropSetForDriver(driver);
    let sum = 0;
    championshipData.stages.forEach((stage) => {
      const pts = stage.results[driver] ?? 0;
      if (!dropSet.has(stage.id)) sum += pts;
    });
    return { sum, dropSet };
  };

  // ===== Efeito para recalcular rankings sempre que os dados mudam =====
  useEffect(() => {
    // Identifica todos os pilotos que participaram de alguma etapa
    const driversSet = new Set();
    championshipData.stages.forEach((stage) => {
      Object.keys(stage.results).forEach((d) => driversSet.add(d));
    });
    const allDrivers = Array.from(driversSet);
    const stagesCompleted = championshipData.stages.length;
    const allStagesCompleted = stagesCompleted === TOTAL_SEASON_STAGES;

    // 1. Cálculo do ranking SEM descarte
    const scoresNoDrop = {};
    allDrivers.forEach((d) => (scoresNoDrop[d] = 0));
    championshipData.stages.forEach((stage) => {
      for (const d in stage.results) scoresNoDrop[d] += stage.results[d];
    });
    const sortedNoDrop = Object.entries(scoresNoDrop)
      .map(([driver, score]) => ({ driver, score }))
      .sort((a, b) => b.score - a.score);
    setTotalScoresNoDrop(sortedNoDrop);

    // 2. Cálculo do ranking COM descarte (APLICA BÔNUS DE PARTICIPAÇÃO AQUI SE A TEMPORADA ACABOU)
    const scoresWithDrop = {};
    allDrivers.forEach((d) => {
      const { sum } = sumPointsWithDrops(d);
      let finalScore = sum;

      // Verifica 100% de participação para aplicar bônus (somente se a temporada terminou)
      const driverParticipatedInAll = championshipData.stages.every(stage => (stage.results[d] ?? 0) > 0);

      if (allStagesCompleted && driverParticipatedInAll) {
          finalScore += TOTAL_PARTICIPATION_BONUS;
      }
      
      scoresWithDrop[d] = finalScore;
    });
    const sortedWithDrop = Object.entries(scoresWithDrop)
      .map(([driver, score]) => ({ driver, score }))
      .sort((a, b) => b.score - a.score);
    setTotalScoresWithDrop(sortedWithDrop);
  }, [championshipData]);

  // ===== UI: item de piloto na lista =====
  const renderDriverItem = (item, index) => {
    const position = index + 1;
    const { liClasses, nameClasses, pointsClasses, icon } = getPositionStyles(position);

    return (
      <li
        key={item.driver}
        className={liClasses}
        onClick={() => {
          setSelectedDriver(item.driver);
          setView("analysis");
        }}
      >
        <div className="flex items-center space-x-4">
          {icon}
          <span className={nameClasses}>{item.driver}</span>
        </div>
        <div className={pointsClasses}>{item.score} Pontos</div>
      </li>
    );
  };

  // ===== UI: renderização do placar geral/final =====
  const renderScoreboard = (title, subtitle, list) => (
    <div className="p-6 rounded-3xl w-full animate-fadeIn bg-gray-800 shadow-2xl">
      <h2 className="text-3xl font-bold mb-2 text-white text-center">{title}</h2>
      {subtitle && <p className="text-gray-400 text-center mb-6">{subtitle}</p>}
      {/* Mostra apenas os 18 primeiros */}
      <ul className="space-y-4">{list.slice(0, 18).map((item, index) => renderDriverItem(item, index))}</ul>
    </div>
  );

  // ===== UI: renderização do placar de etapa individual =====
  const renderStageScoreboard = (stageId) => {
    const stage = championshipData.stages.find((s) => s.id === stageId);
    if (!stage) return <div className="text-white text-center p-8">Etapa não encontrada.</div>;

    // Ordena os resultados da etapa
    const sortedResults = Object.entries(stage.results)
      .map(([driver, score]) => ({ driver, score }))
      .sort((a, b) => b.score - a.score);

    return (
      <div className="p-6 rounded-3xl w-full animate-fadeIn bg-gray-800 shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-white text-center">{stage.name}</h2>
        <p className="text-gray-400 text-center mb-6">
          Vencedor da Pole: <strong className="text-blue-400">{stage.poleWinner || 'N/A'}</strong> | MV: <strong className="text-red-400">{stage.mvWinner || 'N/A'}</strong>
        </p>
        {/* Mostra apenas os 18 primeiros da etapa */}
        <ul className="space-y-4">
          {sortedResults.slice(0, 18).map((item, index) => renderDriverItem(item, index))}
        </ul>
      </div>
    );
  };

  // ===== Lógica de Geração de Análise do Piloto (AI) =====
  const generatePilotAnalysis = (driverName, rankNoDrop, totalNoDrop, rankWithDrop, totalWithDrop, driverStages) => {
    const stagesCompleted = championshipData.stages.length;
    const stagesRemaining = Math.max(TOTAL_SEASON_STAGES - stagesCompleted, 0);

    // Encontra a posição do piloto em cada etapa (para estatísticas)
    const stagesWithPosition = driverStages.map((stage) => {
      if (stage.position === "Ausente" || stage.position === 0) return { ...stage, position: null };

      const stageResults = championshipData.stages.find(s => s.id === stage.id).results;
      const sortedStageResults = Object.entries(stageResults)
        .map(([driver, score]) => ({ driver, score }))
        .sort((a, b) => b.score - a.score);
      
      const position = sortedStageResults.findIndex((d) => d.driver === driverName) + 1;
      return { ...stage, position };
    });


    const performanceData = stagesWithPosition.filter((stage) => stage.position !== null);

    const podios = performanceData.filter((stage) => stage.position <= 3).length;
    const vitorias = performanceData.filter((stage) => stage.position === 1).length;
    const etapasPontuadas = performanceData.length;


    let parts = [];
    parts.push(
      `${driverName} está ${rankWithDrop}º (com descarte, ${totalWithDrop} pts) e ${rankNoDrop}º (sem descarte, ${totalNoDrop} pts).`
    );

    if (etapasPontuadas > 0) {
      parts.push(`Pontuou em ${etapasPontuadas} de ${stagesCompleted} etapas disputadas.`);
    } else {
      parts.push(`Ainda busca os primeiros pontos na temporada.`);
    }

    if (podios > 0) parts.push(`Ele(a) conquistou ${podios} pódio(s), sendo ${vitorias} vitória(s).`);

    let projection = "";
    if (stagesRemaining > 0) {
      if (rankWithDrop <= 3) {
        projection = `Para garantir o pódio, buscar consistência e vitórias nas próximas ${stagesRemaining} etapas é crucial.`; 
      } else if (rankWithDrop <= 8) {
        projection = `A disputa pelo Top 8 está intensa. Pódios nas próximas ${stagesRemaining} etapas podem virar o jogo e levá-lo ao Top 3.`;
      } else {
        projection = `O foco agora é recuperação. Cada ponto restante será vital para subir no ranking nas ${stagesRemaining} etapas restantes.`;
      }
    } else {
        projection = `Com o campeonato finalizado, o resultado final (com descarte) é ${rankWithDrop}º lugar!`;
    }

    parts.push(`Projeção: ${projection}`); 
    return parts.join("\n");
  };

  // ===== UI: renderização da análise do piloto =====
  const renderDriverAnalysis = () => {
    if (!selectedDriver) return null;

    const dropSet = computeDropSetForDriver(selectedDriver);

    // Mapeia os resultados da etapa, marcando se foi descartada
    const driverStages = championshipData.stages.map((stage) => {
      const points = stage.results[selectedDriver] ?? 0;

      let position = "Ausente";
      if (points > 0) {
        const sortedStageResults = Object.entries(stage.results)
          .map(([driver, score]) => ({ driver, score }))
          .sort((a, b) => b.score - a.score);
        position = sortedStageResults.findIndex((d) => d.driver === selectedDriver) + 1;
      }

      return {
        id: stage.id,
        name: stage.name,
        points,
        position,
        dropped: dropSet.has(stage.id),
      };
    });

    const totalNoDrop = totalScoresNoDrop.find((d) => d.driver === selectedDriver)?.score ?? 0;
    const totalWithDrop = totalScoresWithDrop.find((d) => d.driver === selectedDriver)?.score ?? 0;

    const rankNoDrop = (totalScoresNoDrop.findIndex((d) => d.driver === selectedDriver) + 1) || championshipData.drivers.length;
    const rankWithDrop = (totalScoresWithDrop.findIndex((d) => d.driver === selectedDriver) + 1) || championshipData.drivers.length;

    // Dados para o gráfico: inverte a posição (melhor = mais alto no gráfico)
    const chartData = driverStages.map((stage) => ({
      name: stage.name.replace('Etapa ', 'E'), // Nome mais curto para o eixo X
      position: stage.position === "Ausente" ? null : stage.position,
      // Usamos a posição real, já que o eixo Y está invertido.
      // O campo invertedPosition foi removido ou simplificado, mas não é mais necessário aqui
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
      
    // Definição da posição máxima no gráfico (12º)
    const MAX_CHART_POSITION = 12;

    return (
      <div className="bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-700 w-full animate-fadeIn">
        <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-3xl font-bold text-white flex items-center">
            {selectedDriver} <span className='ml-2 text-xl'>🏎️</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-200 shadow">
              Sem descarte: <strong>{rankNoDrop}º</strong>
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white shadow">
              c/ descarte: <strong>{rankWithDrop}º</strong>
            </span>
          </div>
        </div>

        {/* Totais de Pontos */}
        <div className="grid grid-cols-2 gap-4 bg-gray-700 p-4 rounded-xl mb-6">
          <div className='p-2 bg-gray-600 rounded-lg'>
             <p className="text-sm text-gray-400">Total (sem descarte)</p>
             <p className="text-2xl font-semibold text-gray-100">{totalNoDrop} pts</p>
          </div>
          <div className='p-2 bg-gray-600 rounded-lg border-l-4 border-green-400'>
             <p className="text-sm text-gray-400">Total (c/ descarte)</p>
             <p className="text-2xl font-semibold text-green-400">{totalWithDrop} pts</p>
          </div>
        </div>

        {/* Descartes */}
        <div className="bg-gray-700 p-3 rounded-xl mb-6">
          <h3 className="text-lg font-bold text-white mb-2">Etapas Descartadas ({DROPS})</h3>
          <p className="text-sm text-gray-300 italic">
            {droppedInfo || "Nenhuma etapa descartada até o momento."}
          </p>
        </div>

        {/* Análise Gerada */}
        <div className="bg-gray-700 p-4 rounded-xl mb-6 border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-white mb-2">Resumo da Performance</h3>
          <p className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">{analysisText}</p>
        </div>

        {/* Gráfico de Evolução */}
        <h3 className="text-2xl font-bold text-white mb-4">Evolução de Posição por Etapa</h3>
        <div className="w-full h-80 bg-gray-900 rounded-lg p-2 mb-6 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="name" stroke="#cbd5e0" />
              <YAxis
                label={{ value: "Posição", angle: -90, position: "insideLeft", fill: "#cbd5e0" }}
                stroke="#cbd5e0"
                // DOMÍNIO AJUSTADO: Garante que o gráfico vá de 1º a 12º
                domain={[1, MAX_CHART_POSITION]}
                // Inverte a visualização para que a melhor posição (1) fique no topo
                tickFormatter={(value) => value}
                reversed
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#2d3748", border: "none", borderRadius: "8px" }}
                labelStyle={{ color: "#e2e8f0" }}
                itemStyle={{ color: "#e2e8f0" }}
                formatter={(value, name, props) => {
                   const stage = driverStages.find(s => s.name.replace('Etapa ', 'E') === props.payload.name);
                   const realPosition = stage?.position;
                   if (realPosition === "Ausente") return ["Ausente", "Posição"];
                   return [`Posição: ${realPosition}º (${stage.points} pts)`, "Evolução"];
                }}
              />
              <Legend />
              {/* Usa 'position' direto agora que o YAxis está invertido */}
              <Line
                type="monotone"
                dataKey="position"
                stroke="#4299e1"
                strokeWidth={3}
                name="Posição na Etapa"
                dot={{ r: 5, fill: '#4299e1' }}
                activeDot={{ r: 8 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Detalhada */}
        <h3 className="text-2xl font-bold text-white mb-4">Pontuação por Etapa</h3>
        <ul className="space-y-3">
          {driverStages.map((stage) => (
            <li
              key={stage.id}
              className={`p-4 rounded-lg flex justify-between items-center ${
                stage.dropped ? "bg-gray-800 border border-dashed border-gray-600 opacity-70" : "bg-gray-900 shadow-md"
              }`}
              title={stage.dropped ? "Etapa descartada" : undefined}
            >
              <span className="text-gray-300 text-lg">
                {stage.name}:{" "}
                <span className='font-semibold'>
                   {stage.position === "Ausente" ? "Ausente" : `P${stage.position}`}
                </span>
                {stage.dropped && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-700 text-white align-middle">
                    descartada
                  </span>
                )}
              </span>
              <div className="flex items-center space-x-2">
                <span
                  className={`font-bold text-lg ${
                    stage.dropped ? "text-gray-400 line-through" : "text-green-400"
                  }`}
                >
                  {stage.points} Pontos
                </span>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setView("total")}
          className="mt-8 flex items-center justify-center w-full py-3 px-6 rounded-full font-bold text-white bg-gray-700 hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
        >
          Voltar para Geral
        </button>
      </div>
    );
  };

  // ===== Render principal =====
  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-8 font-sans flex flex-col items-center">
      {/* Adiciona o script do Tailwind CSS para garantir o funcionamento */}
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="max-w-xl w-full">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
            🏆 TEMPORADA KART 2025
          </h1>
          <p className="text-gray-400 text-sm italic">
             Visualização de Classificação e Análise de Pilotos
          </p>
        </header>

        {/* Controles de visualização */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
          {/* Geral */}
          <button
            onClick={() => {
              setView("total");
              setSelectedDriver(null);
            }}
            className={`flex-1 py-3 px-6 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
              view === "total" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
            className={`flex-1 py-3 px-6 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
              view === "totalWithDrops" ? "bg-green-600 text-white shadow-lg shadow-green-500/50" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            title={`Aplica descarte das ${DROPS} piores etapas por piloto. Bônus de Participação Total (+${TOTAL_PARTICIPATION_BONUS} pts) será aplicado no final da temporada (${TOTAL_SEASON_STAGES} etapas).`}
          >
            Final
          </button>

          {/* Etapas */}
          <div className="relative inline-block w-full sm:w-auto flex-1">
            <select
              value={
                view === "total" || view === "totalWithDrops" || view === "analysis" ? "" : view
              }
              onChange={(e) => {
                setView(parseInt(e.target.value, 10));
                setSelectedDriver(null);
              }}
              className="appearance-none bg-gray-700 text-gray-300 py-3 px-6 pr-10 rounded-full font-bold transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-center"
            >
              <option value="" disabled className="bg-gray-800">
                🔍 Etapas
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
        </div>
        
        {/* Regulamento */}
        <div className="text-center mb-6">
            <a
              href="https://drive.google.com/file/d/1Hq_C-DA0437ZDJR8Ob8Rg3NM0lLAbUka/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-2 px-6 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-105 bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              📄 Ver Regulamento Oficial
            </a>
        </div>


        {/* Conteúdo principal */}
        <main className="mt-8">
          {view === "total" &&
            renderScoreboard(
              "Classificação Geral (Bruta)",
              `Ranking após ${championshipData.stages.length} de ${TOTAL_SEASON_STAGES} etapa(s) (sem descarte)`,
              totalScoresNoDrop
            )}

          {view === "totalWithDrops" &&
            renderScoreboard(
              "Classificação do Campeonato",
              `Ranking após ${championshipData.stages.length} de ${TOTAL_SEASON_STAGES} etapa(s) — descartando as ${DROPS} piores por piloto`,
              totalScoresWithDrop
            )}

          {view !== "total" && view !== "totalWithDrops" && view !== "analysis" && renderStageScoreboard(view)}
          {view === "analysis" && renderDriverAnalysis()}
        </main>
      </div>
    </div>
  );
};

export default App;
