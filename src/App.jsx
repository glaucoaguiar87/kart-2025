import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * CONFIGURAÇÕES DO REGULAMENTO
 */
const DROPS = 2; // Descartes obrigatórios
const BONUS_POLE = 3;
const BONUS_MV = 2;
const BONUS_FIDELITY = 5; // Bônus para quem fez as 8 etapas

/**
 * PONTUAÇÃO BASE (1º ao 10º)
 */
const POS_POINTS = [25, 20, 18, 15, 12, 11, 10, 8, 6, 4];
const getBasePoints = (pos) => POS_POINTS[pos - 1] || 0;

/**
 * NORMALIZAÇÃO DE NOMES
 */
const normalizeName = (name) => {
  if (!name) return "";
  const n = name.trim().toUpperCase();
  if (n.includes("GLAUCO AGUIAR")) return "Glauco Aguiar";
  if (n.includes("MARCOS VINICIUS")) return "Marcos Vinicius";
  if (n.includes("PEDRO CAVALCANTE")) return "Pedro Cavalcante";
  if (n.includes("ANTONIO ROCHA")) return "Antonio Rocha";
  if (n.includes("MARIO JUNIOR")) return "Mario Junior";
  if (n.includes("HUGO BERNARDES")) return "Hugo Bernardes";
  if (n.includes("WENDRIL")) return "Wendril Oliveira";
  if (n.includes("SAARA")) return "Saara Santos";
  if (n.includes("MATHEUS KEVENY")) return "Matheus Keveny";
  if (n.includes("CLAUDIO AUGUSTO")) return "Claudio Augusto de Paula";
  if (n.includes("MARDEN ALMEIDA")) return "Marden Almeida";
  if (n.includes("PAULO HENRIQUE")) return "Paulo Henrique Silva";
  if (n.includes("FÁBIO OLIVEIRA")) return "Fábio Oliveira";
  return name.trim();
};

/**
 * COMPONENTE PRINCIPAL
 */
export default function App() {
  const [view, setView] = useState('final'); // 'final' | 'bruto' | 'analysis'
  const [selectedDriver, setSelectedDriver] = useState(null);

  // DADOS DAS ETAPAS
  const stages = useMemo(() => [
    { id: 1, name: "Etapa 1", pole: "Glauco Aguiar", mv: "Glauco Aguiar", order: ["Glauco Aguiar", "Marcos Vinicius", "Pedro Cavalcante", "Antonio Rocha", "Igor Rodrigues", "Erick Pacheco", "Cleber Santos", "Marcus Bessa"] },
    { id: 2, name: "Etapa 2", pole: null, mv: "Antonio Rocha", order: ["Antonio Rocha", "Mario Junior", "Hugo Bernardes", "Glauco Aguiar", "Marcos Vinicius", "Enderson Alves", "Wendril Oliveira", "Igor Rodrigues", "Amarildo Vale", "Cleber Santos"] },
    { id: 3, name: "Etapa 3", pole: "Wendril Oliveira", mv: "Wendril Oliveira", order: ["Wendril Oliveira", "Marcos Vinicius", "Pedro Cavalcante", "Antonio Rocha", "Glauco Aguiar", "Hugo Bernardes"] },
    { id: 4, name: "Etapa 4", pole: "Wendril Oliveira", mv: "Wendril Oliveira", order: ["Wendril Oliveira", "Marcos Vinicius", "Glauco Aguiar", "Saara Santos", "Pedro Cavalcante", "Vitoria", "Marcus Bessa", "Hugo Bernardes"] },
    { id: 5, name: "Etapa 5", pole: null, mv: "Wendril Oliveira", order: ["Mario Junior", "Glauco Aguiar", "Matheus Keveny", "Hugo Bernardes", "Denilson Martins", "Saara Santos", "Claudio Augusto de Paula", "Wendril Oliveira"] },
    { id: 6, name: "Etapa 6", pole: "Glauco Aguiar", mv: "Mario Junior", order: ["Mario Junior", "Glauco Aguiar", "Junio", "Wendril Oliveira", "Marden Almeida", "Marcos Vinicius", "Bruno Matheus", "Pedro Cavalcante", "Hugo Bernardes", "Igor Rodrigues"] },
    { id: 7, name: "Etapa 7", pole: "Mario Junior", mv: "Mario Junior", order: ["Mario Junior", "Paulo Henrique Silva", "Wendril Oliveira", "Saara Santos", "Hugo Bernardes", "Matheus Keveny", "Claudio Augusto de Paula", "Fábio Oliveira", "Marcos Vinicius"] },
    { id: 8, name: "Etapa 8", pole: "Hugo Bernardes", mv: "Mario Junior", order: ["MARIO JUNIOR", "Wendril Oliveira", "Saara Santos", "Glauco Aguiar", "PEDRO CAVALCANTE", "Hugo Bernardes"] },
  ], []);

  // PROCESSAMENTO DE PONTOS
  const driversData = useMemo(() => {
    const data = {};
    
    stages.forEach(s => {
      s.order.forEach((name, idx) => {
        const d = normalizeName(name);
        if (!data[d]) data[d] = { name: d, results: Array(8).fill(0), positions: Array(8).fill(null), wins: 0, participated: 0 };
        
        let pts = getBasePoints(idx + 1);
        if (d === normalizeName(s.pole)) pts += BONUS_POLE;
        if (d === normalizeName(s.mv)) pts += BONUS_MV;
        
        data[d].results[s.id - 1] = pts;
        data[d].positions[s.id - 1] = idx + 1;
        if (idx === 0) data[d].wins += 1;
        data[d].participated += 1;
      });
    });

    return Object.values(data).map(d => {
      const sorted = [...d.results].sort((a, b) => a - b);
      // Descartar os 2 piores resultados
      const droppedValue = sorted.slice(0, DROPS).reduce((a, b) => a + b, 0);
      const brute = d.results.reduce((a, b) => a + b, 0);
      let valid = brute - droppedValue;
      
      const hasFidelity = d.participated === 8;
      if (hasFidelity) valid += BONUS_FIDELITY;

      return { ...d, brute, valid, hasFidelity };
    });
  }, [stages]);

  const rankedFinal = [...driversData].sort((a, b) => b.valid - a.valid || b.wins - a.wins);
  const rankedBruto = [...driversData].sort((a, b) => b.brute - a.brute);

  // HANDLERS
  const handleDriverClick = (e, name) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDriver(name);
    setView('analysis');
  };

  /**
   * COMPONENTES DE INTERFACE
   */
  const Podium = () => {
    const [first, second, third] = rankedFinal;
    return (
      <div className="flex justify-center items-end space-x-2 md:space-x-8 mb-12 mt-4 animate-fadeIn">
        {/* Segundo */}
        <div className="flex flex-col items-center cursor-pointer" onClick={(e) => handleDriverClick(e, second.name)}>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-400 border-4 border-gray-300 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
            <span className="text-2xl">🥈</span>
          </div>
          <div className="bg-gray-800 p-2 rounded-t-lg w-24 text-center mt-2 border-t-2 border-gray-400">
             <span className="text-[10px] text-gray-400 font-bold block">VICE</span>
             <span className="text-white text-[10px] font-bold truncate block">{second.name}</span>
          </div>
        </div>
        {/* Primeiro */}
        <div className="flex flex-col items-center cursor-pointer" onClick={(e) => handleDriverClick(e, first.name)}>
          <div className="w-24 h-24 md:w-28 md:h-28 bg-yellow-500 border-4 border-yellow-300 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.4)] transition-transform hover:scale-110">
            <span className="text-5xl">🥇</span>
          </div>
          <div className="bg-gray-800 p-3 rounded-t-lg w-32 text-center mt-2 border-t-2 border-yellow-500">
             <span className="text-xs text-yellow-500 font-black block">CAMPEÃO</span>
             <span className="text-white font-black truncate block">{first.name}</span>
          </div>
        </div>
        {/* Terceiro */}
        <div className="flex flex-col items-center cursor-pointer" onClick={(e) => handleDriverClick(e, third.name)}>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-700 border-4 border-orange-500 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
            <span className="text-2xl">🥉</span>
          </div>
          <div className="bg-gray-800 p-2 rounded-t-lg w-24 text-center mt-2 border-t-2 border-orange-600">
             <span className="text-[10px] text-orange-500 font-bold block">3º LUGAR</span>
             <span className="text-white text-[10px] font-bold truncate block">{third.name}</span>
          </div>
        </div>
      </div>
    );
  };

  const Analysis = () => {
    const d = driversData.find(x => x.name === selectedDriver);
    if (!d) return null;

    const chartData = stages.map((s, i) => ({
      name: `E${s.id}`,
      pos: d.positions[i],
      invertedPos: d.positions[i] ? 15 - d.positions[i] : null
    }));

    return (
      <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 animate-fadeIn">
        <h2 className="text-3xl font-black text-white mb-6 text-center">{d.name}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 p-4 rounded-2xl text-center border-b-2 border-green-500">
            <span className="text-3xl font-black text-green-400">{d.valid}</span>
            <span className="text-[10px] text-gray-500 block font-bold uppercase">Pontos Válidos</span>
          </div>
          <div className="bg-gray-900 p-4 rounded-2xl text-center border-b-2 border-blue-500">
            <span className="text-3xl font-black text-blue-400">{d.wins}</span>
            <span className="text-[10px] text-gray-500 block font-bold uppercase">Vitórias</span>
          </div>
        </div>

        {/* GRÁFICO DE EVOLUÇÃO */}
        <div className="mb-8">
          <h3 className="text-white font-bold text-sm mb-4 flex items-center uppercase tracking-widest">
            <span className="w-1 h-4 bg-yellow-500 mr-2 rounded-full"></span>
            Evolução de Posição
          </h3>
          <div className="h-48 w-full bg-gray-900/50 rounded-2xl p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 15]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#fbbf24' }}
                  formatter={(value, name, props) => [`${props.payload.pos}º Lugar`, 'Posição']}
                />
                <Line 
                  type="monotone" 
                  dataKey="invertedPos" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6, fill: '#60a5fa' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-2 mb-8">
           <h3 className="text-white font-bold text-sm mb-4 flex items-center uppercase tracking-widest">
             <span className="w-1 h-4 bg-blue-500 mr-2 rounded-full"></span>
             Histórico por Etapa
           </h3>
           {stages.map((s, i) => {
             const pts = d.results[i];
             const pos = d.positions[i];
             const isPole = normalizeName(s.pole) === d.name;
             const isMV = normalizeName(s.mv) === d.name;
             
             return (
               <div key={s.id} className={`flex justify-between items-center p-3 rounded-xl ${!pos ? 'bg-gray-900/40 opacity-40' : 'bg-gray-700'}`}>
                 <div className="flex flex-col">
                   <span className="text-gray-300 text-xs font-bold">{s.name}</span>
                   <div className="flex items-center space-x-2 mt-1">
                     <span className="text-white font-black text-sm">{pos ? `P${pos}` : 'Ausente'}</span>
                     {isPole && <span className="bg-yellow-500 text-black text-[8px] px-1 rounded font-black">POLE</span>}
                     {isMV && <span className="bg-blue-400 text-black text-[8px] px-1 rounded font-black">MV</span>}
                   </div>
                 </div>
                 <span className="text-white font-black">{pts} pts</span>
               </div>
             );
           })}
        </div>

        <button 
          onClick={() => setView('final')}
          className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
        >
          Voltar à Tabela
        </button>
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen p-4 md:p-8 font-sans flex flex-col items-center selection:bg-blue-500/30 text-white">
      <div className="max-w-xl w-full">
        
        <header className="text-center mb-8">
          <div className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full mb-3 uppercase tracking-tighter animate-pulse">
            Temporada 2025 Finalizada
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none uppercase">
            Kart <span className="text-blue-600">Final</span>
          </h1>
          <p className="text-gray-600 text-[10px] font-bold uppercase mt-2 tracking-[0.3em]">Painel Oficial de Resultados</p>
        </header>

        {/* NAVEGAÇÃO */}
        <div className="flex bg-gray-900 p-1 rounded-2xl mb-8 space-x-1">
          <button 
            onClick={() => setView('final')}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${view === 'final' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Ranking Final
          </button>
          <button 
            onClick={() => setView('bruto')}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${view === 'bruto' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Pontos Brutos
          </button>
        </div>

        {/* CONTEÚDO */}
        {view === 'analysis' ? <Analysis /> : (
          <div className="animate-fadeIn">
            {view === 'final' && <Podium />}
            
            <div className="space-y-2">
              {(view === 'final' ? rankedFinal : rankedBruto).map((d, idx) => (
                <div 
                  key={d.name}
                  onClick={(e) => handleDriverClick(e, d.name)}
                  className="flex items-center justify-between p-4 bg-gray-800/60 rounded-2xl border border-gray-700/50 hover:bg-gray-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <span className={`w-6 text-center font-black ${idx < 3 ? 'text-yellow-500' : 'text-gray-600'}`}>
                      {idx + 1}º
                    </span>
                    <div>
                      <p className="text-white font-bold text-sm leading-none group-hover:text-blue-400 transition-colors">
                        {d.name}
                      </p>
                      <p className="text-[9px] text-gray-500 uppercase font-black mt-1">
                        {d.wins} vitórias • {d.participated} provas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-green-400 leading-none">
                      {view === 'final' ? d.valid : d.brute}
                    </p>
                    <p className="text-[8px] text-gray-600 font-bold uppercase">Pontos</p>
                  </div>
                </div>
              ))}
            </div>

            <footer className="mt-12 text-center pb-8">
              <p className="text-gray-800 text-[9px] font-black uppercase leading-relaxed tracking-widest">
                Critérios: Pontos Válidos (Soma - 2 piores) <br/>
                Desempate: Nº de Vitórias (1º Lugar na Etapa)
              </p>
            </footer>
          </div>
        )}

      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}


