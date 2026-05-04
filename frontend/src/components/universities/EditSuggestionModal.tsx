
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { adminApi } from '@/lib/api' // We can use a public endpoint or admin api

export function EditSuggestionModal({ open, onClose, uniId, fieldName, currentVal }: { open: boolean, onClose: () => void, uniId: string, fieldName: string, currentVal?: string }) {
  const [val, setVal] = useState(currentVal || '')
  const [submitting, setSubmitting] = useState(false)
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Assuming we have an endpoint /api/submissions/university/{id}
      await fetch(`/api/submissions/university/${uniId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ field_name: fieldName, old_value: currentVal, new_value: val })
      })
      alert("Thanks for your contribution! A moderator will review it shortly.")
      onClose()
    } catch(err) {
      alert("Failed to submit edit.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Suggest Edit for ${fieldName.replace('_', ' ')}`}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-ink-muted uppercase mb-1">Current Value</label>
          <div className="p-3 bg-bg border border-border rounded-lg text-sm text-ink-muted">
            {currentVal || 'Empty'}
          </div>
        </div>
        <Textarea 
          label="Proposed Value"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="Enter the correct information..."
          required
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting || !val.trim()}>{submitting ? 'Submitting...' : 'Submit Edit'}</Button>
        </div>
      </form>
    </Modal>
  )
}
