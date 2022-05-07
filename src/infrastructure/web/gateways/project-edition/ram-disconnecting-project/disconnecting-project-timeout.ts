import { Logger } from '@nestjs/common';

export const disconnectingProjectTimeout = new Map<string, NodeJS.Timeout[]>();

export const deleteDisconnectigProjectTimeout = (room: string) => {
  Logger.log('on passe dans le delete');
  console.log(disconnectingProjectTimeout);
  if (disconnectingProjectTimeout.has(room)) {
    Logger.log('on rentre bien clean le timeout');
    Logger.log(disconnectingProjectTimeout.get(room));
    disconnectingProjectTimeout.get(room).forEach((timeOut) => {
      clearTimeout(timeOut);
    });
    disconnectingProjectTimeout.delete(room);
  }
};

export const addDisconnectigProjectTimeout = (
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
