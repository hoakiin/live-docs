"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  InboxNotification,
  InboxNotificationList,
  LiveblocksUiConfig,
} from "@liveblocks/react-ui"
import {
  useInboxNotifications,
  useMarkAllInboxNotificationsAsRead,
} from "@liveblocks/react/suspense"
import Image from "next/image"
import { ReactNode } from "react"

const Notifications = () => {
  const { inboxNotifications } = useInboxNotifications()
  const markAllAsRead = useMarkAllInboxNotificationsAsRead()

  const unreadNotifications = inboxNotifications.filter(
    (notification) => !notification.readAt
  )

  // `useUnreadInboxNotificationsCount` reads from a separate cached resource that
  // marking notifications as read doesn't invalidate, so the bell would keep
  // showing a dot for a list that is already empty. Derive it from the same array
  // the list renders from, so the indicator can never disagree with the list.
  const unreadCount = unreadNotifications.length

  // The list only renders unread notifications, so they have to be marked as
  // read once the panel is closed, otherwise they stay in the inbox forever
  // and reappear on every reload.
  const handleOpenChange = (open: boolean) => {
    if (!open && unreadCount > 0) {
      markAllAsRead()
    }
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger className="relative flex size-10 items-center justify-center rounded-lg">
        <Image
          src="/assets/icons/bell.svg"
          alt="inbox"
          width={24}
          height={24}
        />
        {unreadCount > 0 && (
          <div className="absolute top-2 right-2 z-20 size-2 rounded-full bg-blue-500" />
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="shad-popover">
        <LiveblocksUiConfig
          overrides={{
            INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => (
              <>{user} mentioned you.</>
            ),
          }}
        >
          <InboxNotificationList>
            {unreadNotifications.length <= 0 && (
              <p className="py-2 text-center text-dark-500">
                No new notifications
              </p>
            )}

            {unreadNotifications.length > 0 &&
              unreadNotifications.map((notification) => (
                <InboxNotification
                  key={notification.id}
                  inboxNotification={notification}
                  className="bg-dark-200 text-white"
                  href={
                    notification.roomId
                      ? `/documents/${notification.roomId}`
                      : undefined
                  }
                  showActions={false}
                  kinds={{
                    thread: (props) => (
                      <InboxNotification.Thread
                        {...props}
                        showActions={false}
                        showRoomName={false}
                      />
                    ),
                    textMention: (props) => (
                      <InboxNotification.TextMention
                        {...props}
                        showRoomName={false}
                      />
                    ),
                    $documentAccess: (props) => (
                      <InboxNotification.Custom
                        {...props}
                        title={props.inboxNotification.activities[0].data.title}
                        aside={
                          <InboxNotification.Icon className="bg-transparent">
                            <Image
                              src={
                                (props.inboxNotification.activities[0].data
                                  .avatar as string) || ""
                              }
                              width={36}
                              height={36}
                              alt="avatar"
                              className="rounded-full"
                            />
                          </InboxNotification.Icon>
                        }
                      >
                        {props.children}
                      </InboxNotification.Custom>
                    ),
                  }}
                />
              ))}
          </InboxNotificationList>
        </LiveblocksUiConfig>
      </PopoverContent>
    </Popover>
  )
}

export default Notifications
