import os
import time
import json
from zapv2 import ZAPv2
from dotenv import load_dotenv

# 1. Load configuration from .env file (for local development)
load_dotenv()

# API Key and Proxy configuration
# These are fetched from environment variables for security
ZAP_API_KEY = os.getenv('ZAP_API_KEY')
ZAP_PROXY = os.getenv('ZAP_PROXY_URL', 'http://127.0.0.1:8080')

# List of the 4 target sites you want to monitor
TARGETS = [
    'https://whiteguard.org',
    'https://research-agent-3c46.onrender.com/',
    'https://mgr1vas.github.io/whiteguard_etherlens/',
]

def run_zap_scan():
    # Initialize ZAP client
    zap = ZAPv2(apikey=ZAP_API_KEY, proxies={'http': ZAP_PROXY, 'https': ZAP_PROXY})
    
    # Structure for the final JSON results
    all_results = {
        "last_update": time.strftime("%Y-%m-%d %H:%M:%S"),
        "sites": []
    }

    for target in TARGETS:
        print(f"\nStarting scan for: {target}")
        
        # Clear previous session data for the current target
        zap.core.new_session(name="MySession", overwrite=True)

        # 1. Spider Scan (Crawling the site to find all pages)
        print(f"Starting Spider...")
        scan_id = zap.spider.scan(target)
        while int(zap.spider.status(scan_id)) < 100:
            print(f"Spider progress: {zap.spider.status(scan_id)}%")
            time.sleep(2)

        # 2. Passive Scan (Wait for ZAP to finish analyzing the captured traffic)
        print("Waiting for Passive Scan to complete...")
        while int(zap.pscan.records_to_scan) > 0:
            time.sleep(2)

        # 3. Collect Alerts (Vulnerabilities found)
        alerts = zap.core.alerts(baseurl=target)
        
        # Site-specific summary
        site_summary = {
            "url": target,
            "total_alerts": len(alerts),
            "high": 0,
            "medium": 0,
            "low": 0,
            "details": []
        }

        # Categorize alerts by risk level
        for alert in alerts:
            risk = alert['risk']
            if risk == 'High': site_summary['high'] += 1
            elif risk == 'Medium': site_summary['medium'] += 1
            elif risk == 'Low': site_summary['low'] += 1
            
            # Keep only essential info for the JSON dashboard
            site_summary['details'].append({
                "alert": alert['alert'],
                "risk": risk,
                "evidence": alert.get('evidence', '')
            })

        all_results["sites"].append(site_summary)
        print(f"Completed! Found {len(alerts)} alerts.")

    # 4. Save results to a JSON file for the web dashboard
    with open('results.json', 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=4, ensure_ascii=False)
    
    print("\n[SUCCESS] All scans finished. Results saved to results.json")

if __name__ == "__main__":
    # Check if API Key exists before running
    if not ZAP_API_KEY:
        print("[ERROR] ZAP_API_KEY not found. Please check your .env file or GitHub Secrets.")
    else:
        run_zap_scan()
