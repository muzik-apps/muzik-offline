import asyncio
import json
import signal
import sys
from airplay_manager import AirplayManager
from chromecast_manager import ChromecastManager
from response import createResponse

async def handle_command(command: str, airplay_manager: AirplayManager, chromecast_manager: ChromecastManager):
    """Handle commands by interacting with the ConnectionManager."""
    if command.startswith("airplay"):
        command = command[8:].strip()
        if command == "scan":
            devices = await airplay_manager.scan_devices()
            return createResponse("success", "devices found", devices)
        elif command.startswith("connect"):
            """command = "connect <device_identifier>"."""
            device_identifier = command[8:].strip()
            try:
                await airplay_manager.connect(device_identifier)
                return createResponse("success", "connected", [])
            except Exception as ex:
                return createResponse("error", str(ex), [])
        elif command.startswith("pair"):
            """command = "pair <device_identifier>"."""
            device_identifier = command[5:].strip()
            try:
                await airplay_manager.pair_and_connect(device_identifier)
                return createResponse("success", "connected", [])
            except Exception as ex:
                return createResponse("error", str(ex), [])
        elif command.startswith("disconnect"):
            """command = "disconnect <device_identifier>"."""
            device_identifier = command[11:].strip()
            try:
                airplay_manager.disconnect(device_identifier)
                return createResponse("success", "disconnected", [])
            except Exception as ex:
                return createResponse("error", str(ex), [])
        elif command.startswith("stream"):
            """command = "stream <file_path>"."""
            file_path = command[6:].strip()
            try:
                await airplay_manager.stream(file_path)
                return createResponse("success", "streaming", [])
            except Exception as ex:
                return createResponse("error", str(ex), [])
        elif command == "resume":
            try:
                await airplay_manager.resume()
                return createResponse("success", "resumed", [])
            except Exception as ex:
                return createResponse("error", str(ex), [])
        elif command == "pause":
            try:
                await airplay_manager.pause()
                return createResponse("success", "paused", [])
            except Exception as ex:
                return createResponse("error", str(ex), [])
        elif command == "stop":
            try:
                await airplay_manager.stop()
                return createResponse("success", "stopped", [])
            except Exception as ex:
                return createResponse("error", str(ex), [])
        else:
            return createResponse("error", "unknown command", [])
    elif command.startswith("chromecast"):
        command = command[11:].strip()
        if command == "scan":
            devices = chromecast_manager.scan_devices()
            return createResponse("success", "devices found", devices)
        elif command.startswith("stop-scan"):
            """command = "stop-scan"."""
            try:
                chromecast_manager.stop_discovery()
                return createResponse("success", "disconnected", [])
            except Exception as ex:
                return createResponse("error", str(ex), [])
        elif command.startswith("stream"):
            """command = "stream <file_path>"."""
            file_path = command[6:].strip()
            try:
                chromecast_manager.stream(file_path)
                return createResponse("success", "streaming", [])
            except Exception as ex:
                return createResponse("error", str(ex), [])
        elif command == "resume":
            try:
                chromecast_manager.resume()
                return createResponse("success", "resumed", [])
            except Exception as ex:
                return createResponse("error", str(ex), [])
        elif command == "pause":
            try:
                chromecast_manager.pause()
                return createResponse("success", "paused", [])
            except Exception as ex:
                return createResponse("error", str(ex), [])
        elif command == "stop":
            try:
                chromecast_manager.stop()
                return createResponse("success", "stopped", [])
            except Exception as ex:
                return createResponse("error", str(ex), [])
        else:
            return createResponse("error", "unknown command", [])
    else:
        return createResponse("error", "unknown command", [])

async def main():
    airplay_manager = AirplayManager()
    chromecast_manager = ChromecastManager()

    def graceful_shutdown(signal, frame):
        """Handle graceful shutdown."""
        airplay_manager.cleanup()
        chromecast_manager.cleanup()
        sys.exit(0)

    signal.signal(signal.SIGINT, graceful_shutdown)

    try:
        while True:
            command = input("Enter command: ")
            response = await handle_command(command, airplay_manager, chromecast_manager)
            print(json.dumps(response))
            sys.stdout.flush()
    except KeyboardInterrupt:
        graceful_shutdown(None, None)


if __name__ == "__main__":
    asyncio.run(main())
