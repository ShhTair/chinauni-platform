// Content protection — anti-copy, anti-parse
export function initContentProtection() {
  // Disable right-click
  document.addEventListener('contextmenu', (e) => e.preventDefault())

  // Disable text selection
  document.addEventListener('selectstart', (e) => {
    if ((e.target as HTMLElement)?.closest('.allow-select')) return
    e.preventDefault()
  })

  // Disable copy/cut/print/view-source keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && ['c', 'a', 'u', 's', 'p'].includes(e.key.toLowerCase())) {
      if (!(e.target as HTMLElement)?.closest('input, textarea, .allow-select')) {
        e.preventDefault()
      }
    }
    if (e.key === 'F12') e.preventDefault()
    if (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
      e.preventDefault()
    }
  })

  // Disable drag
  document.addEventListener('dragstart', (e) => e.preventDefault())
}

// Format CNY amount
export function formatCNY(amount?: number): string {
  if (!amount) return '—'
  return `¥${amount.toLocaleString()}/yr`
}

// Format USD amount
export function formatUSD(amount?: number): string {
  if (amount === undefined || amount === null) return '—'
  if (amount === 0) return 'Free'
  return `$${amount}`
}
