"use client"

import { useSelf } from "@liveblocks/react/suspense"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import Image from "next/image"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import UserTypeSelector from "./UserTypeSelector"
import Collaborator from "./Collaborator"
import { updateDocumentAccess } from "@/lib/actions/room.actions"

const ShareModal = ({
  roomId,
  collaborators,
  creatorId,
  currentUserType,
}: ShareDocumentDialogProps) => {
  const user = useSelf()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [userType, setUserType] = useState<UserType>("viewer")

  const shareDocumentHandler = async () => {
    setLoading(true)

    await updateDocumentAccess({
      roomId,
      email,
      userType: userType as UserType,
      updatedBy: user.info,
    })

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            className="gradient-blue flex h-9 gap-1 px-4"
            disabled={currentUserType !== "editor"}
          />
        }
      >
        <Image
          src="/assets/icons/share.svg"
          alt="share"
          width={20}
          height={20}
          className="min-w-4 md:size-5"
        />
        <p className="mr-1 hidden sm:block">Share</p>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[400px] rounded-xl border-none bg-doc bg-cover px-5 py-7 text-white shadow-xl sm:min-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-white">
            Manage who can view this project
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 font-normal tracking-normal text-blue-100">
            Select which users can view and edit this document
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="email" className="mt-6 text-blue-100">
          Email address
        </Label>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 rounded-md bg-dark-400">
            <Input
              id="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 flex-1 border-none bg-dark-400 text-white placeholder:text-blue-100 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-dark-400"
            />

            <UserTypeSelector userType={userType} setUserType={setUserType} />
          </div>

          <Button
            type="submit"
            onClick={shareDocumentHandler}
            className="gradient-blue flex h-full gap-1 px-5"
            disabled={loading}
          >
            {loading ? "Sending" : "Invite"}
          </Button>
        </div>

        <div className="my-2 space-y-2">
          <ul className="flex flex-col">
            {collaborators.map((collaborator) => (
              <Collaborator
                key={collaborator.id}
                roomId={roomId}
                creatorId={creatorId}
                email={collaborator.email}
                collaborator={collaborator}
                user={user.info}
              />
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareModal
