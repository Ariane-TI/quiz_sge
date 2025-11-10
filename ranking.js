// ranking.js
// Gerencia armazenamento dos resultados no LocalStorage e utilitários para ranking/export
export const STORAGE_KEY = "sge_quiz_results_v1";

/**
 * Salva um resultado (obj) no LocalStorage.
 * result = { name, score, total, percent, timeMs, dateISO, details: [{id, answerIndex, correctIndex}] }
 */
export function saveResult(result){
  const arr = getResults();
  arr.push(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

/** Retorna todos os resultados salvos (array) */
export function getResults(){
  try{
    const s = localStorage.getItem(STORAGE_KEY);
    if(!s) return [];
    const arr = JSON.parse(s);
    if(!Array.isArray(arr)) return [];
    return arr;
  }catch(e){
    console.error("Erro ao ler resultados:",e);
    return [];
  }
}

/** Limpa todos os resultados salvos */
export function clearResults(){
  localStorage.removeItem(STORAGE_KEY);
}

/** Gera CSV string a partir de resultados */
export function resultsToCSV(results){
  const header = ["Nome","Pontuação","Total","Percentual","TempoMs","Data","DetalhesJSON"];
  const rows = results.map(r => {
    return [
      csvEscape(r.name),
      r.score,
      r.total,
      r.percent,
      r.timeMs,
      r.dateISO,
      csvEscape(JSON.stringify(r.details))
    ].join(",");
  });
  return [header.join(","), ...rows].join("\r\n");
}

function csvEscape(v){
  if(v == null) return "";
  const s = String(v);
  if(s.includes(",") || s.includes('"') || s.includes("\n")){
    return `"${s.replace(/"/g,'""')}"`;
  }
  return s;
}
