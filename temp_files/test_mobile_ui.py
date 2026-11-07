import urllib.request
import sys

URL = "http://127.0.0.1:3091"

def test_mobile_ui():
    print(f"[*] Testing Mobile Friendly enhancements at {URL}...")
    try:
        req = urllib.request.Request(
            URL,
            headers={"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.status
            content = response.read().decode("utf-8")

            print(f"[+] HTTP Status: {status}")
            assert status == 200, f"Expected 200 OK, got {status}"

            checks = [
                ("Viewport fit cover check", "viewport-fit=cover"),
                ("Touch manipulation check", "touch-manipulation"),
                ("Overscroll none check", "overscroll-none"),
                ("Mobile touch buttons check", "LOMPAT"),
                ("Canvas block check", "canvas"),
            ]

            for label, pattern in checks:
                if pattern.lower() in content.lower():
                    print(f"    ✓ {label}: MATCHED ('{pattern}')")
                else:
                    print(f"    ✗ {label}: FAILED ('{pattern}')")
                    sys.exit(1)

            print("[+] All Mobile Friendly verification checks PASSED!")
            return True
    except Exception as e:
        print(f"[-] Test failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_mobile_ui()
