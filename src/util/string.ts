/**
 * Create ItemKey
 * @param type
 * @param index
 * @param extra
 */
export function createItemKey(type: string, index: number, extra?: string, prefix?: string): string {
  return `${prefix || ""}${type}-${extra || ""}${index}`;
}
