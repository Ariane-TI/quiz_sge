// relatorio.js
// Funções UI para export CSV e para desenhar ranking simples
import { getResults, resultsToCSV, clearResults } from './ranking.js';

/** Cria e baixa arquivo CSV */
export function downloadCSV(){
  const results = getResults();
  if(!results || results.length === 0){
    alert("Nenhum resultado registrado ainda.");
    return;
  }
  const csv = resultsToCSV(results);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const now = new Date();
  const fname = `sge_quiz_results_${now.toISOString().slice(0,19).replace(/[:T]/g,'_')}.csv`;
  a.download = fname;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Renderiza um ranking simples (top 10) dentro de um container DOM */
export function renderRanking(container){
  const results = getResults()
    .slice()
    .sort((a,b) => b.percent - a.percent || a.timeMs - b.timeMs);
  if(results.length === 0){
    container.innerHTML = "<div class='small'>Nenhum resultado salvo.</div>";
    return;
  }
  const top = results.slice(0,50);
  let html = `<table class="table"><thead><tr><th>#</th><th>Nome</th><th>Pontos</th><th>%</th><th>Tempo (s)</th><th>Data</th></tr></thead><tbody>`;
  top.forEach((r,i) => {
    html += `<tr>
      <td>${i+1}</td>
      <td>${escapeHtml(r.name)}</td>
      <td>${r.score}/${r.total}</td>
      <td>${r.percent}%</td>
      <td>${(r.timeMs/1000).toFixed(1)}</td>
      <td>${new Date(r.dateISO).toLocaleString()}</td>
    </tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

/** Apaga todos os resultados (com confirmação) */
export function handleClearAll(container){
  if(!confirm("Apagar todos os resultados? Esta ação não pode ser desfeita.")) return;
  clearResults();
  renderRanking(container);
}

/** util */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
