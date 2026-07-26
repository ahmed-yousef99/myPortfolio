import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'

type DecisionNodeData = {
  label: string
  isActive: boolean
  isDimmed: boolean
  yesPosition: 'left' | 'right'
  noPosition: 'right' | 'left' | 'bottom'
}

type DecisionNodeType = Node<DecisionNodeData, 'decision'>

function DecisionNode({ data }: NodeProps<DecisionNodeType>) {
  const { label, isActive, isDimmed, yesPosition, noPosition } = data

  const yesHandlePos = yesPosition === 'left' ? Position.Left : Position.Right
  const noHandlePos =
    noPosition === 'bottom'
      ? Position.Bottom
      : noPosition === 'left'
        ? Position.Left
        : Position.Right

  return (
    <div
      className="relative w-[160px] h-[160px] flex items-center justify-center select-none"
      style={{ opacity: isDimmed ? 0.65 : 1 }}
    >
      {/* Diamond shape — rotated square inside bounding box */}
      <div
        className={cn(
          'absolute rotate-45 transition-all duration-300',
          isActive
            ? 'border border-accent/30 bg-surface-2/25'
            : isDimmed
              ? 'border border-hairline/15 bg-transparent'
              : 'border border-hairline/25 bg-surface-1/10'
        )}
        style={{
          width: '70.7%',
          height: '70.7%',
          top: '14.65%',
          left: '14.65%',
        }}
      />

      {/* Question text — not clipped */}
      <div
        className={cn(
          'relative z-10 text-center px-4 text-[12px] font-mono font-medium leading-normal transition-colors duration-300 max-w-[125px]',
          isActive ? 'text-ink' : 'text-ink-muted'
        )}
      >
        {label}
      </div>

      {/* Handles at diamond vertices */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!bg-transparent !border-none !w-0 !h-0 !min-w-0 !min-h-0"
      />
      <Handle
        type="source"
        position={yesHandlePos}
        id="yes"
        className="!bg-transparent !border-none !w-0 !h-0 !min-w-0 !min-h-0"
      />
      <Handle
        type="source"
        position={noHandlePos}
        id="no"
        className="!bg-transparent !border-none !w-0 !h-0 !min-w-0 !min-h-0"
      />
    </div>
  )
}

export { DecisionNode }
export type { DecisionNodeData, DecisionNodeType }
