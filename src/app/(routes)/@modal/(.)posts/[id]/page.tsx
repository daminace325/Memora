import Modal from "@/components/Modal";
import ModalPostContent from "@/components/ModalPostContent";
import PreLoader from "@/components/PreLoader";
import { Suspense } from "react";

export default async function PostInModal({ params: { id } }: { params: { id: string } }) {
    return (
        <Modal>
            <Suspense fallback={<PreLoader />}>
                <ModalPostContent postId={id} />
            </Suspense>
        </Modal>
    )
}