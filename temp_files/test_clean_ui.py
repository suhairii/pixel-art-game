import urllib.request
import sys

URL = "http://127.0.0.1:3090"

def test_clean_ui():
    print(f"[*] Testing Clean Minimalist UI at {URL}...")
    try:
        req = urllib.request.Request(
            URL,
            headers={"User-Agent": "CleanUITester/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.status
            content = response.read().decode("utf-8")

            print(f"[+] HTTP Status: {status}")
            assert status == 200, f"Expected 200 OK, got {status}"

            # Must HAVE game canvas and buttons
            must_have = [
                ("Canvas Game element", "canvas"),
                ("Jump button", "LOMPAT"),
                ("Start game action", "MAIN SEKARANG"),
            ]

            for label, pattern in must_have:
                if pattern.lower() in content.lower():
                    print(f"    ✓ [PRESENT] {label}: MATCHED ('{pattern}')")
                else:
                    print(f"    ✗ [MISSING] {label}: FAILED ('{pattern}')")
                    sys.exit(1)

            # Must NOT have verbose pose gallery or bottom bentos
            must_not_have = [
                ("12 Pose Gallery text", "12 POSE ANIMASI"),
                ("Telemetry Idle badge", "POSE: IDLE"),
            ]

            for label, pattern in must_not_have:
                if pattern.lower() not in content.lower():
                    print(f"    ✓ [CLEANED] {label}: Verified absent")
                else:
                    print(f"    ✗ [STILL PRESENT] {label}: Found unwanted text '{pattern}'")
                    sys.exit(1)

            print("[+] All Clean UI checks PASSED! Screen is minimal, focused only on game and buttons.")
            return True
    except Exception as e:
        print(f"[-] Test failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_clean_ui()
