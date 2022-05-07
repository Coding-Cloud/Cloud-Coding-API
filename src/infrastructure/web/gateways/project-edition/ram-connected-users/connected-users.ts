export const conectedUsers = new Map<string, string[]>();

export const addConnectedUsers = (room: string, username: string) => {
  if (!canAddUsername(room, username)) {
    return;
  }
  if (conectedUsers.has(room)) {
    conectedUsers.get(room).push(username);
    conectedUsers.set(room, conectedUsers.get(room));
  } else {
    conectedUsers.set(room, [username]);
  }
};

const canAddUsername = (room: string, username: string): boolean => {
  return (
    username !== '' &&
    (!conectedUsers.has(room) ||
      (conectedUsers.has(room) &&
        conectedUsers
          .get(room)
          .find((usernameConnected) => usernameConnected === username) ===
          undefined))
  );
};

export const deleteConnectedUsers = (room: string, username: string) => {
  if (conectedUsers.has(room)) {
    const connectedUsersFilter = conectedUsers
      .get(room)
      .filter((usernameFromMap) => usernameFromMap !== username);
    console.log(connectedUsersFilter);

    conectedUsers.set(room, connectedUsersFilter);
  }
};

export const getConnectedUsers = (room: string): string[] => {
  console.log(conectedUsers);
  return conectedUsers.get(room);
};
