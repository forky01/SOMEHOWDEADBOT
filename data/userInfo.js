const users = new Map();

export function getUserAll() {
  return users;
}

export function getUser(discordName) {
  return users.get(discordName);
}

export function getUsernameByKeyPair(key, value) {
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
export function getUserValue(discordName, key) {
  if (users.has(discordName) && users.get(discordName).has(key)){
    return users.get(discordName).get(key);
  }
  return null;
}

export function addUser(discordName, param1, param2) {
  var userMap = new Map();
  userMap.set(param1[0], param1[1]);
  userMap.set(param2[0], param2[1]);
  users.set(discordName, userMap);
}

export function setUser(discordName, key, value) {
  var userMap = users.get(discordName);
  userMap.set(key, value);
  users.set(discordName, userMap);
}

export function removeKeyFromUser(discordName, key) {
  var user = users.get(discordName);
  if (user.has(key)) {
    user.delete(key);
  }
}