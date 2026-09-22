"use client"

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode } from "@lexical/rich-text"
import { $getSelection, $setSelection } from "lexical"
import { useEffect, useState } from "react"
import Theme from "./plugins/Theme"
import ToolbarPlugin from "./plugins/ToolbarPlugin"
import {
  FloatingComposer,
  FloatingThreads,
  liveblocksConfig,
  LiveblocksPlugin,
  useIsEditorReady,
} from "@liveblocks/react-lexical"
import Loader from "../Loader"
import FloatingToolbarPlugin from "./plugins/FloatingToolbarPlugin"
import { useThreads } from "@liveblocks/react/suspense"
import Comments from "../Comments"
import { DeleteModal } from "../DeleteModal"

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>
}

const FloatingThreadsBehavior = ({
  onInteracted,
}: {
  onInteracted: () => void
}) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isInsideEditor = !!target.closest(".editor-container")
      const isInsideLiveblocksUI = !!target.closest(
        ".lb-root, .lb-portal, .floating-toolbar"
      )

      if (isInsideEditor) {
        onInteracted()
        return
      }

      if (!isInsideLiveblocksUI) {
        editor.update(() => {
          if ($getSelection() !== null) {
            $setSelection(null)
          }
        })
      }
    }

    document.addEventListener("mousedown", handleMouseDown, true)

    return () => {
      document.removeEventListener("mousedown", handleMouseDown, true)
    }
  }, [editor, onInteracted])

  return null
}

export function Editor({
  roomId,
  currentUserType,
}: {
  roomId: string
  currentUserType: UserType
}) {
  const isEditorReady = useIsEditorReady()
  const { threads } = useThreads()
  const [hasInteracted, setHasInteracted] = useState(false)

  const initialConfig = liveblocksConfig({
    namespace: "Editor",
    nodes: [HeadingNode],
    onError: (error: Error) => {
      console.error(error)
      throw error
    },
    theme: Theme,
    editable: currentUserType === "editor",
  })

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <FloatingThreadsBehavior onInteracted={() => setHasInteracted(true)} />
      <div className="editor-container size-full">
        <div className="toolbar-wrapper flex min-w-full items-center justify-between">
          <ToolbarPlugin />
          {currentUserType === "editor" && <DeleteModal roomId={roomId} />}
        </div>

        <div className="flex custom-scrollbar h-[calc(100vh-140px)] flex-col items-center justify-start gap-5 overflow-auto px-5 pt-5 lg:flex-row lg:items-start lg:justify-center xl:gap-10 xl:pt-10">
          {!isEditorReady ? (
            <Loader />
          ) : (
            <div className="editor-inner relative mb-5 h-fit min-h-[1100px] w-full max-w-[800px] shadow-md lg:mb-10">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input h-full" />
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              {currentUserType === "editor" && <FloatingToolbarPlugin />}
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          )}

          <LiveblocksPlugin>
            <FloatingComposer className="w-[350px]" />
            {hasInteracted && <FloatingThreads threads={threads} />}
            <Comments />
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  )
}
