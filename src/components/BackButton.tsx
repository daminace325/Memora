'use client'

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BackButton() {

    const router = useRouter()
    return (
        <button
            onClick={() => router.back()}>
            <ChevronLeft />
        </button>
    )
}