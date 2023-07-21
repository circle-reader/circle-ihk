export function getHash(
  key: string | Array<string>,
  value?: string,
  hashs: Array<string> = location.hash.substring(1).split('&')
) {
  let matchs: Array<string> = [];
  // # 会成 ['']
  if (hashs.join('').length <= 0) {
    return {
      hashs: [],
      hash: matchs,
    };
  }
  const newKey = Array.isArray(key) ? key : [key];
  const hashArr = hashs.filter((item: string) => {
    const index = newKey.findIndex((itemKey) => item.indexOf(itemKey) >= 0);
    if (index < 0) {
      return true;
    } else {
      matchs.push(item);
    }
    return;
  });
  if (value) {
    const newHash = `${key}=${value}`;
    hashArr.push(newHash);
    matchs = [];
    matchs.push(newHash);
  }
  return {
    hashs: hashArr,
    hash: matchs,
  };
}

export function setHash(hashs?: Array<string>) {
  const hashsToUpdate = Array.isArray(hashs) ? hashs : [];
  // Uncaught (in promise) DOMException: Failed to execute 'replaceState' on 'History': A history state object with URL xxx cannot be created in a document with origin xxx and URL xxx.
  try {
    window.history.replaceState(
      null,
      '',
      `${location.pathname + location.search}${
        hashsToUpdate.length > 0 ? '#' + hashsToUpdate.join('&') : ''
      }`
    );
  } catch (e) {
    location.hash = hashsToUpdate.length > 0 ? hashsToUpdate.join('&') : '';
  }
}
