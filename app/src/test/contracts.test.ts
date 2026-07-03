import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

const APP_ROOT = path.resolve(__dirname, '..', '..')

/** navigation tool 页面 ID → AgentContext currentPage 的 canonical 映射 */
const NAVIGATION_TO_CONTEXT_PAGE: Record<string, string> = {
  home: 'dashboard',
  persons: 'persons',
  profile: 'profile',
  settings: 'settings',
  storage: 'cloud-storage',
}

function extractStringUnion(source: string, pattern: RegExp): string[] {
  const match = source.match(pattern)
  if (!match) {
    throw new Error(`Unable to parse union with pattern ${pattern}`)
  }
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
}

function extractCurrentPagesFromAgentTypes(): string[] {
  const content = fs.readFileSync(path.join(APP_ROOT, 'src/types/agent.ts'), 'utf-8')
  return extractStringUnion(content, /currentPage:\s*((?:'[^']+'\s*\|\s*)+'[^']+')/)
}

function extractCurrentPagesFromEdgeTypes(): string[] {
  const content = fs.readFileSync(
    path.join(APP_ROOT, 'supabase/functions/ai-assistant/types.ts'),
    'utf-8'
  )
  return extractStringUnion(content, /currentPage\?:\s*((?:'[^']+'\s*\|\s*)+'[^']+')/)
}

function extractNavigationPages(): string[] {
  const content = fs.readFileSync(
    path.join(APP_ROOT, 'src/lib/agent/tools/navigation/index.ts'),
    'utf-8'
  )
  const enumMatch = content.match(/\.enum\(\[(.*?)\]\)/s)
  if (!enumMatch) {
    throw new Error('Unable to parse navigation tool page enum')
  }
  return [...enumMatch[1].matchAll(/'([^']+)'/g)].map((match) => match[1])
}

describe('Agent 契约对齐', () => {
  it('navigation tool 页面可通过 canonical 映射对齐 currentPage 类型', () => {
    const currentPages = extractCurrentPagesFromAgentTypes()
    const navigationPages = extractNavigationPages()
    const mappedPages = navigationPages.map((page) => NAVIGATION_TO_CONTEXT_PAGE[page])

    expect(mappedPages.every((page) => page !== undefined)).toBe(true)
    expect(new Set(mappedPages)).toEqual(new Set(currentPages.filter((page) => page !== 'other')))
  })

  it('Edge Function AgentContext currentPage 与前端类型保持一致', () => {
    expect(new Set(extractCurrentPagesFromEdgeTypes())).toEqual(
      new Set(extractCurrentPagesFromAgentTypes())
    )
  })
})
