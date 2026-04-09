async function loadResults() {
    const grid = document.getElementById('dashboard-grid');
    try {
        const response = await fetch('results.json');
        const data = await response.json();
        document.getElementById('last-update').innerText = `Last Scan: ${data.last_update}`;
        grid.innerHTML = '';

        data.sites.forEach((site, index) => {
            const scoreColor = site.score > 80 ? 'text-green-500' : (site.score > 50 ? 'text-yellow-500' : 'text-red-500');
            const card = document.createElement('div');
            card.className = 'card p-6 rounded-2xl shadow-2xl flex flex-col transition-all hover:border-slate-500';
            
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-xl font-bold truncate w-2/3 text-white">${site.url}</h2>
                    <div class="text-right">
                        <p class="text-[10px] uppercase text-slate-500 font-bold leading-none">Score</p>
                        <p class="text-xl font-black ${scoreColor}">${site.score}/100</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                    <div class="flex items-center gap-3 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                        <span class="text-lg">📍</span>
                        <div>
                            <p class="text-[8px] uppercase text-slate-500 font-bold">Location</p>
                            <p class="text-[10px] text-slate-200 font-medium">${site.location} (${site.ip})</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                        <span class="text-lg">🛡️</span>
                        <div>
                            <p class="text-[8px] uppercase text-slate-500 font-bold">WAF</p>
                            <p class="text-[10px] text-slate-200 font-medium">${site.waf}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                        <span class="text-lg">🔗</span>
                        <div>
                            <p class="text-[8px] uppercase text-slate-500 font-bold">Broken Links</p>
                            <p class="text-[10px] ${site.broken_links > 0 ? 'text-red-400' : 'text-green-400'} font-medium">${site.broken_links} Issues</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                        <span class="text-lg">🔒</span>
                        <div>
                            <p class="text-[8px] uppercase text-slate-500 font-bold">SSL Expiry</p>
                            <p class="text-[10px] text-slate-200 font-medium">${site.ssl_expiry}</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-3 mb-6 font-black text-center">
                    <div class="bg-slate-900/80 py-3 rounded-xl border border-slate-800">
                        <p class="text-red-500 text-2xl">${site.high}</p>
                        <p class="text-[9px] text-slate-500 uppercase">High</p>
                    </div>
                    <div class="bg-slate-900/80 py-3 rounded-xl border border-slate-800">
                        <p class="text-yellow-500 text-2xl">${site.medium}</p>
                        <p class="text-[9px] text-slate-500 uppercase">Med</p>
                    </div>
                    <div class="bg-slate-900/80 py-3 rounded-xl border border-slate-800">
                        <p class="text-blue-500 text-2xl">${site.low}</p>
                        <p class="text-[9px] text-slate-500 uppercase">Low</p>
                    </div>
                </div>

                <button onclick="toggleDetails(${index})" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg transition-all">
                    Full Analysis Report
                </button>

                <div id="details-${index}" class="hidden mt-6 space-y-3 border-t border-slate-700/50 pt-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    ${site.details.map(alert => `
                        <div class="p-3 rounded-lg bg-slate-900/40 border-l-4 ${alert.risk === 'High' ? 'border-red-500' : 'border-yellow-500'}">
                            <h4 class="text-xs font-bold text-slate-200">${alert.alert}</h4>
                            <p class="text-[10px] text-slate-500 mt-1 font-mono break-all leading-tight">${alert.evidence || 'Header Alert'}</p>
                        </div>
                    `).join('')}
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (e) { console.error(e); }
}

function toggleDetails(i) { document.getElementById(`details-${i}`).classList.toggle('hidden'); }
document.addEventListener('DOMContentLoaded', loadResults);
