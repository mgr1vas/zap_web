import os
import time
import json
import socket
import ssl
import requests
from datetime import datetime
from zapv2 import ZAPv2
from dotenv import load_dotenv
from bs4 import BeautifulSoup

# Load configuration
load_dotenv()

ZAP_API_KEY = os.getenv('ZAP_API_KEY')
ZAP_PROXY = os.getenv('ZAP_PROXY_URL', 'http://127.0.0.1:8080')

TARGETS = [
    'https://whiteguard.org',
    'https://research-agent-3c46.onrender.com/',
    'https://mgr1vas.github.io/whiteguard_etherlens/'
]

def check_broken_links(url):
    """Checks the first 10 internal/external links for 404 errors"""
    broken_count = 0
    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')
        links = [a.get('href') for a in soup.find_all('a', href=True)][:10]
        for link in links:
            if link.startswith('http'):
                try:
                    r = requests.head(link, timeout=3)
                    if r.status_code >= 400: broken_count += 1
                except: pass
    except: pass
    return broken_count

def detect_waf(url):
    """Detects WAF providers from HTTP response headers"""
    try:
        r = requests.get(url, timeout=5)
        h = str(r.headers).lower()
        if 'cloudflare' in h: return "Cloudflare"
        if 'incapsula' in h: return "Imperva"
        if 'sucuri' in h: return "Sucuri"
        if 'aws-waf' in h: return "AWS WAF"
        return "None Detected"
    except: return "Unknown"

def get_extra_info(url):
    domain = url.replace('https://', '').replace('http://', '').split('/')[0]
    info = {
        "ip": "N/A", "location": "Unknown", "ssl_expiry": "N/A", 
        "server": "Unknown", "waf": "None", "broken_links": 0
    }
    try:
        ip_addr = socket.gethostbyname(domain)
        info["ip"] = ip_addr
        geo = requests.get(f"https://ipapi.co/{ip_addr}/json/", timeout=5).json()
        info["location"] = f"{geo.get('city', 'Unknown')}, {geo.get('country_code', 'UN')}"
        info["waf"] = detect_waf(url)
        info["broken_links"] = check_broken_links(url)
        
        res = requests.get(url, timeout=5)
        info["server"] = res.headers.get('Server', 'Hidden')

        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                expiry_date = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                info["ssl_expiry"] = expiry_date.strftime("%Y-%m-%d")
    except: pass
    return info

def calculate_score(h, m, l):
    score = 100 - (h * 25 + m * 10 + l * 2)
    return max(0, score)

def run_zap_scan():
    zap = ZAPv2(apikey=ZAP_API_KEY, proxies={'http': ZAP_PROXY, 'https': ZAP_PROXY})
    all_results = {"last_update": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "sites": []}

    for target in TARGETS:
        print(f"Scanning: {target}")
        extra = get_extra_info(target)
        zap.core.new_session(name="MySession", overwrite=True)
        zap.spider.scan(target)
        while int(zap.spider.status()) < 100: time.sleep(2)
        while int(zap.pscan.records_to_scan) > 0: time.sleep(2)

        alerts = zap.core.alerts(baseurl=target)
        h = sum(1 for a in alerts if a['risk'] == 'High')
        m = sum(1 for a in alerts if a['risk'] == 'Medium')
        l = sum(1 for a in alerts if a['risk'] == 'Low')

        all_results["sites"].append({
            "url": target, "ip": extra["ip"], "location": extra["location"],
            "ssl_expiry": extra["ssl_expiry"], "server": extra["server"],
            "waf": extra["waf"], "broken_links": extra["broken_links"],
            "score": calculate_score(h, m, l), "high": h, "medium": m, "low": l,
            "details": [{"alert": a['alert'], "risk": a['risk'], "evidence": a.get('evidence', '')} for a in alerts]
        })

    with open('results.json', 'w') as f: json.dump(all_results, f, indent=4)
    print("\n[SUCCESS] Scan complete.")

if __name__ == "__main__":
    run_zap_scan()
