export function success(message: string): void {
  setTimeout(() => alert(`Success: ${message}`), 10);
}

export function warning(message: string): void {
  setTimeout(() => alert(`Warning: ${message}`), 10);
}