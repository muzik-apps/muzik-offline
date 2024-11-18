import sys
import json

def handle_command(command):
    # Example: Respond to commands
    if command == "scan":
        return {"devices": ["AirPods", "TV"]}
    return {"error": "unknown command"}

if __name__ == "__main__":
    for line in sys.stdin:
        command = line.strip()
        response = handle_command(command)
        print(json.dumps(response))
        sys.stdout.flush()  # Ensure the output is sent immediately