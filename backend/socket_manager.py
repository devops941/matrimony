import socketio
from fastapi import FastAPI

# Initialize Socket.IO AsyncServer
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*" # Allow CORS from frontend
)

# Create ASGI application wrapper
socket_app = socketio.ASGIApp(sio)

def init_socketio(app: FastAPI):
    # Mount socket.io at /socket.io
    app.mount("/socket.io", socket_app)

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def join_match_room(sid, data):
    # Data contains profile_id
    if isinstance(data, dict):
        profile_id = data.get("profile_id")
    else:
        profile_id = data
    if profile_id:
        await sio.enter_room(sid, profile_id)
        print(f"Client {sid} joined room: {profile_id}")

@sio.event
async def leave_match_room(sid, data):
    if isinstance(data, dict):
        profile_id = data.get("profile_id")
    else:
        profile_id = data
    if profile_id:
        await sio.leave_room(sid, profile_id)
        print(f"Client {sid} left room: {profile_id}")
