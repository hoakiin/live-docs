import CollaborativeRoom from "@/components/CollaborativeRoom"
import { getDocument } from "@/lib/actions/room.actions"
import { getClerkUsers } from "@/lib/actions/user.actions"
import { getUserType } from "@/lib/utils"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const Document = async ({ params }: SearchParamProps) => {
  const { id } = await params
  const clerkUser = await currentUser()
  if (!clerkUser) redirect("/sign-in")

  const email = clerkUser.emailAddresses[0].emailAddress

  const room = await getDocument({
    roomId: id,
    userId: email,
  })

  if (!room) redirect("/")

  const userIds = Object.keys(room.usersAccesses)
  const users = (await getClerkUsers({ userIds })).filter(Boolean)

  const usersData = users.map((user: User) => ({
    ...user,
    userType: getUserType(room.usersAccesses[user.email]),
  }))

  const currentUserType = getUserType(room.usersAccesses[email])

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        isOwner={room.metadata.email === email}
        currentUserType={currentUserType}
      />
    </main>
  )
}

export default Document
