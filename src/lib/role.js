export function getRole() {
  return localStorage.getItem("role") || "member";
}
export function setRole(r) {
  localStorage.setItem("role", r);
}
