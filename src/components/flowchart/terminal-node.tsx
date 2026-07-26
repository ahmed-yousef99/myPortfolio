import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'

type TerminalNodeData = {
  label: string
  variant: 'start' | 'end'
  isActive: boolean
  isDimmed: boolean
}

type TerminalNodeType = Node<TerminalNodeData, 'terminal'>

function TerminalNode({ data }: NodeProps<TerminalNodeType>) {
  const { label, variant, isActive, isDimmed } = data

  return (
    <div
      className={cn(
        'flex items-center justify-center px-8 py-3 rounded-full border font-mono text-[13px] uppercase tracking-widest select-none whitespace-nowrap',
        'transition-all duration-300',
        isActive
          ? 'border-accent/70 text-ink bg-[#010102]'
          : isDimmed
            ? 'border-hairline/40 text-ink-subtle bg-[#010102]'
            : 'border-accent/40 text-ink-muted bg-[#010102]'
      )}
      style={{ opacity: isDimmed ? 0.65 : 1 }}
    >
      <span>{label}</span>

      {variant === 'start' && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="!bg-transparent !border-none !w-0 !h-0 !min-w-0 !min-h-0"
        />
      )}
      {variant === 'end' && (
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="!bg-transparent !border-none !w-0 !h-0 !min-w-0 !min-h-0"
        />
      )}
    </div>
  )
}

export { TerminalNode }
export type { TerminalNodeData, TerminalNodeType }
