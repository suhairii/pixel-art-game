import urllib.request
import sys

URL = "http://127.0.0.1:3089"

def test_dani_game():
    print(f"[*] Testing Kembara Dani web server at {URL}...")
    try:
        req = urllib.request.Request(
            URL,
            headers={"User-Agent": "AntigravityDaniTester/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.status
            content = response.read().decode("utf-8")

            print(f"[+] HTTP Status: {status}")
            assert status == 200, f"Expected 200 OK, got {status}"

            checks = [
                ("Title check", "Kembara Dani"),
                ("Canvas Game check", "canvas"),
                ("Dani Portrait Asset check", "dani-portrait.png"),
                ("12 Poses Gallery check", "12 POSE ANIMASI"),
                ("Malaysian Story check", "Kampung Warisan"),
            ]

            for label, pattern in checks:
                if pattern.lower() in content.lower():
                    print(f"    ✓ {label}: MATCHED ('{pattern}')")
                else:
                    print(f"    ✗ {label}: FAILED ('{pattern}' not found)")
                    sys.exit(1)

            print("[+] All Kembara Dani server & UI verification checks PASSED!")
            return True
    except Exception as e:
        print(f"[-] Test failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_dani_game()
