import { auth, signIn } from "@/auth";
import PreLoader from "@/components/PreLoader";
import UserHome from "@/components/UserHome";
import { prisma } from "@/db";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Home() {
	const session = await auth()
	if (session) {
		// Check if the user already has a profile
		const profile = await prisma.profile.findFirst({
			where: {
				email: session?.user?.email as string,
			},
		});

		if (!profile) {
			return redirect('/settings');
		}
	}
	return (
		<div className="">
			{session && (
				<Suspense fallback={<PreLoader />}>
					<UserHome session={session} />
				</Suspense>
			)}
			{!session && (
				<div className="flex items-center justify-center min-h-screen">
					<div className="bg-white p-10 rounded-lg border max-w-md">
						<div className="text-4xl font-bold flex-col md:flex-row flex items-center gap-3 mb-4">
							<h2 className="text-gray-800">
								Welcome to
							</h2>
							<span className="font-pacifico text-transparent bg-clip-text bg-gradient-to-r from-ig-orange to-ig-red">
								Memora
							</span>
						</div>
						<p className="text-center text-gray-600 text-lg mb-8">
							<span>&quot;Connect, Share, and Remember the Moments that Matter.&quot;</span>
						</p>
						<form
							className="flex justify-center"
							action={async () => {
								'use server';
								await signIn('google');
							}}
						>
							<button
								className="px-3 py-3 bg-gradient-to-r from-ig-orange to-ig-red text-white font-semibold rounded-lg shadow-lg hover:bg-[#357AE8] transition duration-300 mb-4"
								type="submit"
							>
								<span className="flex items-center justify-center space-x-2">
									<Image
										src="/google-logo.webp"
										alt="Google logo"
										width={24}
										height={24}
										className="rounded-full"
									/>
									<span>Login with Google</span>
								</span>
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}
