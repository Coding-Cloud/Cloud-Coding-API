import { Logger } from '@nestjs/common';

export const disconnectingProjectTimeout = new Map<string, NodeJS.Timeout[]>();

export const deleteDisconnectingProjectTimeout = (room: string) => {
  if (disconnectingProjectTimeout.has(room)) {
    Logger.log('Cancelling timeout for ' + room);
    disconnectingProjectTimeout.get(room).forEach((timeOut) => {
      clearTimeout(timeOut);
    });
    disconnectingProjectTimeout.delete(room);
  }
};

export const addDisconnectingProjectTimeout = (
  room: string,
  timeout: NodeJS.Timeout,
) => {
  if (disconnectingProjectTimeout.has(room)) return;
  let timeouts = [];
  if (disconnectingProjectTimeout.has(room)) {
    timeouts = disconnectingProjectTimeout.get(room);
    if (timeouts.find((roomTime) => roomTime !== undefined)) return;
  }
  timeouts.push(timeout);
  disconnectingProjectTimeout.set(room, timeouts);
};
