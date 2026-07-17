import asyncio
from db import db
from porutham_engine import calculate_porutham
from socket_manager import sio
from typing import Dict, Any

# Async queue for matching requests
match_queue = asyncio.Queue()

# Dict to store status of matching tasks
task_status: Dict[str, Any] = {}

async def add_match_task(profile_id: str):
    """Add a profile matching job to the background queue."""
    task_status[profile_id] = {
        "status": "queued",
        "progress": 0,
        "results": []
    }
    await match_queue.put(profile_id)
    # Emit queued status via Socket.IO
    await sio.emit("match_status", {
        "profile_id": profile_id,
        "status": "queued",
        "progress": 0
    }, room=profile_id)

async def match_worker():
    """Background worker that processes matching tasks sequentially."""
    while True:
        profile_id = await match_queue.get()
        try:
            task_status[profile_id]["status"] = "processing"
            await sio.emit("match_status", {
                "profile_id": profile_id,
                "status": "processing",
                "progress": 5
            }, room=profile_id)

            # 1. Fetch primary profile
            primary = await db.profile.find_unique(where={"id": profile_id})
            if not primary:
                task_status[profile_id]["status"] = "failed"
                task_status[profile_id]["error"] = "Primary profile not found"
                await sio.emit("match_status", {
                    "profile_id": profile_id,
                    "status": "failed",
                    "error": "Primary profile not found"
                }, room=profile_id)
                match_queue.task_done()
                continue

            # 2. Fetch all opposite-gender profiles
            opposite_gender = "Female" if primary.gender == "Male" else "Male"
            candidates = await db.profile.find_many(
                where={"gender": opposite_gender, "approvedByAdmin": True}
            )

            total_candidates = len(candidates)
            if total_candidates == 0:
                task_status[profile_id] = {
                    "status": "completed",
                    "progress": 100,
                    "results": []
                }
                await sio.emit("match_status", {
                    "profile_id": profile_id,
                    "status": "completed",
                    "progress": 100,
                    "results": []
                }, room=profile_id)
                match_queue.task_done()
                continue

            results = []
            
            for idx, candidate in enumerate(candidates):
                # Astrological calculations
                if primary.gender == "Male":
                    bride_star = candidate.nakshatra
                    groom_star = primary.nakshatra
                else:
                    bride_star = primary.nakshatra
                    groom_star = candidate.nakshatra

                match_result = await calculate_porutham(
                    bride_star_name=bride_star,
                    groom_star_name=groom_star
                )

                results.append({
                    "profile": candidate,
                    "matchResult": match_result
                })

                # Yield control to the event loop every 50 records
                # This ensures uvicorn remains 100% responsive when handling lakhs of profiles
                if idx % 50 == 0:
                    progress = int(5 + (idx / total_candidates) * 90)
                    await sio.emit("match_status", {
                        "profile_id": profile_id,
                        "status": "processing",
                        "progress": progress
                    }, room=profile_id)
                    await asyncio.sleep(0) # yield event loop execution to other HTTP tasks

            # Sort results descending by match percentage
            results.sort(key=lambda x: x["matchResult"]["percentage"], reverse=True)

            task_status[profile_id] = {
                "status": "completed",
                "progress": 100,
                "results": results
            }

            await sio.emit("match_status", {
                "profile_id": profile_id,
                "status": "completed",
                "progress": 100,
                "results": results
            }, room=profile_id)

        except Exception as e:
            print(f"Error processing match task for {profile_id}: {e}")
            task_status[profile_id] = {
                "status": "failed",
                "error": str(e)
            }
            await sio.emit("match_status", {
                "profile_id": profile_id,
                "status": "failed",
                "error": str(e)
            }, room=profile_id)
        finally:
            match_queue.task_done()

def start_match_worker():
    """Start the matching worker loop task."""
    asyncio.create_task(match_worker())
