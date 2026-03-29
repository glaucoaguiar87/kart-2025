import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Trophy, Target, Flag, BarChart3, Settings2, History, ChevronRight, Lock } from 'lucide-react';

/**
 * CONFIGURAÇÕES TÉCNICAS E PONTUAÇÃO
 */
const POS_POINTS = [25, 20, 18, 15, 12, 11, 10, 8, 6, 4];
const getBasePoints = (pos) => POS_POINTS[pos - 1] || 0;

const normalizeName = (name) => {
  if (!name) return "";
  const n = name.trim().toUpperCase();
  if (n.includes("GLAUCO AGUIAR")) return "Glauco Aguiar";
  if (n.includes("MARCOS VINICIUS")) return "Marcos Vinicius";
  if (n.includes("PEDRO CAVALCANTE")) return "Pedro Cavalcante";
  if (n.includes("ANTONIO ROCHA")) return "Antonio Rocha";
  if (n.includes("MARIO JUNIOR")) return "Mario Junior";
  if (n.includes("HUGO")) return "Hugo Bernardes";
  if (n.includes("WENDRIL")) return "Wendril Oliveira";
  if (n.includes("SAARA") || n.includes("SARA")) return "Saara Santos";
  if (n.includes("MATHEUS KEVENY")) return "Matheus Keveny";
  if (n.includes("CLAUDIO") || n.includes("CLÁUDIO")) return "Claudio Augusto";
  if (n.includes("MARDEN")) return "Marden Almeida";
  if (n.includes("PAULO HENRIQUE")) return "Paulo Henrique Silva";
  if (n.includes("FABIO")) return "Fabio Oliveira";
  if (n.includes("VITOR")) return "Vitoria/Vitor";
  if (n.includes("DANIEL")) return "Daniel";
  return name.trim();
};

const SEASONS_CONFIG = {
  '2025': {
    drops: 2,
    totalStages: 8,
    bonusParticipation: 5,
    participationThreshold: 8,
    bonusPole: 3,
    bonusMV: 2,
    stages: [
      { id: 1, name: "Etapa 1", pole: "Glauco Aguiar", mv: "Glauco Aguiar", order: ["Glauco Aguiar", "Marcos Vinicius", "Pedro Cavalcante", "Antonio Rocha", "Igor Rodrigues", "Erick Pacheco", "Cleber Santos", "Marcus Bessa"] },
      { id: 2, name: "Etapa 2", pole: null, mv: "Antonio Rocha", order: ["Antonio Rocha", "Mario Junior", "Hugo Bernardes", "Glauco Aguiar", "Marcos Vinicius", "Enderson Alves", "Wendril Oliveira", "Igor Rodrigues", "Amarildo Vale", "Cleber Santos"] },
      { id: 3, name: "Etapa 3", pole: "Wendril Oliveira", mv: "Wendril Oliveira", order: ["Wendril Oliveira", "Marcos Vinicius", "Pedro Cavalcante", "Antonio Rocha", "Glauco Aguiar", "Hugo Bernardes"] },
      { id: 4, name: "Etapa 4", pole: "Wendril Oliveira", mv: "Wendril Oliveira", order: ["Wendril Oliveira", "Marcos Vinicius", "Glauco Aguiar", "Saara Santos", "Pedro Cavalcante", "Vitoria", "Marcus Bessa", "Hugo Bernardes"] },
      { id: 5, name: "Etapa 5", pole: null, mv: "Wendril Oliveira", order: ["Mario Junior", "Glauco Aguiar", "Matheus Keveny", "Hugo Bernardes", "Denilson Martins", "Saara Santos", "Claudio Augusto de Paula", "Wendril Oliveira"] },
      { id: 6, name: "Etapa 6", pole: "Glauco Aguiar", mv: "Mario Junior", order: ["Mario Junior", "Glauco Aguiar", "Junio", "Wendril Oliveira", "Marden Almeida", "Marcos Vinicius", "Bruno Matheus", "Pedro Cavalcante", "Hugo Bernardes", "Igor Rodrigues"] },
      { id: 7, name: "Etapa 7", pole: "Mario Junior", mv: "Mario Junior", order: ["Mario Junior", "Paulo Henrique Silva", "Wendril Oliveira", "Saara Santos", "Hugo Bernardes", "Matheus Keveny", "Claudio Augusto de Paula", "Fábio Oliveira", "Marcos Vinicius"] },
      { id: 8, name: "Etapa 8", pole: "Hugo Bernardes", mv: "Mario Junior", order: ["Mario Junior", "Wendril Oliveira", "Saara Santos", "Glauco Aguiar", "Pedro Cavalcante", "Hugo Bernardes"] },
    ]
  },
  '2026': {
    drops: 3,
    totalStages: 10,
    bonusParticipation: 5,
    participationThreshold: 7,
    bonusPole: 3,
    bonusMV: 2,
    stages: [
      { 
        id: 1, 
        name: "Etapa 1 - Fev/26", 
        pole: "Mario Junior", 
        mv: null, 
        order: ["Hugo Bernardes", "Claudio Augusto", "Mario Junior", "Marcos Vinicius", "Saara Santos", "Pedro Cavalcante", "Vitoria/Vitor", "Glauco Aguiar", "Fabio Oliveira", "Daniel"] 
      }
    ]
  }
};

export default function App() {
  const [selectedSeason, setSelectedSeason] = useState('2026');
  const [view, setView] = useState('ranking'); // ranking | analysis
  const [selectedDriver, setSelectedDriver] = useState(null);

  const config = SEASONS_CONFIG[selectedSeason];

  const processedData = useMemo(() => {
    const drivers = {};
    
    config.stages.forEach(s => {
      s.order.forEach((name, idx) => {
        const d = normalizeName(name);
        if (!drivers[d]) {
          drivers[d] = { 
            name: d, 
            results: Array(config.totalStages).fill(0), 
            positions: Array(config.totalStages).fill(null),
            wins: 0, 
            poles: 0,
            participated: 0,
            lastStagePos: 99
          };
        }
        
        let pts = getBasePoints(idx + 1);
        const isPole = normalizeName(s.pole) === d;
        const isMV = normalizeName(s.mv) === d;
        
        if (isPole) { pts += config.bonusPole; drivers[d].poles += 1; }
        if (isMV) pts += config.bonusMV;
        
        drivers[d].results[s.id - 1] = pts;
        drivers[d].positions[s.id - 1] = idx + 1;
        if (idx === 0) drivers[d].wins += 1;
        drivers[d].participated += 1;
        drivers[d].lastStagePos = idx + 1;
      });
    });

    return Object.values(drivers).map(d => {
      const sortedPoints = [...d.results].sort((a, b) => a - b);
      const droppedTotal = sortedPoints.slice(0, config.drops).reduce((a, b) => a + b, 0);
      const brute = d.results.reduce((a, b) => a + b, 0);
      let valid = brute - droppedTotal;
      
      if (d.participated >= config.participationThreshold) valid += config.bonusParticipation;

      return { ...d, brute, valid };
    }).sort((a, b) => b.valid - a.valid || b.wins - a.wins || b.poles - a.poles || a.lastStagePos - b.lastStagePos);
  }, [selectedSeason]);

  const handleDriverSelect = (name) => {
    if (selectedSeason === '2026') {
      setSelectedDriver(name);
      setView('analysis');
    }
  };

  /**
   * INTERFACE COMPONENTS
   */
  const SeasonSelector = () => (
    <div className="inline-flex bg-slate-900/80 p-1 rounded-2xl border border-white/5 mb-8 shadow-2xl">
      {['2026', '2025'].map(year => (
        <button
          key={year}
          onClick={() => { setSelectedSeason(year); setView('ranking'); }}
          className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-500 flex items-center gap-2 ${selectedSeason === year ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {year === '2025' ? <History className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
          Temporada {year}
        </button>
      ))}
    </div>
  );

  const RankingItem = ({ driver, index }) => {
    const isTop3 = index < 3;
    const is2026 = selectedSeason === '2026';
    const podiumColors = [
      'from-yellow-400 to-amber-600',
      'from-slate-200 to-slate-400',
      'from-orange-400 to-red-600'
    ];

    return (
      <div 
        onClick={() => handleDriverSelect(driver.name)}
        className={`group relative bg-slate-900/40 border border-white/5 rounded-[2rem] p-5 transition-all duration-500 ${is2026 ? 'hover:bg-indigo-600/10 hover:border-indigo-500/20 cursor-pointer hover:-translate-y-1' : 'cursor-default opacity-90'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${isTop3 ? `bg-gradient-to-br ${podiumColors[index]} text-slate-950` : 'bg-slate-800 text-slate-500'}`}>
              {index + 1}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors duration-300">{driver.name}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center group-hover:text-slate-400">
                  <Target className="w-3 h-3 mr-1" /> {driver.wins} vitórias
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center group-hover:text-slate-400">
                  <Flag className="w-3 h-3 mr-1" /> {driver.participated} GPs
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="block text-2xl font-black text-white">{driver.valid}</span>
              <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Pontos</span>
            </div>
            {is2026 && <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />}
            {!is2026 && <Lock className="w-3 h-3 text-slate-800" />}
          </div>
        </div>
      </div>
    );
  };

  const Analysis = () => {
    const d = processedData.find(x => x.name === selectedDriver);
    if (!d) return null;

    const chartData = config.stages.map((s, i) => ({
      name: `E${s.id}`,
      points: d.results[i] || 0,
      pos: d.positions[i]
    }));

    return (
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <button onClick={() => setView('ranking')} className="mb-8 text-slate-500 hover:text-white flex items-center text-xs font-black uppercase tracking-[0.2em] transition-all group">
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Voltar para Classificação
        </button>
        
        <div className="bg-gradient-to-br from-indigo-900/30 to-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 relative z-10">
            <div>
              <h2 className="text-5xl font-black text-white mb-3 tracking-tighter leading-none">{d.name}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-tighter">Temporada 2026</span>
                {d.participated >= config.participationThreshold && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-tighter">Fidelidade Aplicada</span>}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center bg-slate-950/40 px-8 py-6 rounded-[2rem] border border-white/5 shadow-xl">
                <p className="text-4xl font-black text-white">{d.valid}</p>
                <p className="text-[10px] text-slate-500 uppercase font-black mt-2 tracking-widest">Total Válido</p>
              </div>
              <div className="text-center bg-slate-950/40 px-8 py-6 rounded-[2rem] border border-white/5 shadow-xl">
                <p className="text-4xl font-black text-white">{d.wins}</p>
                <p className="text-[10px] text-slate-500 uppercase font-black mt-2 tracking-widest">Vitórias</p>
              </div>
            </div>
          </div>

          <div className="mb-12 h-64 w-full relative z-10">
            <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span> Gráfico de Desempenho
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} axisLine={false} tickLine={false} tick={{dy: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '20px', fontSize: '11px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                  cursor={{ stroke: '#4338ca', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="points" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#colorPts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {config.stages.map((s, i) => {
              const pts = d.results[i];
              const pos = d.positions[i];
              const isPole = normalizeName(s.pole) === d.name;
              const isActive = pts > 0;
              return (
                <div key={s.id} className={`p-5 rounded-3xl transition-all duration-300 ${isActive ? 'bg-slate-950/50 border border-white/5 shadow-lg' : 'bg-black/20 opacity-30 grayscale border border-transparent'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 font-black text-xs">E{s.id}</div>
                    <span className="text-white font-black text-xl">{pts}<span className="text-[10px] text-slate-600 ml-1">PTS</span></span>
                  </div>
                  <p className="text-slate-300 font-bold text-xs mb-1">{pos ? `${pos}º Lugar` : 'Ausente'}</p>
                  {isPole && <span className="text-[8px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter inline-block">Pole Position</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-16 font-sans text-slate-200 selection:bg-indigo-500/30">
      <div className="max-w-3xl mx-auto">
        <header className="mb-16 flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-indigo-600 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-slate-900 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <Trophy className="w-16 h-16 text-indigo-500" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter text-center uppercase leading-none">
            Kart <span className="text-indigo-600">Amigos</span>
          </h1>
          <p className="text-slate-600 text-[11px] font-black tracking-[0.5em] uppercase mt-4 text-center">Elite Racing League • Manaus</p>
        </header>

        <div className="flex flex-col items-center mb-12">
          <SeasonSelector />
        </div>

        {view === 'ranking' ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center justify-between px-6 mb-4">
               <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center">
                 <BarChart3 className="w-3 h-3 mr-3" /> Classificação {selectedSeason}
               </h2>
               <div className="flex items-center space-x-3 bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">
                 <span className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                 <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{processedData.length} Competidores</span>
               </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {processedData.map((d, i) => <RankingItem key={d.name} driver={d} index={i} />)}
            </div>
            
            <div className="mt-16 p-10 bg-slate-900/10 border border-white/5 rounded-[3rem] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
              <Settings2 className="w-6 h-6 text-slate-700 mx-auto mb-4" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm mx-auto">
                Regras {selectedSeason}: {config.drops} Descartes • +{config.bonusParticipation} Pontos Fidelidade ({config.participationThreshold}+ Etapas) <br/>
                {selectedSeason === '2026' ? 'Clique em um piloto para ver o histórico detalhado.' : 'Histórico de 2025 em modo leitura.'}
              </p>
            </div>
          </div>
        ) : <Analysis />}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e1b4b; border-radius: 10px; }
      `}</style>
    </div>
  );
}
