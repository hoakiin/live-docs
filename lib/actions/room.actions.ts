"use server"

import { nanoid } from "@liveblocks/client"
import { revalidatePath } from "next/cache"
import { currentUser } from "@clerk/nextjs/server"
import { liveblocks } from "../liveblocks"
import { getAccessType, getUserType, parseStringify } from "../utils"
import { getAuthenticatedEmail } from "../auth"
import { redirect } from "next/navigation"

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid()

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    }

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    }

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    })

    revalidatePath("/")

    return parseStringify(room)
  } catch (error) {
    console.log(`Error happened while creating a room: ${error}`)
  }
}

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string
  userId: string
}) => {
  try {
    const room = await liveblocks.getRoom(roomId)

    const hasAccess = Object.keys(room.usersAccesses).includes(userId)

    if (!hasAccess) {
      throw new Error("You do not have access to this document")
    }

    return parseStringify(room)
  } catch (error) {
    console.log(`Error happened while getting a room: ${error}`)
  }
}

export const getDocuments = async (email: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email })

    return parseStringify(rooms)
  } catch (error) {
    console.log(`Error happened while getting rooms: ${error}`)
  }
}

export const updateDocument = async (roomId: string, title: string) => {
  try {
    const email = await getAuthenticatedEmail()
    const room = await liveblocks.getRoom(roomId)

    if (!room.usersAccesses[email]?.includes("room:write")) {
      throw new Error("You do not have edit access to this document")
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    })

    revalidatePath(`/documents/${roomId}`)

    return parseStringify(updatedRoom)
  } catch (error) {
    console.log(`Error happened while updating a room: ${error}`)
  }
}

export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      throw new Error("Unauthorized")
    }

    const currentRoom = await liveblocks.getRoom(roomId)

    if (currentRoom.metadata.email !== clerkUser.emailAddresses[0].emailAddress) {
      throw new Error("Only the document owner can manage access")
    }

    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    }

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    })

    await liveblocks.broadcastEvent(roomId, {
      type: "ACCESS_CHANGED",
      userId: email,
      userType,
    })

    if (room) {
      const notificationId = nanoid()

      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: "$documentAccess",
        subjectId: notificationId,
        activityData: {
          userType,
          title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email,
        },
        roomId,
      })
    }

    revalidatePath(`/documents/${roomId}`)
    return parseStringify(room)
  } catch (error) {
    console.log(`Error happened while updating a room access: ${error}`)
  }
}

export const removeCollaborator = async ({
  roomId,
  email,
  updatedBy,
}: RemoveCollaboratorParams) => {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      throw new Error("Unauthorized")
    }

    const room = await liveblocks.getRoom(roomId)

    if (room.metadata.email !== clerkUser.emailAddresses[0].emailAddress) {
      throw new Error("Only the document owner can remove collaborators")
    }

    if (room.metadata.email === email) {
      throw new Error("You cannot remove yourself from the document")
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    })

    await liveblocks.broadcastEvent(roomId, {
      type: "ACCESS_REVOKED",
      userId: email,
    })

    await liveblocks.triggerInboxNotification({
      userId: email,
      kind: "$documentAccess",
      subjectId: nanoid(),
      activityData: {
        userType: "removed",
        title: `Access to "${room.metadata.title}" was removed by ${updatedBy.name}`,
        updatedBy: updatedBy.name,
        avatar: updatedBy.avatar,
        email: updatedBy.email,
      },
    })

    revalidatePath(`/documents/${roomId}`)
    return parseStringify(updatedRoom)
  } catch (error) {
    console.log(`Error happened while removing a collaborator: ${error}`)
  }
}

export const getRoomAccess = async (roomId: string) => {
  const email = await getAuthenticatedEmail()
  const room = await liveblocks.getRoom(roomId)
  const access = room.usersAccesses[email]

  if (!access) {
    return null
  }

  return { userType: getUserType(access) }
}

export const deleteDocument = async (roomId: string) => {
  try {
    const email = await getAuthenticatedEmail()
    const room = await liveblocks.getRoom(roomId)

    if (room.metadata.email !== email) {
      throw new Error("Only the document owner can delete this document")
    }

    await liveblocks.deleteRoom(roomId)
    revalidatePath("/")
  } catch (error) {
    console.log(`Error happened while deleting a room: ${error}`)
    return
  }

  // Must stay outside the try/catch: `redirect` works by throwing NEXT_REDIRECT,
  // which the catch above would swallow and leave the user on a deleted room.
  redirect("/")
}
