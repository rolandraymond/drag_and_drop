// simple helper to generate unique IDs for editor elements
export function uid(): string {
    return Math.random().toString(36).substring(2, 9);
}
