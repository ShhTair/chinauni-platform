import { useMemo, useState, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type VisibilityState,
  type ColumnOrderState,
} from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { ArrowUpDown, ArrowUp, ArrowDown, Lock, Settings2, GripVertical, Check, Plus, Link as LinkIcon, Trash2, X } from 'lucide-react'
import { Stars, LeagueBadge, PortalBadge } from '@/components/ui/Badge'
import { formatCNY, formatUSD, cn } from '@/lib/utils'
import type { University } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import localforage from 'localforage'

const col = createColumnHelper<University>()

interface UniTableProps {
  universities: University[]
  isAuth: boolean
  onAuthRequired: () => void
}

const VISIBLE_WITHOUT_AUTH = 10

// Custom hook for persisted state
function usePersistedState<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(defaultValue)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    localforage.getItem<T>(key).then((val) => {
      if (val !== null) setState(val)
      setLoaded(true)
    })
  }, [key])

  const setPersistedState = (valOrFn: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next = typeof valOrFn === 'function' ? (valOrFn as any)(prev) : valOrFn
      localforage.setItem(key, next)
      return next
    })
  }

  return [state, setPersistedState, loaded]
}

export function UniTable({ universities, isAuth, onAuthRequired }: UniTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  
  // Persisted Table States
  const [columnVisibility, setColumnVisibility, visLoaded] = usePersistedState<VisibilityState>('table_visibility', {})
  const [columnOrder, setColumnOrder, orderLoaded] = usePersistedState<ColumnOrderState>('table_order', [])
  
  // Custom user fields state (e.g. My Notes, Custom Majors)
  const [customFields, setCustomFields, customLoaded] = usePersistedState<Record<string, Record<string, string>>>('table_custom_fields', {})
  
  const [showSettings, setShowSettings] = useState(false)
  const [newColumnName, setNewColumnName] = useState('')
  const [customColumnsList, setCustomColumnsList, colsLoaded] = usePersistedState<string[]>('table_custom_cols_list', [])

  const baseColumns = useMemo(
    () => [
      col.accessor('name', {
        id: 'name',
        header: 'UNIVERSITY',
        cell: (info) => (
          <div className="flex items-center gap-3 min-w-[250px]">
            {info.row.original.logo_url && (
              <img src={info.row.original.logo_url} alt="" className="w-8 h-8 object-contain rounded flex-shrink-0 bg-white" />
            )}
            <div>
              <Link to={`/universities/${info.row.original.slug}`} className="font-bold text-sm text-ink hover:text-accent transition-colors">
                {info.getValue()}
              </Link>
              {info.row.original.name_cn && <p className="text-xs text-ink-muted">{info.row.original.name_cn}</p>}
            </div>
          </div>
        ),
      }),
      col.accessor('prestige_stars', {
        id: 'prestige',
        header: 'PRESTIGE',
        cell: (info) => <Stars count={info.getValue() || 1} />,
      }),
      col.accessor('league', {
        id: 'league',
        header: 'LEAGUE',
        cell: (info) => {
          const val = info.getValue()
          return val ? <LeagueBadge league={val} /> : <span className="text-ink-faint">—</span>
        },
      }),
      col.accessor('province', {
        id: 'location',
        header: 'LOCATION',
        cell: (info) => (
          <span className="text-sm font-medium whitespace-nowrap">
            {info.row.original.city}, {info.getValue()}
          </span>
        ),
      }),
      col.accessor('english_ug', {
        id: 'english_ug',
        header: 'ENGLISH UG',
        cell: (info) => {
          const v = info.getValue()
          if (v === 'yes') return <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider">Yes</span>
          if (v === 'partial') return <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">Partial</span>
          return <span className="text-rose-600 font-bold text-xs uppercase tracking-wider">No</span>
        },
      }),
      col.accessor('qs_rank', {
        id: 'qs_rank',
        header: 'QS RANK',
        cell: (info) => {
          const v = info.getValue()
          return v ? <span className="font-mono text-sm">#{v}</span> : <span className="text-ink-faint">—</span>
        },
      }),
      col.accessor('portal_status', {
        id: 'portal_status',
        header: 'PORTAL',
        cell: (info) => {
          const v = info.getValue()
          const url = info.row.original.url_portal
          return (
            <div className="flex items-center gap-2">
              {v ? <PortalBadge status={v as any} /> : <span className="text-ink-faint">—</span>}
              {url && (
                <a href={url} target="_blank" rel="noreferrer" className="text-accent hover:text-accent-dark transition-colors" title="Open Portal">
                  <LinkIcon size={14} />
                </a>
              )}
            </div>
          )
        },
      }),
      col.accessor('tuition_cny_yr', {
        id: 'tuition',
        header: 'TUITION (CNY)',
        cell: (info) => <span className="font-mono text-sm">{formatCNY(info.getValue())}</span>,
      }),
    ],
    []
  )

  // Dynamically generate custom columns
  const columns = useMemo(() => {
    const dynamicCols = customColumnsList.map(colName => 
      col.accessor((row) => customFields[row.id]?.[colName] || '', {
        id: `custom_${colName}`,
        header: colName.toUpperCase(),
        cell: (info) => {
          const val = info.getValue()
          return (
            <div className="group relative min-w-[150px]">
              <input 
                type="text" 
                value={val}
                placeholder="Add notes..."
                onChange={(e) => {
                  const newVal = e.target.value;
                  setCustomFields(prev => ({
                    ...prev,
                    [info.row.original.id]: {
                      ...(prev[info.row.original.id] || {}),
                      [colName]: newVal
                    }
                  }))
                }}
                className="w-full bg-transparent border-b border-transparent group-hover:border-border focus:border-accent outline-none text-sm px-1 py-0.5 transition-colors font-medium"
              />
            </div>
          )
        },
      })
    )
    return [...baseColumns, ...dynamicCols]
  }, [baseColumns, customColumnsList, customFields, setCustomFields])

  const table = useReactTable({
    data: universities,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnOrder,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Prevent rendering until local storage is loaded to avoid hydration mismatch
  if (!visLoaded || !orderLoaded || !colsLoaded || !customLoaded) return null;

  const hasBlurred = !isAuth && universities.length > VISIBLE_WITHOUT_AUTH
  const allRows = table.getRowModel().rows

  const addCustomColumn = () => {
    if (!newColumnName.trim()) return
    const name = newColumnName.trim()
    if (!customColumnsList.includes(name)) {
      setCustomColumnsList([...customColumnsList, name])
      setColumnVisibility(prev => ({ ...prev, [`custom_${name}`]: true }))
    }
    setNewColumnName('')
  }

  const removeCustomColumn = (name: string) => {
    setCustomColumnsList(customColumnsList.filter(c => c !== name))
    // Also cleanup visibility state
    const newVis = {...columnVisibility}
    delete newVis[`custom_${name}`]
    setColumnVisibility(newVis)
  }

  return (
    <div className="relative">
      
      {/* Table Toolbar / Settings */}
      <div className="flex justify-end mb-4 relative z-10">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 font-bold uppercase tracking-wider text-xs border-2"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings2 size={16} /> Customize Columns
        </Button>

        {showSettings && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-surface border-2 border-ink rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 p-5 overflow-hidden">
            <div className="flex justify-between items-center mb-4 border-b-2 border-border pb-2">
              <h3 className="font-display font-bold text-lg">COLUMNS</h3>
              <button onClick={() => setShowSettings(false)} className="text-ink-muted hover:text-ink"><X size={18}/></button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4 custom-scrollbar pr-2">
              {table.getAllLeafColumns().map(column => {
                const isCustom = column.id.startsWith('custom_')
                const customName = isCustom ? column.id.replace('custom_', '') : ''
                
                return (
                  <div key={column.id} className="flex items-center justify-between p-2 hover:bg-bg rounded-lg border border-transparent hover:border-border transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="w-4 h-4 rounded border-2 border-border text-accent focus:ring-accent"
                      />
                      <span className="text-sm font-bold uppercase">{typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}</span>
                    </label>
                    {isCustom && (
                      <button onClick={() => removeCustomColumn(customName)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="pt-4 border-t-2 border-border">
              <p className="text-xs font-bold text-ink-muted uppercase mb-2">Add Custom Column</p>
              <div className="flex gap-2">
                <Input 
                  value={newColumnName}
                  onChange={e => setNewColumnName(e.target.value)}
                  placeholder="e.g. My Target Majors"
                  className="h-9 text-sm border-2 font-medium"
                  onKeyDown={e => e.key === 'Enter' && addCustomColumn()}
                />
                <Button size="sm" onClick={addCustomColumn} className="h-9 px-3 border-2"><Plus size={16}/></Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-surface border border-border rounded-2xl shadow-sm custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border bg-bg/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "px-4 py-3 text-xs font-bold text-ink-muted uppercase tracking-wider whitespace-nowrap",
                      header.column.getCanSort() && "cursor-pointer select-none hover:text-ink transition-colors"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <div className="flex flex-col opacity-50">
                          {{
                            asc: <ArrowUp size={12} className="text-accent opacity-100" />,
                            desc: <ArrowDown size={12} className="text-accent opacity-100" />,
                          }[header.column.getIsSorted() as string] ?? <ArrowUpDown size={12} />}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {allRows.slice(0, isAuth ? undefined : VISIBLE_WITHOUT_AUTH).map((row) => (
              <tr key={row.id} className="hover:bg-bg/50 transition-colors group">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {/* Blurred rows */}
            {hasBlurred && allRows.slice(VISIBLE_WITHOUT_AUTH).map((row) => (
              <tr key={row.id} className="border-t border-border">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    <div className="blur-gate text-sm text-ink-muted">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Auth gate overlay */}
      {hasBlurred && (
        <div className="absolute bottom-0 left-0 right-0 h-48 flex flex-col items-center justify-end pb-6 bg-gradient-to-t from-bg via-bg/90 to-transparent rounded-b-2xl">
          <div className="text-center">
            <Lock size={24} className="text-ink-muted mx-auto mb-2" />
            <p className="text-sm font-bold text-ink mb-1">Войдите, чтобы увидеть все {allRows.length} университетов</p>
            <p className="text-xs text-ink-muted mb-4">Регистрация бесплатна и занимает 30 секунд</p>
            <Button size="sm" onClick={onAuthRequired} className="font-bold uppercase tracking-wider">
              Войти / Зарегистрироваться
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
