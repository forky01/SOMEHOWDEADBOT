const users = new Map();

export function getUserAll() {
  return users;
}

export function getUser(discordName) {
  return users.get(discordName);
}

export function getUserByKeyPair(key, value) {
  var username;
  users.forEach((v, name) => {
    if (v.has(key)) {
      if (v.get(key) == value) {
        username = name;
      }
    }
  });
  return username;
}

export function addUser(discordName, key, value) {
  var userMap = new Map();
  userMap.set(key, value);
  users.set(discordName, userMap);
}

export function setUser(discordName, key, value) {
  var userMap = users.get(discordName);
  userMap.set(key, value);
  users.set(discordName, userMap);
}

export function removeKeyFromUser(discordName, key) {
  var user = users.get(discordName)
  if (user.has(key)) {
    user.delete(key);
  }
}