import asyncio
import json
import signal
import sys
from airplay_manager import AirplayManager
from response import createResponse

async def handle_command(command: str, manager: AirplayManager):
    """Handle commands by interacting with the ConnectionManager."""
    if command == "scan":
        devices = await manager.scan_devices()
        return createResponse("success", "devices found", devices)
    elif command.startswith("connect"):
        """command = "connect <device_identifier>"."""
        device_identifier = command[8:].strip()
        try:
            await manager.connect(device_identifier)
            return createResponse("success", "connected", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    elif command.startswith("pair"):
        """command = "pair <device_identifier>"."""
        device_identifier = command[5:].strip()
        try:
            await manager.pair_and_connect(device_identifier)
            return createResponse("success", "connected", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    elif command.startswith("disconnect"):
        """command = "disconnect <device_identifier>"."""
        device_identifier = command[11:].strip()
        try:
            await manager.disconnect(device_identifier)
            return createResponse("success", "disconnected", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    elif command.startswith("stream"):
        """command = "stream <file_path>"."""
        file_path = command[6:].strip()
        try:
            await manager.stream(file_path)
            return createResponse("success", "streaming", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    elif command == "resume":
        try:
            await manager.resume()
            return createResponse("success", "resumed", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    elif command == "pause":
        try:
            await manager.pause()
            return createResponse("success", "paused", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    elif command == "stop":
        try:
            await manager.stop()
            return createResponse("success", "stopped", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    else:
        return createResponse("error", "unknown command", [])

async def main():
    manager = AirplayManager()

    def graceful_shutdown(signal, frame):
        """Handle graceful shutdown."""
        manager.cleanup()
        sys.exit(0)

    signal.signal(signal.SIGINT, graceful_shutdown)

    try:
        while True:
            command = await manager.async_input("Enter command: ")
            response = await handle_command(command, manager)
            print(json.dumps(response))
            sys.stdout.flush()
    except KeyboardInterrupt:
        graceful_shutdown(None, None)


if __name__ == "__main__":
    asyncio.run(main())
