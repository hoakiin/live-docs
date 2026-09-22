import { liveblocks } from "@/lib/liveblocks"
import { getUserColor } from "@/lib/utils"
import { auth, clerkClient } from "@clerk/nextjs/server"

export async function POST() {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const client = await clerkClient()
  const { id, firstName, lastName, emailAddresses, imageUrl } =
    await client.users.getUser(userId)
  // Get the current user from your database
  const user = {
    id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: getUserColor(id),
    },
  }

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [],
    },
    { userInfo: user.info }
  )

  return new Response(body, { status })
}
