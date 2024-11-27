def createResponse(status: str, message: str, data: list):
    response = {
        "status": status,
        "message": message,
        "data": data
    }
    return response