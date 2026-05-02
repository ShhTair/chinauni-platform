import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpDown, ArrowUp, ArrowDown, Lock } from 'lucide-react'
import { Stars, LeagueBadge, PortalBadge } from '@/components/ui/Badge'
import { formatCNY, formatUSD, cn } from '@/lib/utils'
import type { University } from '@/types'
import { Button } from '@/components/ui/Button'

const col = createColumnHelper<University>()

interface UniTableProps {
  universities: University[]
  isAuth: boolean
  onAuthRequired: () => void
}

const VISIBLE_WITHOUT_AUTH = 10

export function UniTable({ universities, isAuth, onAuthRequired }: UniTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => [
      col.accessor('name', {
        header: 'Университет',
        cell: (info) => (
          <div className="flex items-center gap-3 min-w-[200px]">
            {info.row.original.logo_url && (
              <img src={info.row.original.logo_url} alt="" className="w-7 h-7 object-contain rounded flex-shrink-0" />
            )}
            <div>
              <Link
                to={`/universities/${info.row.original.slug}`}
                className="font-medium text-ink hover:text-accent transition-colors"
              >
                {info.getValue()}
              </Link>
              {info.row.original.name_cn && (
                <div className="text-xs text-ink-muted">{info.row.original.name_cn}</div>
              )}
            </div>
          </div>
        ),
      }),
      col.accessor('prestige_stars', {
        header: '★',
        cell: (info) => <Stars count={info.getValue()} />,
        size: 100,
      }),
      col.accessor('province', {
        header: 'Провинция',
        cell: (info) => <span className="text-sm text-ink-muted">{info.getValue() || '—'}</span>,
      }),
      col.accessor('league', {
        header: 'Лига',
        cell: (info) => <LeagueBadge league={info.getValue()} />,
        size: 80,
      }),
      col.accessor('english_ug', {
        header: 'English',
        cell: (info) => (
          <span className={cn('text-sm font-medium', info.getValue() === 'yes' ? 'text-green-600' : 'text-ink-muted')}>
            {info.getValue() === 'yes' ? '✓' : info.getValue() === 'partial' ? '~' : '✗'}
          </span>
        ),
        size: 70,
      }),
      col.accessor('qs_rank', {
        header: 'QS',
        cell: (info) => (
          <span className="font-mono-data text-sm">{info.getValue() ? `#${info.getValue()}` : '—'}</span>
        ),
        size: 80,
      }),
      col.accessor('ielts_min', {
        header: 'IELTS',
        cell: (info) => (
          <span className="font-mono-data text-sm">{info.getValue() || '—'}</span>
        ),
        size: 80,
      }),
      col.accessor('app_fee_usd', {
        header: 'Взнос',
        cell: (info) => (
          <span className={cn('font-mono-data text-sm', info.getValue() === 0 && 'text-green-600')}>
            {formatUSD(info.getValue())}
          </span>
        ),
        size: 80,
      }),
      col.accessor('tuition_cny_yr', {
        header: 'Стоимость',
        cell: (info) => (
          <span className="font-mono-data text-sm text-ink-muted">{formatCNY(info.getValue())}</span>
        ),
      }),
      col.accessor('portal_status', {
        header: 'Портал',
        cell: (info) => <PortalBadge status={info.getValue()} />,
        size: 80,
      }),
    ],
    []
  )

  const table = useReactTable({
    data: universities,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const allRows = table.getRowModel().rows
  const visibleRows = isAuth ? allRows : allRows.slice(0, VISIBLE_WITHOUT_AUTH)
  const hasBlurred = !isAuth && allRows.length > VISIBLE_WITHOUT_AUTH

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full uni-table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider cursor-pointer select-none hover:text-ink transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        header.column.getIsSorted() === 'asc' ? <ArrowUp size={12} className="text-accent" />
                        : header.column.getIsSorted() === 'desc' ? <ArrowDown size={12} className="text-accent" />
                        : <ArrowUpDown size={12} className="opacity-30" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-border hover:bg-bg/50 transition-colors cursor-pointer"
              >
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
            <p className="text-sm font-medium text-ink mb-1">Войдите, чтобы увидеть все {allRows.length} университетов</p>
            <p className="text-xs text-ink-muted mb-3">Регистрация бесплатна и занимает 30 секунд</p>
            <Button size="sm" onClick={onAuthRequired}>
              Войти / Зарегистрироваться
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
