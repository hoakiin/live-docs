import { currentUser } from "@clerk/nextjs/server"

export const getAuthenticatedEmail = async () => {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    throw new Error("Unauthorized")
  }

  return clerkUser.emailAddresses[0].emailAddress
}
