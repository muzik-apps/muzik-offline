from enum import Enum

class ResponseType(Enum):
    DevicesFound = 1
    Connected = 2
    EnterPin = 3
    Disconnected = 4
    StreamingStarted = 5
    Resumed = 6
    Paused = 7
    Stopped = 8
    ConnectionFailed = 9
    PairingFailed = 10
    DisconnectionFailed = 11
    StreamingFailed = 12
    ResumingFailed = 13
    PausingFailed = 14
    StoppingFailed = 15
    UnknownCommand = 16
    DiscoveryStoppingFailed = 17

class Status(Enum):
    Success = "success"
    Error = "error"

def createResponse(status: Status, type: ResponseType, message: str, data: list):
    response = {
        "status": status.value,
        "type": type.name,
        "message": message,
        "data": data
    }
    return response