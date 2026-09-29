"use server"

import { cache } from "react"
import { clerkClient } from "@clerk/nextjs/server"
import { parseStringify } from "../utils"
import { liveblocks } from "../liveblocks"
import { getAuthenticatedEmail } from "../auth"

// Max page size accepted by the Liveblocks get-rooms API.
const MAX_ROOMS = 100

// Resolves Clerk profiles for collaborators. This action is reachable from the
// browser (Liveblocks calls it through `resolveUsers`), so it must never act as
// a "look up anyone by email" oracle: every requested email is intersected with
// the set of people who already share a document with the caller.
export const getClerkUsers = cache(
  async ({ userIds }: { userIds: string[] }) => {
    // Must stay index-aligned with `userIds` and never be `undefined`: callers
    // map over it, and a rejected lookup has to degrade to "unknown user"
    // instead of taking the whole room down.
    const unresolved = userIds.map(() => undefined)

    try {
      const email = await getAuthenticatedEmail()
      const { data: rooms } = await liveblocks.getRooms({
        userId: email,
        limit: MAX_ROOMS,
      })

      const reachable = new Set(
        rooms.flatMap((room) => Object.keys(room.usersAccesses))
      )

      const allowedIds = userIds.filter((userId) => reachable.has(userId))

      if (allowedIds.length === 0) {
        return parseStringify(unresolved)
      }

      const client = await clerkClient()
      const { data } = await client.users.getUserList({
        emailAddress: allowedIds,
      })

      const users = data.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0].emailAddress,
        avatar: user.imageUrl,
      }))

      return parseStringify(
        userIds.map((userId) => users.find((user) => user.email === userId))
      )
    } catch (error) {
      console.log(`Error fetching user: ${error}`)
      return parseStringify(unresolved)
    }
  }
)

export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string
  currentUser: string
  text: string
}) => {
  try {
    const room = await liveblocks.getRoom(roomId)

    const users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser
    )

    if (text.length) {
      const lowerCaseText = text.toLowerCase()

      const filteredUsers = users.filter((email: string) =>
        email.toLowerCase().includes(lowerCaseText)
      )

      return parseStringify(filteredUsers)
    }

    return parseStringify(users)
  } catch (error) {
    console.log(`Error fetching document users: ${error}`)
  }
}
