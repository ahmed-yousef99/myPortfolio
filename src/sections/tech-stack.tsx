import { useMemo, useState, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  MarkerType,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/hooks/useLanguage'
import { Section } from '@/components/layout/section'
import { TerminalNode } from '@/components/flowchart/terminal-node'
import { ProcessNode } from '@/components/flowchart/process-node'
import { DecisionNode } from '@/components/flowchart/decision-node'
import { FlowEdge } from '@/components/flowchart/flow-edge'

/* ─── Register custom types OUTSIDE component (prevents re-renders) ─── */

const nodeTypes = {
  terminal: TerminalNode,
  process: ProcessNode,
  decision: DecisionNode,
}

const edgeTypes = {
  flow: FlowEdge,
}

/* ─── Path map: which nodes/edges light up for each hovered node ─── */

const pathMap: Record<string, { nodes: string[]; edges: string[] }> = {
  start: {
    nodes: ['start', 'client'],
    edges: ['e-start-ux'],
  },
  client: {
    nodes: ['start', 'client', 'decision1'],
    edges: ['e-start-ux', 'e-ux-d1'],
  },
  decision1: {
    nodes: ['start', 'client', 'decision1', 'auth', 'application'],
    edges: ['e-start-ux', 'e-ux-d1', 'e-d1-auth', 'e-d1-app'],
  },
  auth: {
    nodes: ['start', 'client', 'decision1', 'auth', 'application'],
    edges: ['e-start-ux', 'e-ux-d1', 'e-d1-auth', 'e-auth-app'],
  },
  application: {
    nodes: ['start', 'client', 'decision1', 'application', 'decision2'],
    edges: ['e-start-ux', 'e-ux-d1', 'e-d1-app', 'e-app-d2'],
  },
  decision2: {
    nodes: ['start', 'client', 'decision1', 'application', 'decision2', 'data', 'integrations'],
    edges: ['e-start-ux', 'e-ux-d1', 'e-d1-app', 'e-app-d2', 'e-d2-data', 'e-d2-ext'],
  },
  data: {
    nodes: ['start', 'client', 'decision1', 'application', 'decision2', 'data', 'infrastructure', 'end'],
    edges: ['e-start-ux', 'e-ux-d1', 'e-d1-app', 'e-app-d2', 'e-d2-data', 'e-data-infra', 'e-infra-end'],
  },
  integrations: {
    nodes: ['start', 'client', 'decision1', 'application', 'decision2', 'integrations', 'infrastructure', 'end'],
    edges: ['e-start-ux', 'e-ux-d1', 'e-d1-app', 'e-app-d2', 'e-d2-ext', 'e-ext-infra', 'e-infra-end'],
  },
  infrastructure: {
    nodes: ['data', 'integrations', 'infrastructure', 'end'],
    edges: ['e-data-infra', 'e-ext-infra', 'e-infra-end'],
  },
  end: {
    nodes: ['infrastructure', 'end'],
    edges: ['e-infra-end'],
  },
}

/* ─── Layout constants ─── */

const CANVAS_W = 1000

/* ─── Helper for generating random paths for edge animation ─── */
const getNewRandomPath = (): string[] => {
  const path: string[] = ['e-start-ux', 'e-ux-d1']

  // First decision: YES/NO auth
  const hasAuth = Math.random() > 0.5
  if (hasAuth) {
    path.push('e-d1-auth', 'e-auth-app')
  } else {
    path.push('e-d1-app')
  }

  path.push('e-app-d2')

  // Second decision: YES/NO data
  const hasData = Math.random() > 0.5
  if (hasData) {
    path.push('e-d2-data', 'e-data-infra')
  } else {
    path.push('e-d2-ext', 'e-ext-infra')
  }

  path.push('e-infra-end')

  return path
}

interface TechStackProps {
  className?: string
}

function TechStack({ className }: TechStackProps) {
  const { t, tArr, lang } = useLanguage()
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [currentAnimatedEdgeId, setCurrentAnimatedEdgeId] = useState<string | null>(null)
  const isRtl = lang === 'ar'

  // Sequential traveling light path effect
  useEffect(() => {
    // Disable if reduced motion is preferred
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReducedMotion) {
      return
    }

    let activePath: string[] = []
    let activeIndex = -1
    let timerId: NodeJS.Timeout | null = null

    const animateNextStep = () => {
      activeIndex++
      if (activeIndex < activePath.length) {
        const nextEdgeId = activePath[activeIndex]
        setCurrentAnimatedEdgeId(nextEdgeId)
        if (typeof window !== 'undefined') {
          ;(window as any).cometStartTime = performance.now()
        }
        timerId = setTimeout(animateNextStep, 800) // 800ms per edge
      } else {
        setCurrentAnimatedEdgeId(null)
        if (typeof window !== 'undefined') {
          ;(window as any).cometStartTime = 0
        }
        // Wait 1200ms before starting next cycle
        timerId = setTimeout(() => {
          activePath = getNewRandomPath()
          activeIndex = -1
          animateNextStep()
        }, 1200)
      }
    }

    // Initial delay before first sequence starts
    timerId = setTimeout(() => {
      activePath = getNewRandomPath()
      animateNextStep()
    }, 1000)

    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [])

  const isAnyHovered = hoveredNodeId !== null
  const activeNodes = isAnyHovered ? (pathMap[hoveredNodeId!]?.nodes ?? []) : []
  const activeEdges = isAnyHovered ? (pathMap[hoveredNodeId!]?.edges ?? []) : []

  const mx = useCallback(
    (x: number, w: number) => (isRtl ? CANVAS_W - x - w : x),
    [isRtl],
  )

  const yesPos: 'left' | 'right' = isRtl ? 'right' : 'left'
  const d2NoPos: 'left' | 'right' = isRtl ? 'left' : 'right'

  /* ─── Nodes ─── */

  const nodes = useMemo((): Node[] => {
    const na = (id: string) => !isAnyHovered || activeNodes.includes(id)
    const nd = (id: string) => isAnyHovered && !activeNodes.includes(id)

    return [
      {
        id: 'start',
        type: 'terminal',
        position: { x: mx(400, 200), y: 0 },
        style: { width: 200 },
        data: { label: t('techStack.startNode'), variant: 'start', isActive: na('start'), isDimmed: nd('start') },
      },
      {
        id: 'client',
        type: 'process',
        position: { x: mx(340, 320), y: 110 },
        style: { width: 320 },
        data: { label: t('techStack.layers.client.label'), items: tArr('techStack.layers.client.items'), isActive: na('client'), isDimmed: nd('client') },
      },
      {
        id: 'decision1',
        type: 'decision',
        position: { x: mx(420, 160), y: 260 },
        style: { width: 160, height: 160 },
        data: { label: t('techStack.decisions.auth'), isActive: na('decision1'), isDimmed: nd('decision1'), yesPosition: yesPos, noPosition: 'bottom' },
      },
      {
        id: 'auth',
        type: 'process',
        position: { x: mx(40, 280), y: 470 },
        style: { width: 280 },
        data: { label: t('techStack.layers.auth.label'), items: tArr('techStack.layers.auth.items'), isActive: na('auth'), isDimmed: nd('auth') },
      },
      {
        id: 'application',
        type: 'process',
        position: { x: mx(340, 320), y: 590 },
        style: { width: 320 },
        data: { label: t('techStack.layers.application.label'), items: tArr('techStack.layers.application.items'), isActive: na('application'), isDimmed: nd('application') },
      },
      {
        id: 'decision2',
        type: 'decision',
        position: { x: mx(420, 160), y: 720 },
        style: { width: 160, height: 160 },
        data: { label: t('techStack.decisions.data'), isActive: na('decision2'), isDimmed: nd('decision2'), yesPosition: yesPos, noPosition: d2NoPos },
      },
      {
        id: 'data',
        type: 'process',
        position: { x: mx(40, 280), y: 930 },
        style: { width: 280 },
        data: { label: t('techStack.layers.data.label'), items: tArr('techStack.layers.data.items'), isActive: na('data'), isDimmed: nd('data') },
      },
      {
        id: 'integrations',
        type: 'process',
        position: { x: mx(680, 280), y: 930 },
        style: { width: 280 },
        data: { label: t('techStack.layers.integrations.label'), items: tArr('techStack.layers.integrations.items'), isActive: na('integrations'), isDimmed: nd('integrations') },
      },
      {
        id: 'infrastructure',
        type: 'process',
        position: { x: mx(160, 680), y: 1100 },
        style: { width: 680 },
        data: { label: t('techStack.layers.infrastructure.label'), items: tArr('techStack.layers.infrastructure.items'), isActive: na('infrastructure'), isDimmed: nd('infrastructure') },
      },
      {
        id: 'end',
        type: 'terminal',
        position: { x: mx(400, 200), y: 1250 },
        style: { width: 200 },
        data: { label: t('techStack.endNode'), variant: 'end', isActive: na('end'), isDimmed: nd('end') },
      },
    ]
  }, [t, tArr, mx, yesPos, d2NoPos, isAnyHovered, activeNodes])

  /* ─── Edges ─── */

  const edges = useMemo((): Edge[] => {
    const ea = (id: string) => activeEdges.includes(id)
    const ed = (id: string) => isAnyHovered && !activeEdges.includes(id)
    const mc = (id: string) => (ea(id) ? '#5e6ad2' : '#34343a')

    const marker = (id: string) => ({
      type: MarkerType.ArrowClosed as const,
      color: mc(id),
      width: 16,
      height: 16,
    })

    const staticEdges: Edge[] = [
      {
        id: 'e-start-ux',
        source: 'start',
        target: 'client',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'flow',
        data: { isActive: ea('e-start-ux'), isDimmed: ed('e-start-ux') },
        markerEnd: marker('e-start-ux'),
      },
      {
        id: 'e-ux-d1',
        source: 'client',
        target: 'decision1',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'flow',
        data: { isActive: ea('e-ux-d1'), isDimmed: ed('e-ux-d1') },
        markerEnd: marker('e-ux-d1'),
      },
      {
        id: 'e-d1-auth',
        source: 'decision1',
        target: 'auth',
        sourceHandle: 'yes',
        targetHandle: 'top',
        type: 'flow',
        data: { isActive: ea('e-d1-auth'), isDimmed: ed('e-d1-auth'), label: t('techStack.branches.yes') },
        markerEnd: marker('e-d1-auth'),
      },
      {
        id: 'e-d1-app',
        source: 'decision1',
        target: 'application',
        sourceHandle: 'no',
        targetHandle: 'top',
        type: 'flow',
        data: { isActive: ea('e-d1-app'), isDimmed: ed('e-d1-app'), label: t('techStack.branches.no') },
        markerEnd: marker('e-d1-app'),
      },
      {
        id: 'e-auth-app',
        source: 'auth',
        target: 'application',
        sourceHandle: 'bottom',
        targetHandle: isRtl ? 'right' : 'left',
        type: 'flow',
        data: { isActive: ea('e-auth-app'), isDimmed: ed('e-auth-app') },
        markerEnd: marker('e-auth-app'),
      },
      {
        id: 'e-app-d2',
        source: 'application',
        target: 'decision2',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'flow',
        data: { isActive: ea('e-app-d2'), isDimmed: ed('e-app-d2') },
        markerEnd: marker('e-app-d2'),
      },
      {
        id: 'e-d2-data',
        source: 'decision2',
        target: 'data',
        sourceHandle: 'yes',
        targetHandle: 'top',
        type: 'flow',
        data: { isActive: ea('e-d2-data'), isDimmed: ed('e-d2-data'), label: t('techStack.branches.yes') },
        markerEnd: marker('e-d2-data'),
      },
      {
        id: 'e-d2-ext',
        source: 'decision2',
        target: 'integrations',
        sourceHandle: 'no',
        targetHandle: 'top',
        type: 'flow',
        data: { isActive: ea('e-d2-ext'), isDimmed: ed('e-d2-ext'), label: t('techStack.branches.no') },
        markerEnd: marker('e-d2-ext'),
      },
      {
        id: 'e-data-infra',
        source: 'data',
        target: 'infrastructure',
        sourceHandle: 'bottom',
        targetHandle: isRtl ? 'top-right' : 'top-left',
        type: 'flow',
        data: { isActive: ea('e-data-infra'), isDimmed: ed('e-data-infra') },
        markerEnd: marker('e-data-infra'),
      },
      {
        id: 'e-ext-infra',
        source: 'integrations',
        target: 'infrastructure',
        sourceHandle: 'bottom',
        targetHandle: isRtl ? 'top-left' : 'top-right',
        type: 'flow',
        data: { isActive: ea('e-ext-infra'), isDimmed: ed('e-ext-infra') },
        markerEnd: marker('e-ext-infra'),
      },
      {
        id: 'e-infra-end',
        source: 'infrastructure',
        target: 'end',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'flow',
        data: { isActive: ea('e-infra-end'), isDimmed: ed('e-infra-end') },
        markerEnd: marker('e-infra-end'),
      },
    ]

    const straightEdgeIds = ['e-start-ux', 'e-ux-d1', 'e-d1-app', 'e-app-d2', 'e-infra-end']

    return staticEdges.map(edge => ({
      ...edge,
      data: {
        ...edge.data,
        isTraveling: currentAnimatedEdgeId === edge.id,
        isStraight: straightEdgeIds.includes(edge.id),
      },
    }))
  }, [t, activeEdges, isAnyHovered, isRtl, currentAnimatedEdgeId])

  /* ─── Hover handlers ─── */

  const handleNodeMouseEnter: NodeMouseHandler = useCallback((_event, node) => {
    setHoveredNodeId(node.id)
  }, [])

  const handleNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setHoveredNodeId(null)
  }, [])

  /* ─── Mobile simplified flow ─── */

  const renderMobileNode = (layerKey: string) => {
    const label = t(`techStack.layers.${layerKey}.label`)
    const items = tArr(`techStack.layers.${layerKey}.items`)
    return (
      <div className="flex flex-col items-center text-center px-3 py-2.5 border border-hairline/25 rounded-lg bg-surface-1/10 w-full max-w-[220px]">
        <span className="text-[12px] font-medium text-ink-muted">{label}</span>
        <span className="text-[9px] font-mono text-ink-tertiary mt-0.5">{items.join(' · ')}</span>
      </div>
    )
  }

  const renderMobilePill = (textKey: string) => (
    <div className="border border-accent/40 bg-[#010102] rounded-full px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
      {t(textKey)}
    </div>
  )

  const renderMobileConnector = () => (
    <div className="w-px h-5 bg-hairline-strong" />
  )

  const renderMobileDecision = (key: string) => (
    <div className="text-[10px] font-mono text-ink-subtle text-center px-3 py-1.5 border border-hairline/25 rounded bg-surface-1/10">
      {t(`techStack.decisions.${key}`)}
    </div>
  )

  return (
    <Section
      id="tech-stack"
      eyebrow={t('techStack.eyebrow')}
      title={t('techStack.title')}
      subtitle={t('techStack.subtitle')}
      className={className}
    >
      {/* ── Desktop: React Flow flowchart ── */}
      <div className="hidden lg:block w-full h-[1050px] xl:h-[1150px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          colorMode="dark"
          fitView
          fitViewOptions={{ padding: 0.05 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
          onNodeMouseEnter={handleNodeMouseEnter}
          onNodeMouseLeave={handleNodeMouseLeave}
        />
      </div>

      {/* ── Mobile: simplified vertical flow ── */}
      <div className={cn('lg:hidden flex flex-col items-center gap-0 w-full', isRtl && 'direction-rtl')}>
        {renderMobilePill('techStack.startNode')}
        {renderMobileConnector()}

        {renderMobileNode('client')}
        {renderMobileConnector()}

        {renderMobileDecision('auth')}
        <div className="w-px h-3 bg-hairline-strong" />

        <div className="w-full grid grid-cols-2 gap-3 px-2">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[9px] font-mono text-ink-tertiary uppercase">{t('techStack.branches.yes')}</span>
            {renderMobileNode('auth')}
          </div>
          <div className="flex flex-col items-center gap-1.5 justify-center">
            <span className="text-[9px] font-mono text-ink-tertiary uppercase">{t('techStack.branches.no')}</span>
            <span className="text-[9px] font-mono text-ink-tertiary italic">→</span>
          </div>
        </div>

        <div className="w-px h-3 bg-hairline-strong" />
        {renderMobileNode('application')}
        {renderMobileConnector()}

        {renderMobileDecision('data')}
        <div className="w-px h-3 bg-hairline-strong" />

        <div className="w-full grid grid-cols-2 gap-3 px-2">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[9px] font-mono text-ink-tertiary uppercase">{t('techStack.branches.yes')}</span>
            {renderMobileNode('data')}
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[9px] font-mono text-ink-tertiary uppercase">{t('techStack.branches.no')}</span>
            {renderMobileNode('integrations')}
          </div>
        </div>

        <div className="w-px h-3 bg-hairline-strong" />
        {renderMobileNode('infrastructure')}
        {renderMobileConnector()}

        {renderMobilePill('techStack.endNode')}
      </div>
    </Section>
  )
}

export { TechStack, type TechStackProps }

