import ast
import asyncio
import json
import signal
import sys
from airplay_manager import AirplayManager
from chromecast_manager import ChromecastManager
from utils import createResponse
from utils import ResponseType
from utils import Status

async def handle_command(command: str, airplay_manager: AirplayManager, chromecast_manager: ChromecastManager):
    """Handle commands by interacting with the ConnectionManager."""
    if command.startswith("airplay"):
        command = command[8:].strip()
        if command == "scan":
            devices = await airplay_manager.scan_devices()
            return createResponse(Status.Success, ResponseType.DevicesFound, "devices found", devices)
        elif command.startswith("connect"):
            """command = "connect <device_identifier>"."""
            device_identifier = command[8:].strip()
            try:
                await airplay_manager.connect(device_identifier)
                return createResponse(Status.Success, ResponseType.Connected, "connected", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.ConnectionFailed, str(ex), [])
        elif command.startswith("pair"):
            """command = "pair <device_identifier>"."""
            device_identifier = command[5:].strip()
            try:
                await airplay_manager.pair(device_identifier)
                return createResponse(Status.Success, ResponseType.EnterPin, "enter pin", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.PairingFailed, str(ex), [])
        elif command.startswith("pin"):
            """command = "pin <pin>"."""
            pin = int(command[4:].strip())
            try:
                await airplay_manager.finish_pairing(pin)
                return createResponse(Status.Success, ResponseType.Connected, "connected", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.ConnectionFailed, str(ex), [])
        elif command.startswith("pair-connect"):
            """command = "pair-connect <device_identifier>"."""
            device_identifier = command[5:].strip()
            try:
                await airplay_manager.pair_and_connect(device_identifier)
                return createResponse(Status.Success, ResponseType.Connected, "connected", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.ConnectionFailed, str(ex), [])
        elif command.startswith("disconnect"):
            """command = "disconnect <device_identifier>"."""
            device_identifier = command[11:].strip()
            try:
                airplay_manager.disconnect(device_identifier)
                return createResponse(Status.Success, ResponseType.Disconnected, "disconnected", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.DisconnectionFailed, str(ex), [])
        elif command.startswith("stream"):
            """command = "stream <file_path>"."""
            file_path = command[6:].strip()
            try:
                await airplay_manager.stream(file_path)
                return createResponse(Status.Success, ResponseType.StreamingStarted, "streaming", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.StreamingFailed, str(ex), [])
        elif command == "resume":
            try:
                await airplay_manager.resume()
                return createResponse(Status.Success, ResponseType.Resumed, "resumed", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.ResumingFailed, str(ex), [])
        elif command == "pause":
            try:
                await airplay_manager.pause()
                return createResponse(Status.Success, ResponseType.Paused, "paused", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.PausingFailed, str(ex), [])
        elif command == "stop":
            try:
                await airplay_manager.stop()
                return createResponse(Status.Success, ResponseType.Stopped, "stopped", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.StoppingFailed, str(ex), [])
        else:
            return createResponse(Status.Error, ResponseType.UnknownCommand, "unknown command", [])
    elif command.startswith("chromecast"):
        command = command[11:].strip()
        if command == "scan":
            devices = chromecast_manager.scan_devices()
            return createResponse(Status.Success, ResponseType.DevicesFound, "devices found", devices)
        elif command.startswith("stop-scan"):
            """command = "stop-scan"."""
            try:
                chromecast_manager.stop_discovery()
                return createResponse(Status.Success, ResponseType.Disconnected, "discovery stopped", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.DiscoveryStoppingFailed, str(ex), [])
        elif command.startswith("stream"):
            """command = "stream <file_path> [id1, id2, id3, ..., idn]"."""
            file_path = command.split()[1]  # Second element is the file path
            device_uuids = ast.literal_eval(" ".join(command.split()[2:]))  # Combine the remaining parts and evaluate as a list
            try:
                chromecast_manager.stream(file_path, device_uuids)
                return createResponse(Status.Success, ResponseType.StreamingStarted, "streaming", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.StreamingFailed, str(ex), [])
        elif command == "resume":
            """command = "resume [id1, id2, id3, ..., idn]"."""
            device_uuids = ast.literal_eval(" ".join(command.split()[1:])) # Combine the remaining parts and evaluate as a list
            try:
                chromecast_manager.resume(device_uuids)
                return createResponse(Status.Success, ResponseType.Resumed, "resumed", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.ResumingFailed, str(ex), [])
        elif command == "pause":
            """command = "pause [id1, id2, id3, ..., idn]"."""
            device_uuids = ast.literal_eval(" ".join(command.split()[1:])) # Combine the remaining parts and evaluate as a list
            try:
                chromecast_manager.pause(device_uuids)
                return createResponse(Status.Success, ResponseType.Paused, "paused", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.PausingFailed, str(ex), [])
        elif command == "stop":
            """command = "stop [id1, id2, id3, ..., idn]"."""
            device_uuids = ast.literal_eval(" ".join(command.split()[1:])) # Combine the remaining parts and evaluate as a list
            try:
                chromecast_manager.stop()
                return createResponse(Status.Success, ResponseType.Stopped, "stopped", [])
            except Exception as ex:
                return createResponse(Status.Error, ResponseType.StoppingFailed, str(ex), [])
        else:
            return createResponse(Status.Error, ResponseType.UnknownCommand, "unknown command", [])
    else:
        return createResponse(Status.Error, ResponseType.UnknownCommand, "unknown command", [])

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
    except Exception as ex:
        print(f"An error occurred: {str(ex)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
