import { Editor } from "@/components/editor/Editor"
import Header from "@/components/Header"

const Document = () => {
  return (
    <div>
      <Header>
        <div className="flex w-fit items-center justify-center gap-2">
          <p className="line-clamp-1 border-dark-400 text-base leading-[24px] font-semibold sm:pl-0 sm:text-xl">
            Fake document title
          </p>
        </div>
      </Header>
      <Editor />
    </div>
  )
}

export default Document
