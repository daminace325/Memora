import Modal from "@/components/Modal";
import ModalPostContent from "@/components/ModalPostContent";
import PreLoader from "@/components/PreLoader";
import { Suspense } from "react";

export type ParamsType = Promise<{ id: string }>;

export default async function PostInModal(props: { params: ParamsType }) {
    const { id } = await props.params
    return (
        <Modal>
            <Suspense fallback={<PreLoader />}>
                <ModalPostContent postId={id} />
            </Suspense>
        </Modal>
    );
}