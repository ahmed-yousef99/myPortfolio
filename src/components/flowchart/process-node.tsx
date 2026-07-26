import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'

type ProcessNodeData = {
  label: string
  items: string[]
  isActive: boolean
  isDimmed: boolean
}

type ProcessNodeType = Node<ProcessNodeData, 'process'>

function ProcessNode({ data }: NodeProps<ProcessNodeType>) {
  const { label, items, isActive, isDimmed } = data

  return (
    <div
      className={cn(
        'px-6 py-5 rounded-lg select-none transition-all duration-300 text-center',
        isActive
          ? 'border border-accent/30 bg-surface-1/40'
          : isDimmed
            ? 'border border-hairline/15 bg-transparent'
            : 'border border-hairline/30 bg-surface-1/15'
      )}
      style={{ opacity: isDimmed ? 0.65 : 1 }}
    >
      <div
        className={cn(
          'text-[16px] font-medium leading-tight transition-colors duration-300',
          isActive ? 'text-ink' : 'text-ink-muted'
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          'text-[12px] font-mono leading-relaxed mt-1.5 transition-colors duration-300',
          isActive ? 'text-ink-subtle' : 'text-ink-tertiary'
        )}
      >
        {items.join(' · ')}
      </div>

      {/* All possible handles — invisible, positioned for edge routing */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!bg-transparent !border-none !w-0 !h-0 !min-w-0 !min-h-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-transparent !border-none !w-0 !h-0 !min-w-0 !min-h-0"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!bg-transparent !border-none !w-0 !h-0 !min-w-0 !min-h-0"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="!bg-transparent !border-none !w-0 !h-0 !min-w-0 !min-h-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-left"
        style={{ left: '30%' }}
        className="!bg-transparent !border-none !w-0 !h-0 !min-w-0 !min-h-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-right"
        style={{ left: '70%' }}
        className="!bg-transparent !border-none !w-0 !h-0 !min-w-0 !min-h-0"
      />
    </div>
  )
}

export { ProcessNode }
export type { ProcessNodeData, ProcessNodeType }
