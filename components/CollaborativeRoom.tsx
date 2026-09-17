"use client"

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense"
import { Editor } from "@/components/editor/Editor"
import Header from "@/components/Header"
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"

const CollaborativeRoom = () => {
  return (
    <RoomProvider id="my-room">
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        <div className="collaborative-room">
          <Header>
            <div className="flex w-fit items-center justify-center gap-2">
              <p className="line-clamp-1 border-dark-400 text-base leading-[24px] font-semibold sm:pl-0 sm:text-xl">
                Fake document title
              </p>
            </div>
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
          </Header>
          <Editor />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborativeRoom
