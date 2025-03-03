export function calcTimeOffset(hourBlockHeight: number, hour?: number, minutes?: number) {
    const now = new Date();
    const h = hour ?? now.getHours();
    const m = minutes ?? now.getMinutes();
    return (h + m / 60) * hourBlockHeight;
}