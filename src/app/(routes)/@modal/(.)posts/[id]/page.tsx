import Modal from "@/components/Modal";
import ModalPostContent from "@/components/ModalPostContent";
import PreLoader from "@/components/PreLoader";
import { Suspense } from "react";

export default function PostInModal({ params }: { params: { id: string } }) {
    return (
        <Modal>
            <Suspense fallback={<PreLoader />}>
                <ModalPostContent postId={params.id} />
            </Suspense>
        </Modal>
    );
}
