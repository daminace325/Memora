import Link from "next/link";
import { CameraIcon, HomeIcon, LayoutGridIcon, SearchIcon, UserIcon } from "lucide-react";


export default function DesktopNav() {
    return (
        <div className="hidden lg:block px-4 pb-4 w-48 shadow-md shadow-gray-600">
            <div className="top-4 sticky">
                <div className="flex items-center justify-center text-4xl font-pacifico text-transparent bg-clip-text bg-gradient-to-r from-ig-orange to-ig-red">
                    Memora
                </div>
                <div className="ml-2 inline-flex flex-col gap-5 mt-8 *:flex *:items-center *:gap-2">
                    <Link href={'/'}>
                        <HomeIcon />
                        Home
                    </Link>
                    <Link href={'/search'}>
                        <SearchIcon />
                        Search
                    </Link>
                    <Link href={'/browse'}>
                        <LayoutGridIcon />
                        Browse
                    </Link>
                    <Link href={'/profile'}>
                        <UserIcon />
                        Profile
                    </Link>
                    <Link href={'/create'}>
                        <CameraIcon />
                        Create
                    </Link>
                </div>
            </div>
        </div>
    )
}