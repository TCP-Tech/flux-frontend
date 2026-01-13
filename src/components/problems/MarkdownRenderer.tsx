import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface Props {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className }: Props) {
  return (
    <article className={cn("prose prose-invert prose-neutral max-w-none text-sm", className)}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({node, ...props}) => (
            <div className="bg-black/50 p-4 rounded-lg border border-neutral-800 my-4 overflow-x-auto font-mono text-xs">
              <pre {...props} />
            </div>
          ),
          code: ({node, ...props}) => (
             <code className="bg-neutral-800 px-1 py-0.5 rounded text-amber-200/90 font-mono text-xs" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
