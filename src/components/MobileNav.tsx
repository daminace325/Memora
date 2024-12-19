import { CameraIcon, HomeIcon, LayoutGridIcon, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export default function MobileNav() {
    return (
        <div className="block lg:hidden fixed bottom-0 left-0 right-0">
            <div className="flex text-gray-600 *:flex *:items-center">
                <div className="bg-white pl-4 rounded-t-xl w-full relative z-10 *:size-12 *:flex *:justify-center *:items-center justify-around">
                    <Link href="/" className="">
                        <HomeIcon />
                    </Link>
                    <Link href="/search" className="">
                        <SearchIcon />
                    </Link>
                </div>
                <div className="size-14 relative -top-4 justify-center w-[125px]">
                    <div className="absolute bg-clip-text border-t-transparent border-l-transparent border-white  border-[50px] rounded-full rotate-45">
                        <div className="border-4 size-15 border-transparent">
                            <Link
                                href="/create"
                                className="-rotate-45 bg-gradient-to-tr from-ig-orange to-ig-red size-12 flex items-center justify-center text-white rounded-full">
                                <CameraIcon />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="bg-white pr-4 rounded-t-xl w-full relative z-10 *:size-12 *:flex *:justify-center *:items-center justify-around">
                    <Link href="/browse" className="">
                        <LayoutGridIcon />
                    </Link>
                    <Link
                        href="/profile"
                        className="text-ig-red ">
                        <UserIcon />
                    </Link>
                </div>
            </div>
        </div>
    )
}