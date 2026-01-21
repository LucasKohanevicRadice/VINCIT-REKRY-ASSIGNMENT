import { Room } from '../models/room.model';
import { roomDb } from '../database/inMemoryDb';

export function getRoomById(roomId: string): Room | undefined {
  return roomDb.getById(roomId) || undefined;
}
