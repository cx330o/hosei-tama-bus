import { useRef } from "react"
import { Menu } from "primereact/menu"
import { MoreHorizontal } from "lucide-react"

interface MessageOptionsDropdownProps {
  onDelete: () => void
}

const MessageOptionsDropdown = ({ onDelete }: MessageOptionsDropdownProps) => {
  const menu = useRef<Menu>(null)
  const items = [{ label: "Delete", icon: "pi pi-trash", command: () => onDelete() }]
  return (
    <div>
      <button onClick={(event) => menu.current?.toggle(event)} className="p-1 rounded-md text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors">
        <MoreHorizontal size={16} />
      </button>
      <Menu model={items} popup ref={menu} id="popup_menu" />
    </div>
  )
}

export default MessageOptionsDropdown
