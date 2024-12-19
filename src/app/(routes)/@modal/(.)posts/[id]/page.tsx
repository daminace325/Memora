import Modal from "@/components/Modal";
import ModalPostContent from "@/components/ModalPostContent";
import PreLoader from "@/components/PreLoader";
import { Suspense } from "react";

export default async function PostInModal({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params; // Await the params
    return (
        <Modal>
            <Suspense fallback={<PreLoader />}>
                <ModalPostContent postId={resolvedParams.id} />
            </Suspense>
        </Modal>
    );
}