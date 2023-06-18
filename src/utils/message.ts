export function success(message: string): void {
  setTimeout(() => alert(`Success: ${message}`), 0);
}

export function warning(message: string): void {
  setTimeout(() => alert(`Warning: ${message}`), 0);
}