import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DROPS = 2; // quantidade de etapas descartadas por piloto

const App = () => {
  // ===== Dados iniciais =====
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
      "Saara",
      "Vitoria"
    ],
    stages: [
      {
        id: 1,
        name: "Etapa 1",
        poleWinner: "Glauco Aguiar",
        mvWinner: "Glauco Aguiar",
        results: {
          "Glauco Aguiar": 30,
          "Marcos Vinicius": 20,
          "Pedro Cavalcante": 18,
          "Antonio Rocha": 15,
          "Igor Rodrigues": 12,
          "Erick Pacheco": 11,
          "Cleber Santos": 10,
          "Marcus Bessa": 8,
          "Marjara Maquiné": 0,
          "Ana Cruz": 0,
          "Mario Junior": 0,
          "Hugo Bernardes": 0,
          "Wendril Oliveira": 0,
          "Enderson Alves": 0,
          "Amarildo Vale": 0,
          "Erick Bitencourt": 0,
          "Saara": 0,
          "Vitoria": 0,
        },
      },
      {
        id: 2,
        name: "Etapa 2",
        poleWinner: null,
        mvWinner: "Antonio Rocha",
        results: {
          "Antonio Rocha": 27,
          "Mario Junior": 20,
          "Hugo Bernardes": 18,
          "Glauco Aguiar": 15,
          "Marcos Vinicius": 12,
          "Enderson Alves": 11,
          "Wendril Oliveira": 10,
          "Igor Rodrigues": 8,
          "Amarildo Vale": 6,
          "Cleber Santos": 4,
          "Pedro Cavalcante": 0,
          "Erick Bitencourt": 0,
          "Erick Pacheco": 0,
          "Marcus Bessa": 0,
          "Marjara Maquiné": 0,
          "Ana Cruz": 0,
          "Saara": 0,
          "Vitoria": 0,
        },
      },
      {
        id: 3,
        name: "Etapa 3",
        poleWinner: "Wendril Oliveira",
        mvWinner: "Wendril Oliveira",
        results: {
          "Wendril Oliveira": 30,
          "Marcos Vinicius": 20,
          "Pedro Cavalcante": 18,
          "Antonio Rocha": 15,
          "Glauco Aguiar": 12,
          "Hugo Bernardes": 11,
          "Mario Junior": 0,
          "Enderson Alves": 0,
          "Igor Rodrigues": 0,
          "Amarildo Vale": 0,
          "Erick Bitencourt": 0,
          "Erick Pacheco": 0,
          "Marcus Bessa": 0,
          "Marjara Maquiné": 0,
          "Ana Cruz": 0,
          "Cleber Santos": 0,
          "Saara": 0,
          "Vitoria": 0,
        },
      },
      {
        id: 4,
        name: "Etapa 4",
        poleWinner: "Wendril Oliveira",
        mvWinner: "Wendril Oliveira",
        results: {
          "Wendril Oliveira": 30,
          "Marcos Vinicius": 20,
          "Glauco Aguiar": 18,
          "Saara": 15,
          "Pedro Cavalcante": 12,
          "Vitoria": 11,
          "Marcus Bessa": 10,
          "Hugo Bernardes": 8,
          "Antonio Rocha": 0,
          "Igor Rodrigues": 0,
          "Erick Pacheco": 0,
          "Cleber Santos": 0,
          "Marjara Maquiné": 0,
          "Ana Cruz": 0,
          "Mario Junior": 0,
          "Enderson Alves": 0,
          "Amarildo Vale": 0,
          "Erick Bitencourt": 0,
        },
      },
    ],
  };

  // ===== Estados =====
  const [championshipData, setChampionshipData] = useState(initialData);
  const [view, setView] = useState('total'); // 'total' | 'totalWithDrops' | stageId | 'analysis'
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [totalScoresNoDrop, setTotalScoresNoDrop] = useState([]);
  const [totalScoresWithDrop, setTotalScoresWithDrop] = useState([]);

  // ===== Helpers de descarte =====
  const getDriverStageArray = (driver) =>
    championshipData.stages.map((stage) => ({
      stageId: stage.id,
      stageName: stage.name,
      points: stage.results[driver] ?? 0,
    }));

  const computeDropSetForDriver = (driver) => {
    const arr = getDriverStageArray(driver);
    const sorted = arr
      .map((s, idx) => ({ idx, points: s.points }))
      .sort((a, b) => a.points - b.points);
    const toDrop = sorted.slice(0, Math.min(DROPS, arr.length)).map((o) => o.idx);
    return new Set(toDrop.map((i) => championshipData.stages[i].id));
  };

  const sumPointsWithDrops = (driver) => {
    const dropSet = computeDropSetForDriver(driver);
    let sum = 0;
    championshipData.stages.forEach((stage) => {
      const pts = stage.results[driver] ?? 0;
      if (!dropSet.has(stage.id)) sum += pts;
    });
    return { sum, dropSet };
  };

  // ===== Cálculo dos dois rankings =====
  useEffect(() => {
    const driversSet = new Set();
    championshipData.stages.forEach((stage) => {
      Object.keys(stage.results).forEach((d) => driversSet.add(d));
    });

    // Sem descarte
    const scoresNoDrop = {};
    driversSet.forEach((d) => (scoresNoDrop[d] = 0));
    championshipData.stages.forEach((stage) => {
      for (const d in stage.results) scoresNoDrop[d] += stage.results[d];
    });
    const sortedNoDrop = Object.entries(scoresNoDrop)
      .map(([driver, score]) => ({ driver, score }))
      .sort((a, b) => b.score - a.score);
    setTotalScoresNoDrop(sortedNoDrop);

    // Com descarte
    const scoresWithDrop = {};
    driversSet.forEach((d) => {
      const { sum } = sumPointsWithDrops(d);
      scoresWithDrop[d] = sum;
    });
    const sortedWithDrop = Object.entries(scoresWithDrop)
      .map(([driver, score]) => ({ driver, score }))
      .sort((a, b) => b.score - a.score);
    setTotalScoresWithDrop(sortedWithDrop);
  }, [championshipData]);

  // ===== UI: itens de piloto =====
  const renderDriverItem = (item, index, stageBonus = {}) => {
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
        onClick={() => {
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
      .sort((a, b) => b.score - a.score);

    return (
      <div className="p-6 rounded-3xl w-full animate-fadeIn">
        <h2 className="text-3xl font-bold mb-2 text-white text-center">{stage.name}</h2>
        <p className="text-gray-400 text-center mb-6">Resultados da Etapa</p>
        <ul className="space-y-4">
          {sortedResults.map((item, index) => renderDriverItem(item, index))}
        </ul>
      </div>
    );
  };

  // ===== Análise do piloto =====
  const generatePilotAnalysis = (driverName, rankNoDrop, totalNoDrop, rankWithDrop, totalWithDrop, driverStages) => {
    const totalSeasonStages = 8;
    const stagesCompleted = driverStages.length;
    const stagesRemaining = Math.max(totalSeasonStages - stagesCompleted, 0);

    const performanceData = driverStages.filter((stage) => stage.points > 0);

    const podios = performanceData.filter((stage) => typeof stage.position === "number" && stage.position <= 3).length;
    const vitorias = performanceData.filter((stage) => stage.position === 1).length;

    let parts = [];
    parts.push(
      `${driverName} está ${rankNoDrop}º (sem descarte, ${totalNoDrop} pts) e ${rankWithDrop}º (com descarte, ${totalWithDrop} pts).`
    );

    if (performanceData.length > 0) {
      parts.push(`Pontuou em ${performanceData.length} de ${stagesCompleted} etapas.`);
    } else {
      parts.push(`Ainda busca os primeiros pontos na temporada.`);
    }

    if (podios > 0) parts.push(`Tem ${podios} pódio(s), sendo ${vitorias} vitória(s).`);

    let projection = "";
    if (rankWithDrop <= 3 || rankNoDrop <= 3) {
      projection = `Para manter-se no pódio, buscar vitórias nas próximas ${stagesRemaining} etapas é crucial.`;
    } else if (rankWithDrop <= 8 || rankNoDrop <= 8) {
      projection = `A disputa pelo top 3 está aberta. Pódios nas próximas ${stagesRemaining} etapas podem virar o jogo.`;
    } else {
      projection = `O foco agora é recuperação: cada ponto restante será vital para subir no ranking.`;
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

    const rankNoDrop = (totalScoresNoDrop.findIndex((d) => d.driver === selectedDriver) + 1) || 0;
    const rankWithDrop = (totalScoresWithDrop.findIndex((d) => d.driver === selectedDriver) + 1) || 0;

    const chartData = driverStages.map((stage) => ({
      name: stage.name,
      position: stage.position === "Ausente" ? null : stage.position,
      invertedPosition: stage.position === "Ausente" ? null : championshipData.drivers.length + 1 - stage.position,
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
              Sem descarte: <strong>{rankNoDrop}º</strong>
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-700 text-white">
              c/ descarte: <strong>{rankWithDrop}º</strong>
            </span>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-xl mb-3">
          <p className="text-md text-gray-300">
            Sem descarte:&nbsp;
            <span className="font-semibold text-gray-100">{totalNoDrop}</span> pts
          </p>
          <p className="text-md text-gray-300">
            Com descarte:&nbsp;
            <span className="font-semibold text-green-400">{totalWithDrop}</span> pts
          </p>
        </div>

        <div className="bg-gray-700 p-3 rounded-xl mb-6">
          <p className="text-sm text-gray-300">
            Descartes ({DROPS}): <span className="font-medium text-gray-100">{droppedInfo || "—"}</span>
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
                domain={['dataMax', 1]}
                tickFormatter={(value) => championshipData.drivers.length + 1 - value}
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
              <span className="text-gray-300 text-lg">
                {stage.name}: {stage.position === "Ausente" ? "Ausente" : `P${stage.position}`}
                {stage.dropped && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-200 align-middle">
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
          className="mt-8 flex items-center justify-center w-full py-3 px-6 rounded-full font-bold text-white bg-gray-700 hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
        >
          Voltar para Geral
        </button>
      </div>
    );
  };

  // ===== Render principal =====
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
};

export default App;
