async function loadResults() {
    const grid = document.getElementById('dashboard-grid');
    const lastUpdateEl = document.getElementById('last-update');

    try {
        const response = await fetch('results.json');
        const data = await response.json();

        lastUpdateEl.innerText = `Last Scan: ${data.last_update}`;
        grid.innerHTML = '';

        data.sites.forEach((site, index) => {
            const statusText = site.high > 0 ? 'Action Required' : (site.medium > 0 ? 'Warning' : 'Secure');
            const badgeClass = site.high > 0 ? 'bg-red-900/30 text-red-500' : (site.medium > 0 ? 'bg-yellow-900/30 text-yellow-500' : 'bg-green-900/30 text-green-500');

            const card = document.createElement('div');
            card.className = 'card p-6 rounded-xl shadow-xl flex flex-col';
            
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-xl font-semibold truncate w-2/3" title="${site.url}">${site.url}</h2>
                    <span class="text-xs uppercase font-bold px-2 py-1 rounded ${badgeClass}">${statusText}</span>
                </div>
                
                <div class="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div class="bg-slate-900/50 p-2 rounded border border-slate-800">
                        <p class="text-red-500 font-bold text-xl">${site.high}</p>
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest">High</p>
                    </div>
                    <div class="bg-slate-900/50 p-2 rounded border border-slate-800">
                        <p class="text-yellow-500 font-bold text-xl">${site.medium}</p>
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest">Medium</p>
                    </div>
                    <div class="bg-slate-900/50 p-2 rounded border border-slate-800">
                        <p class="text-blue-500 font-bold text-xl">${site.low}</p>
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest">Low</p>
                    </div>
                </div>

                <button onclick="toggleDetails(${index})" class="w-full py-2 bg-slate-700/50 hover:bg-slate-700 rounded text-xs font-bold uppercase tracking-widest transition mb-4">
                    View Alert Details
                </button>

                <div id="details-${index}" class="hidden space-y-3 mt-2 border-t border-slate-700 pt-4 overflow-y-auto max-h-60">
                    ${site.details.map(alert => `
                        <div class="text-xs p-3 rounded bg-slate-900/30 border-l-2 ${alert.risk === 'Medium' ? 'border-yellow-500' : 'border-blue-500'}">
                            <p class="font-bold text-slate-200">${alert.alert}</p>
                            <p class="text-slate-500 mt-1 italic">${alert.evidence ? 'Evidence: ' + alert.evidence : 'No evidence found'}</p>
                        </div>
                    `).join('')}
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

function toggleDetails(index) {
    const el = document.getElementById(`details-${index}`);
    el.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', loadResults);
