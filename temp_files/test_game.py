import urllib.request
import sys
import re

URL = "http://127.0.0.1:3088"

def test_game_server():
    print(f"[*] Testing local game endpoint: {URL}")
    try:
        req = urllib.request.Request(
            URL, 
            headers={"User-Agent": "AntigravityTestBot/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.status
            content = response.read().decode("utf-8")
            
            print(f"[+] HTTP Status: {status}")
            assert status == 200, f"Expected 200 OK, got {status}"

            # Check key elements in HTML
            checks = [
                ("Title check", "Pixel Runner"),
                ("Canvas Game element check", "canvas"),
                ("Hardware Chassis / Doppelrand styling", "rounded"),
                ("Awwwards Header check", "EXPERIMENT_08"),
            ]

            for label, pattern in checks:
                if pattern.lower() in content.lower():
                    print(f"    ✓ {label}: MATCHED ('{pattern}')")
                else:
                    print(f"    ✗ {label}: FAILED ('{pattern}' not found)")
                    sys.exit(1)

            print("[+] All automated UI & server integrity checks PASSED successfully!")
            return True
    except Exception as e:
        print(f"[-] Error connecting to server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_game_server()
