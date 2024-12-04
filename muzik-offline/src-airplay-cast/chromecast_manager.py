from pychromecast import CastBrowser
from pychromecast.controllers.media import MediaController
import pychromecast
import uuid

class ChromecastManager:
    def __init__(self):
        self.chromecasts: dict[str, MediaController] = {}
        self.browser: CastBrowser = None

    def scan_devices(self):
        """Scan for devices on the network."""
        (chromecasts, browser) = pychromecast.get_chromecasts()
        devices = []
        self.browser = browser
        if chromecasts is not list:
            return devices
        for chromecast in chromecasts:
            cast_uuid = uuid.uuid4()
            self.chromecasts[cast_uuid] = chromecast
            devices.append({
                "id": cast_uuid,
                "name": chromecast.namespace,
                "address": "unknown",
                "model": "unknown"
            })
        return devices
    
    def stream(self, file_path: str, device_uuids: list[str]):
        """Stream a file to a devices."""
        for device in device_uuids:
            chromecast = self.chromecasts[device]
            chromecast.cast_info.friendly_name
            chromecast.play_media(file_path, "audio/mp3")
            chromecast.block_until_active()

    def resume(self, device_uuids: list[str]):
        """Resume playback on a devices."""
        for device in device_uuids:
            chromecast = self.chromecasts[device]
            chromecast.play()

    def pause(self, device_uuids: list[str]):
        """Pause playback on devices."""
        for device in device_uuids:
            chromecast = self.chromecasts[device]
            chromecast.pause()

    def stop(self, device_uuids: list[str]):
        """Stop playback on a devices."""
        for device in device_uuids:
            chromecast = self.chromecasts[device]
            chromecast.stop()
    
    def stop_discovery(self):
        """Stop the discovery of devices."""
        self.browser.stop_discovery()

    def cleanup(self):
        """Cleanup resources."""
        if self.browser is not None:
            self.browser.stop_discovery()
        self.chromecasts.clear()