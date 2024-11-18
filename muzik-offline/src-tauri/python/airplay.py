import sys
import json
import signal
import asyncio
import pyatv

async def handle_command(command):
    # Example: Respond to commands
    if command == "scan":
        devices = []
        for result in await pyatv.scan(loop=asyncio.get_event_loop()):
            devices.append({"name": result.name, "address": str(result.address)})
        return {"devices": devices}
    return {"error": "unknown command"}

def graceful_shutdown(signal, frame):
    print("\nShutting down gracefully...")
    sys.exit(0)

if __name__ == "__main__":
    # Register the signal handler for Ctrl-C
    signal.signal(signal.SIGINT, graceful_shutdown)

    print("Listening for commands... Press Ctrl-C to exit.")
    try:
        for line in sys.stdin:
            command = line.strip()
            print(command)
            response = handle_command(command)
            print(json.dumps(response))
            sys.stdout.flush()  # Ensure the output is sent immediately
    except KeyboardInterrupt:
        # Catch KeyboardInterrupt and shutdown gracefully
        graceful_shutdown(None, None)
