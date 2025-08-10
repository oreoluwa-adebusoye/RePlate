const KEY = 'claims'; // { [postId]: true }

export function hasClaimed(postId) {
  const obj = JSON.parse(localStorage.getItem(KEY) || '{}');
  return !!obj[postId];
}

export function markClaimed(postId) {
  const obj = JSON.parse(localStorage.getItem(KEY) || '{}');
  obj[postId] = true;
  localStorage.setItem(KEY, JSON.stringify(obj));
}
