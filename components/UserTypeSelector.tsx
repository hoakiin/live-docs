import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const UserTypeSelector = ({ userType, setUserType, onClickHandler }: UserTypeSelectorParams) => {
  const accessChangeHandler = (type: UserType) => {
    setUserType(type);
    onClickHandler && onClickHandler(type);
  }

  return (
    <Select
      value={userType}
      onValueChange={(type) => {
        if (type) accessChangeHandler(type as UserType)
      }}
    >
      <SelectTrigger className="shad-select h-11 data-[size=default]:h-11 dark:bg-transparent dark:hover:bg-transparent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-none bg-dark-200">
        <SelectItem value="viewer" className="cursor-pointer bg-dark-200 text-blue-100 focus:bg-dark-300 hover:bg-dark-300 focus:text-blue-100">can view</SelectItem>
        <SelectItem value="editor" className="cursor-pointer bg-dark-200 text-blue-100 focus:bg-dark-300 hover:bg-dark-300 focus:text-blue-100">can edit</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default UserTypeSelector