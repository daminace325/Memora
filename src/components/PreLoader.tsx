'use client'

import { ClipLoader } from "react-spinners";

export default function PreLoader(){
    return(
        <ClipLoader loading={true} speedMultiplier={3} />
    )
}