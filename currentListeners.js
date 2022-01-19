const currentListeners = new Map();

export function addVoiceChannel(voiceChannelId, listener, info) {
  var listenerInfo = new Map();
  listenerInfo.set(listener, info);
  currentListeners.set(voiceChannelId, listenerInfo);
}

export function addListener(voiceChannelId, listener, info) {
  var listenerInfoMap = currentListeners.get(voiceChannelId);
  listenerInfoMap.set(listener, info);
}

export function getCurrentListeners(voiceChannelId) {
  return currentListeners.get(voiceChannelId);
}

export function removeVoiceChannel(voiceChannelId) {
  if (currentListeners.has(voiceChannelId)) {
    currentListeners.remove(voiceChannelId);
  }
}

export function removeListener(voiceChannelId, listener) {
  var listenerInfoMap = currentListeners.get(voiceChannelId);
  if (listenerInfoMap.has(listener)) {
    listenerInfoMap.remove(listener);
  }
}