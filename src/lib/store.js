const K = {
  ORG: 'org-name',
  GROUPS: 'org-groups',        // string[]
  USER_GROUPS: 'user-groups'   // string[]
};

export function getOrgName(){ return localStorage.getItem(K.ORG) || 'Your Organization'; }
export function setOrgName(name){ localStorage.setItem(K.ORG, name || 'Your Organization'); }

export function getGroups(){
  try { return JSON.parse(localStorage.getItem(K.GROUPS) || '[]'); }
  catch { return []; }
}
export function addGroup(name){
  const groups = getGroups();
  if (!name || groups.includes(name)) return groups;
  const next = [...groups, name];
  localStorage.setItem(K.GROUPS, JSON.stringify(next));
  return next;
}
export function removeGroup(name){
  const next = getGroups().filter(g => g !== name);
  localStorage.setItem(K.GROUPS, JSON.stringify(next));
  return next;
}

export function getUserGroups(){
  try { return JSON.parse(localStorage.getItem(K.USER_GROUPS) || '[]'); }
  catch { return []; }
}
export function setUserGroups(arr){
  localStorage.setItem(K.USER_GROUPS, JSON.stringify(arr || []));
}
