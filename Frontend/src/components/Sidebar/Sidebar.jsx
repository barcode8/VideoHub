import { 
    LuHouse, 
    LuTrendingUp, 
    LuSquarePlay, 
    LuHistory, 
    LuThumbsUp 
} from "react-icons/lu";

export default function Sidebar() {
    const menuItems = [
        { icon: <LuHouse size={20} />, label: "Home", active: true },
        { icon: <LuTrendingUp size={20} />, label: "Trending" },
        { icon: <LuSquarePlay size={20} />, label: "Subscriptions" }, 
        { divider: true },
        { icon: <LuHistory size={20} />, label: "History" },
        { icon: <LuThumbsUp size={20} />, label: "Liked Videos" },
    ];

    // YOU WERE MISSING THIS RETURN BLOCK:
    return (
        <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto bg-black p-3 gap-1">
            {menuItems.map((item, index) => (
                item.divider ? (
                    <hr key={index} className="my-2 border-zinc-800" />
                ) : (
                    <button
                        key={item.label}
                        className={`flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                            item.active 
                            ? 'bg-zinc-800 text-white' 
                            : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                )
            ))}
        </aside>
    );
}