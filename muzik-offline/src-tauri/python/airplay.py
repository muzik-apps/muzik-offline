import asyncio
import json
import signal
import sys
from airplay_manager import AirplayManager
from response import createResponse

async def handle_command(command, manager: AirplayManager):
    """Handle commands by interacting with the ConnectionManager."""
    if command == "scan":
        devices = await manager.scan_devices()
        return createResponse("success", "devices found", devices)
    elif command == "connect":
        device_identifier = await manager.async_input("Enter device identifier: ")
        try:
            await manager.connect(device_identifier.strip())
            return createResponse("success", "connected", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    elif command == "connect-pair":
        device_identifier = await manager.async_input("Enter device identifier: ")
        try:
            await manager.pair_and_connect(device_identifier.strip())
            return createResponse("success", "connected", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    elif command == "disconnect":
        device_identifier = await manager.async_input("Enter device identifier: ")
        try:
            await manager.disconnect(device_identifier.strip())
            return createResponse("success", "disconnected", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    elif command == "stream":
        device_identifier = await manager.async_input("Enter device identifier: ")
        file_path = await manager.async_input("Enter file path: ")
        try:
            await manager.stream(device_identifier.strip(), file_path.strip())
            return createResponse("success", "streaming", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    elif command == "resume":
        device_identifier = await manager.async_input("Enter device identifier: ")
        try:
            await manager.resume(device_identifier.strip())
            return createResponse("success", "resumed", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    elif command == "pause":
        device_identifier = await manager.async_input("Enter device identifier: ")
        try:
            await manager.pause(device_identifier.strip())
            return createResponse("success", "paused", [])
        except Exception as ex:
            return createResponse("error", str(ex), [])
    elif command == "stop":
        device_identifier = await manager.async_input("Enter device identifier: ")
        try:
            await manager.stop(device_identifier.strip())
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
