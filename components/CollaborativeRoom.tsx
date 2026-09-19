"use client"

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense"
import { Editor } from "@/components/editor/Editor"
import Header from "@/components/Header"
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import ActiveCollaborators from "./ActiveCollaborators"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { updateDocument } from "@/lib/actions/room.actions"

const CollaborativeRoom = ({
  roomId,
  roomMetadata,
}: CollaborativeRoomProps) => {
  const currentUserType = "editor"

  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setLoading(true)

      try {
        if (documentTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle)

          if (updatedDocument) {
            setEditing(false)
          }
        }
      } catch (error) {
        console.log(error)
      }

      setLoading(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false)
        if (editing) {
          updateDocument(roomId, documentTitle)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [roomId, documentTitle, editing])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        <div className="collaborative-room">
          <Header>
            <div
              ref={containerRef}
              className="flex w-fit items-center justify-center gap-2"
            >
              {editing && !loading ? (
                <input
                  type="text"
                  value={documentTitle}
                  ref={inputRef}
                  placeholder="Enter title"
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  disabled={!editing}
                  size={Math.max(documentTitle.length + 2, 12)}
                  className="m-0 box-border grow-0 shrink-0 rounded-none border-0 bg-transparent p-0 text-center text-base leading-[24px] font-semibold outline-none placeholder:text-muted-foreground focus:outline-none disabled:text-black sm:text-xl md:text-xl"
                />
              ) : (
                <>
                  <p className="line-clamp-1 border-dark-400 text-center text-base leading-[24px] font-semibold sm:pl-0 sm:text-xl">
                    {documentTitle}
                  </p>
                </>
              )}

              {currentUserType === "editor" && !loading && (
                <Image
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  width={24}
                  height={24}
                  onClick={() => setEditing(true)}
                  className={editing ? "pointer-events-none invisible" : "pointer"}
                />
              )}

              {currentUserType !== "editor" && !editing && (
                <p className="view-only-tag">View only</p>
              )}

              {loading && <p className="text-sm text-gray-400">saving...</p>}
            </div>
            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveCollaborators />
              <Show when="signed-out">
                <SignInButton>
                  <button className="h-10 cursor-pointer rounded-full bg-transparent px-4 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:h-12 sm:px-5 sm:text-base">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="h-10 cursor-pointer rounded-full bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 sm:h-12 sm:px-5 sm:text-base">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </Header>
          <Editor />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborativeRoom
