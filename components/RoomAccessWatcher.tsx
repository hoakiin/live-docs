"use client"

import { useEventListener, useSelf } from "@liveblocks/react/suspense"
import { useCallback, useEffect } from "react"
import { getRoomAccess } from "@/lib/actions/room.actions"

const POLL_INTERVAL = 15000

const RoomAccessWatcher = ({
  roomId,
  onAccessChange,
}: {
  roomId: string
  onAccessChange: (userType: UserType | null) => void
}) => {
  const selfId = useSelf((self) => self.id)

  const refresh = useCallback(async () => {
    try {
      const access = await getRoomAccess(roomId)
      onAccessChange(access?.userType ?? null)
    } catch (error) {
      console.log(`Error happened while refreshing the room access: ${error}`)
    }
  }, [onAccessChange, roomId])

  useEventListener(({ event }) => {
    if (
      (event.type === "ACCESS_REVOKED" || event.type === "ACCESS_CHANGED") &&
      event.userId === selfId
    ) {
      void refresh()
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      void refresh()
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [refresh])

  return null
}

export default RoomAccessWatcher
