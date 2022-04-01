const player = new Map();

export function addPlayerVoiceChannel(voiceChannelId, listener, info) {
  var listenerInfo = new Map();
  listenerInfo.set(listener, info);
  var listeners = new Map();
  listeners.set("listeners", listenerInfo);
  player.set(voiceChannelId, listeners);
}

export function setPlayerQueue(voiceChannelId, songQueue) {
  if (player.has(voiceChannelId)) {
    var queue = player.get(voiceChannelId);
    queue.set("queue", songQueue);
  }
}

export function getPlayerQueue(voiceChannelId) {
  if (player.has(voiceChannelId)) {
    return player.get(voiceChannelId).get("queue");
  }
}

export function updatePlayerQueue() {
  //when fetching queue probs needa delete past songs

}

export function addToPlayerQueue() {

}

export function insertToPlayerQueue() {

}

export function addPlayerListener(voiceChannelId, listener, info) {
  if (player.has(voiceChannelId)) {
    var listenerInfo = player.get(voiceChannelId).get("listeners");
    listenerInfo.set(listener, info);
  }
}

export function getPlayerListeners(voiceChannelId) {
  if (player.has(voiceChannelId)) {
    return player.get(voiceChannelId).get("listeners");
  }
}

export function removePlayerVoiceChannel(voiceChannelId) {
  if (player.has(voiceChannelId)) {
    player.remove(voiceChannelId);
  }
}

export function removePlayerListener(voiceChannelId, listener) {
  if (player.has(voiceChannelId)) {
    var listenerInfo = player.get(voiceChannelId).get("listeners");
    if (listenerInfo.has(listener)) {
      listenerInfo.remove(listener);
    }
  }
}