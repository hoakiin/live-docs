"use client"

import Image from "next/image"
import { useState } from "react"

import { deleteDocument } from "@/lib/actions/room.actions"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "./ui/button"

export const DeleteModal = ({ roomId }: DeleteModalProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const deleteDocumentHandler = async () => {
    setLoading(true)

    try {
      await deleteDocument(roomId)
      setOpen(false)
    } catch (error) {
      console.log("Error notif:", error)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="min-w-9 rounded-xl bg-transparent p-2 transition-all" />
        }
      >
        <Image
          src="/assets/icons/delete.svg"
          alt="delete"
          width={20}
          height={20}
          className="mt-1"
        />
      </DialogTrigger>
      <DialogContent className="shad-dialog border-none bg-[rgba(21,30,47,1)] text-white">
        <DialogHeader>
          <Image
            src="/assets/icons/delete-modal.svg"
            alt="delete"
            width={48}
            height={48}
            className="mb-4"
          />
          <DialogTitle>Delete document</DialogTitle>
          <DialogDescription className="text-[rgba(180,198,238,1)]">
            Are you sure you want to delete this document? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className=" border-none bg-transparent">
          <DialogClose
            render={
              <Button className="w-full flex-1 bg-dark-400 text-white hover:bg-dark-500 hover:text-white" />
            }
          >
            Cancel
          </DialogClose>

          <Button
            variant="destructive"
            onClick={deleteDocumentHandler}
            className="gradient-red w-full flex-1 text-white hover:from-red-600 hover:to-red-500"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
