export type Language = 'en' | 'ar'

export function t(path: string, translations: Record<string, unknown>): string {
  const keys = path.split('.')
  let result: unknown = translations
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return typeof result === 'string' ? result : path
}

export function tArr(path: string, translations: Record<string, unknown>): string[] {
  const keys = path.split('.')
  let result: unknown = translations
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return []
    }
  }
  return Array.isArray(result) ? result.map(String) : []
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
