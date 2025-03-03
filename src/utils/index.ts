/**
 * 指定した時間（または現在の時間）から、時間ブロックの高さを基にオフセット時間を計算します。
 *
 * @param hourBlockHeight - 各時間ブロックの高さ（例えば、1時間あたりのピクセル数など）
 * @param hour - 計算に使用する時間（オプション、指定しない場合は現在の時間を使用）
 * @param minutes - 計算に使用する分（オプション、指定しない場合は現在の分を使用）
 * @returns 計算されたオフセット時間（時間ブロックの高さに基づく）
 */
export function calcTimeOffset(hourBlockHeight: number, hour?: number, minutes?: number) {
    // 現在の日時を取得
    const now = new Date();

    // 時間が指定されていない場合は現在の時間を使用、指定されている場合はそのまま使用
    const h = hour ?? now.getHours();

    // 分が指定されていない場合は現在の分を使用、指定されている場合はそのまま使用
    const m = minutes ?? now.getMinutes();

    // 時間（時間 + 分を時間単位に変換）に基づいてオフセット時間を計算
    return (h + m / 60) * hourBlockHeight;
}
