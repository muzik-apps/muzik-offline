import asyncio
import pyatv
from pyatv.const import Protocol
from pyatv.interface import AppleTV

class AirplayManager:
    def __init__(self):
        self.connections: dict[str, AppleTV] = {}

    async def scan_devices(self):
        """Scan for devices on the network."""
        devices = []
        for result in await pyatv.scan(loop=asyncio.get_event_loop()):
            devices.append({
                "id": result.identifier,
                "name": result.name,
                "address": str(result.address),
                "model": result.device_info.model
            })
        return devices

    async def connect(self, device_identifier: str):
        """Connect to a device by its identifier."""
        loop = asyncio.get_event_loop()
        results = await pyatv.scan(identifier=device_identifier, loop=loop)
        if not results:
            raise ValueError("Device not found")

        try:
            atv = await pyatv.connect(results[0], loop=loop)
            self.connections[device_identifier] = atv
        except Exception as ex:
            raise RuntimeError(f"Failed to connect: {str(ex)}")

    async def pair_and_connect(self, device_identifier: str):
        """Pair with a device and connect to it."""
        loop = asyncio.get_event_loop()
        results = await pyatv.scan(identifier=device_identifier, loop=loop)
        if not results:
            raise ValueError("Device not found")

        pairing = await pyatv.pair(results[0], Protocol.MRP, loop=loop)
        await pairing.begin()

        try:
            pin = int(await self.async_input("Enter PIN: "))
            pairing.pin(pin)
            await pairing.finish()

            if pairing.has_paired:
                atv = await pyatv.connect(results[0], loop=loop)
                await pairing.close()
                self.connections[device_identifier] = atv
            else:
                await pairing.close()
                raise RuntimeError("Failed to pair")
        except Exception as ex:
            await pairing.close()
            raise RuntimeError(f"Pairing error: {str(ex)}")

    async def disconnect(self, device_identifier: str):
        """Disconnect a device by its identifier."""
        if device_identifier in self.connections:
            self.connections[device_identifier].close()
            del self.connections[device_identifier]
        else:
            raise ValueError("Device not connected")

    async def stream(self, device_identifier: str, file_path: str):
        """Stream a file to a device."""
        if device_identifier not in self.connections:
            raise ValueError("Device not connected")

        atv = self.connections[device_identifier]
        await atv.stream.stream_file(file_path)

    async def resume(self, device_identifier: str):
        """Resume playback on a device."""
        if device_identifier not in self.connections:
            raise ValueError("Device not connected")

        atv = self.connections[device_identifier]
        await atv.remote_control.play()

    async def pause(self, device_identifier: str):
        """Pause playback on a device."""
        if device_identifier not in self.connections:
            raise ValueError("Device not connected")

        atv = self.connections[device_identifier]
        await atv.remote_control.pause()

    async def stop(self, device_identifier: str):
        """Stop playback on a device."""
        if device_identifier not in self.connections:
            raise ValueError("Device not connected")

        atv = self.connections[device_identifier]
        await atv.remote_control.stop()

    def cleanup(self):
        """Close all connections."""
        for atv in self.connections.values():
            atv.close()
        self.connections.clear()

    async def async_input(self, prompt=""):
        """Asynchronous input function."""
        return await asyncio.get_event_loop().run_in_executor(None, input, prompt)
