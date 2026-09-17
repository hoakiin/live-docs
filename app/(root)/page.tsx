import AddDocumentBtn from "@/components/AddDocumentBtn"
import Header from "@/components/Header"
import { Show, UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
import { redirect } from "next/navigation"

const Home = async () => {
  const clerkUser = await currentUser()
  if (!clerkUser) redirect("/sign-in")

  const documents = []

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center gap-5 sm:gap-10">
      <Header className="sticky top-0 left-0">
        <div className="flex items-center gap-2 lg:gap-4">
          Notification
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </Header>

      {documents.length > 0 ? (
        <div></div>
      ) : (
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="Document"
            width={40}
            height={40}
            className="mx-auto"
          />

          <AddDocumentBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  )
}

export default Home
