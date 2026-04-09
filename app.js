// Hardcoded Data με ονόματα και domains
const staticData = {
    "last_update": "2026-04-09 18:00:00",
    "sites": [
        {
            "name": "Whiteguard",
            "url": "https://whiteguard.org",
            "location": "San Francisco, US",
            "waf": "CloudFlare",
            "broken_links": 2,
            "ssl_expiry": "2026-05-16",
            "score": 94,
            "high": 0, "medium": 0, "low": 3,
            "details": [
                { "alert": "Strict-Transport-Security Header Not Set", "risk": "Low", "evidence": "" },
                { "alert": "X-Content-Type-Options Header Missing", "risk": "Low", "evidence": "" },
                { "alert": "X-Frame-Options Header Not Set", "risk": "Low", "evidence": "" }
            ]
        },
        {
            "name": "Research Agent",
            "url": "https://research-agent-3c46.onrender.com",
            "location": "San Francisco, US",
            "waf": "CloudFlare",
            "broken_links": 0,
            "ssl_expiry": "2026-06-26",
            "score": 54,
            "high": 0, "medium": 4, "low": 3,
            "details": [
                { "alert": "Content Security Policy (CSP) Header Not Set", "risk": "Medium", "evidence": "" },
                { "alert": "Missing Anti-clickjacking Header", "risk": "Medium", "evidence": "" },
                { "alert": "Insecure Cookie Attribute", "risk": "Medium", "evidence": "" },
                { "alert": "Sub Resource Integrity Attribute Missing", "risk": "Medium", "evidence": "" }
            ]
        },
        {
            "name": "Etherlens",
            "url": "https://mgr1vas.github.io/whiteguard_etherlens/",
            "location": "San Francisco, US",
            "waf": "None Detected",
            "broken_links": 0,
            "ssl_expiry": "2026-05-07",
            "score": 90,
            "high": 0, "medium": 1, "low": 0,
            "details": [
                { "alert": "Cross-Domain Misconfiguration", "risk": "Medium", "evidence": "Access-Control-Allow-Origin: *" }
            ]
        }
    ]
};

function loadResults() {
    const grid = document.getElementById('dashboard-grid');
    const lastUpdateEl = document.getElementById('last-update');

    lastUpdateEl.innerText = `Last Scan: ${staticData.last_update}`;
    grid.innerHTML = '';

    staticData.sites.forEach((site, index) => {
        const scoreColor = site.score > 80 ? 'text-green-500' : (site.score > 50 ? 'text-yellow-500' : 'text-red-500');
        const card = document.createElement('div');
        card.className = 'card p-6 rounded-2xl shadow-2xl flex flex-col transition-all hover:border-slate-500';
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="w-2/3">
                    <h2 class="text-2xl font-black text-white tracking-tight leading-tight">${site.name}</h2>
                    <p class="text-[10px] text-slate-500 font-medium truncate">${site.url.replace('https://', '')}</p>
                </div>
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
                        <p class="text-[10px] text-slate-200 font-medium">${site.location}</p>
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
                    <div class="p-3 rounded-lg bg-slate-900/40 border-l-4 ${alert.risk === 'High' ? 'border-red-500' : (alert.risk === 'Medium' ? 'border-yellow-500' : 'border-blue-500')}">
                        <h4 class="text-xs font-bold text-slate-200">${alert.alert}</h4>
                        <p class="text-[10px] text-slate-500 mt-1 font-mono break-all leading-tight">${alert.evidence || 'Security Policy Check'}</p>
                    </div>
                `).join('')}
            </div>
        `;
        grid.appendChild(card);
    });
}

function toggleDetails(i) {
    document.getElementById(`details-${i}`).classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', loadResults);
