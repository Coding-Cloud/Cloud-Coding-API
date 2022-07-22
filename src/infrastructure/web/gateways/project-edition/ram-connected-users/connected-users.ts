import { Logger } from '@nestjs/common';

export const connectedUsers = new Map<string, string[]>();

export const addConnectedUsers = (room: string, username: string) => {
  if (!canAddUsername(room, username)) {
    return;
  }
  if (connectedUsers.has(room)) {
    connectedUsers.get(room).push(username);
    connectedUsers.set(room, connectedUsers.get(room));
  } else {
    connectedUsers.set(room, [username]);
  }
  Logger.log('add ' + username + ' to ' + room);
};

const canAddUsername = (room: string, username: string): boolean => {
  return (
    username !== '' &&
    (!connectedUsers.has(room) ||
      (connectedUsers.has(room) &&
        connectedUsers
          .get(room)
          .find((usernameConnected) => usernameConnected === username) ===
          undefined))
  );
};

export const deleteConnectedUsers = (room: string, username: string) => {
  if (connectedUsers.has(room)) {
    const connectedUsersFilter = connectedUsers
      .get(room)
      .filter((usernameFromMap) => usernameFromMap !== username);
    connectedUsers.set(room, connectedUsersFilter);
  }
};

export const getConnectedUsers = (room: string): string[] => {
  return connectedUsers.get(room);
};
