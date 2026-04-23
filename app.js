const staticData = {
    "last_update": "2026-04-23 23:15:00",
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
                { "alert": "Strict-Transport-Security Header Not Set", "risk": "Low" },
                { "alert": "X-Content-Type-Options Header Missing", "risk": "Low" }
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
                { "alert": "Content Security Policy (CSP) Missing", "risk": "Medium" }
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
                { "alert": "Cross-Domain Misconfiguration", "risk": "Medium" }
            ]
        },
        {
            "name": "Andromeda Server",
            "url": "Home Infrastructure",
            "location": "Private Node",
            "os": "Ubuntu 24.04 LTS",
            "firewall": "pfSense Active",
            "status": "Active",
            "last_active": "2026-04-02",
            "temp": "30°C",
            "storage": "76GB Used / 800GB Total",
            "score": 98,
            "high": 0, "medium": 0, "low": 1,
            "isServer": true,
            "services": [
                "Tailscale VPN", "Immich Photos", "Jellyfin Media", 
                "Encrypted Vault", "Uptime Kuma", "Netdata", "Pi-Hole"
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
        
        const subTitle = site.isServer ? `Status: ${site.status} (${site.last_active})` : site.url.replace('https://', '');

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="w-2/3">
                    <h2 class="text-2xl font-black text-white tracking-tight leading-tight">${site.name}</h2>
                    <p class="text-[10px] text-slate-500 font-medium truncate uppercase tracking-widest">${subTitle}</p>
                </div>
                <div class="text-right">
                    <p class="text-[10px] uppercase text-slate-500 font-bold leading-none">Health</p>
                    <p class="text-xl font-black ${scoreColor}">${site.score}/100</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                <div class="flex items-center gap-3 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                    <span class="text-lg">${site.isServer ? '🖥️' : '📍'}</span>
                    <div>
                        <p class="text-[8px] uppercase text-slate-500 font-bold">${site.isServer ? 'OS Version' : 'Location'}</p>
                        <p class="text-[10px] text-slate-200 font-medium">${site.isServer ? site.os : site.location}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                    <span class="text-lg">🛡️</span>
                    <div>
                        <p class="text-[8px] uppercase text-slate-500 font-bold">${site.isServer ? 'Security' : 'WAF'}</p>
                        <p class="text-[10px] text-slate-200 font-medium">${site.isServer ? site.firewall : site.waf}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                    <span class="text-lg">🌡️</span>
                    <div>
                        <p class="text-[8px] uppercase text-slate-500 font-bold">${site.isServer ? 'Temperature' : 'Broken Links'}</p>
                        <p class="text-[10px] text-slate-200 font-medium">${site.isServer ? site.temp : site.broken_links + ' Issues'}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                    <span class="text-lg">${site.isServer ? '💾' : '🔒'}</span>
                    <div>
                        <p class="text-[8px] uppercase text-slate-500 font-bold">${site.isServer ? 'Storage' : 'SSL Expiry'}</p>
                        <p class="text-[10px] text-slate-200 font-medium">${site.isServer ? site.storage : site.ssl_expiry}</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-3 mb-6 font-black text-center text-xs uppercase tracking-tighter">
                <div class="bg-slate-900/80 py-3 rounded-xl border border-slate-800">
                    <p class="text-red-500 text-2xl">${site.high}</p>
                    <p class="text-slate-500">High</p>
                </div>
                <div class="bg-slate-900/80 py-3 rounded-xl border border-slate-800">
                    <p class="text-yellow-500 text-2xl">${site.medium}</p>
                    <p class="text-slate-500">Med</p>
                </div>
                <div class="bg-slate-900/80 py-3 rounded-xl border border-slate-800">
                    <p class="text-blue-500 text-2xl">${site.low}</p>
                    <p class="text-slate-500">Low</p>
                </div>
            </div>

            <button onclick="toggleDetails(${index})" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg transition-all">
                ${site.isServer ? 'View Running Services' : 'Full Analysis Report'}
            </button>

            <div id="details-${index}" class="hidden mt-6 space-y-2 border-t border-slate-700/50 pt-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                ${site.isServer 
                    ? site.services.map(s => `<div class="p-2 rounded bg-slate-800/60 border border-slate-700 text-[10px] font-bold text-blue-400">● ${s}</div>`).join('')
                    : site.details.map(alert => `
                        <div class="p-3 rounded-lg bg-slate-900/40 border-l-4 border-blue-500">
                            <h4 class="text-xs font-bold text-slate-200">${alert.alert}</h4>
                        </div>`).join('')
                }
            </div>
        `;
        grid.appendChild(card);
    });
}

function toggleDetails(i) {
    document.getElementById(`details-${i}`).classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', loadResults);
