import Avatar from "@/components/Avatar"
import { Profile } from "@prisma/client"
import { format } from "date-fns";

export default function Description({
    text,
    createdAt,
    authorProfile,

}: {
    text: string;
    createdAt: Date;
    authorProfile?: Profile;
}) {
    return (
        <div className="flex gap-2">
            <div>
                <Avatar src={authorProfile?.avatar || ''} />
            </div>
            <div className="w-full">
                <div className="flex gap-2 justify-between">
                    <div className="">
                        <h3 className="flex gap-1">
                            {authorProfile?.name}
                        </h3>
                        <h4 className="text-gray-500 text-sm -mt-1">
                            @{authorProfile?.username}
                        </h4>
                    </div>
                </div>
                <div className="">
                    <div className="">
                        <p className="">
                            {text}
                        </p>
                    </div>
                    <div className="text-xs text-gray-400">
                        Posted At: {format(createdAt, 'yyyy-MM-dd HH:mm:ss')}
                    </div>
                </div>
            </div>
        </div>
    )
}