let counter = 0;

export function v4(): string {
  counter++;
  return `test-uuid-${counter}`;
}

export function reset(): void {
  counter = 0;
}
