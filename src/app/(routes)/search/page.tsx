import { auth } from "@/auth";
import PreLoader from "@/components/PreLoader";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import { redirect } from "next/navigation";
import { Suspense } from "react";


export default async function SearchPage({
  searchParams,
}: {searchParams: Promise<{ query: string }>}) {
  // If searchParams is a Promise, resolve it
  const resolvedSearchParams = await searchParams;
  
  const { query } = resolvedSearchParams;

  const session = await auth();
  if (!session?.user?.email) {
    return redirect('/');
  }

  return (
    <div className="w-full">
      <div className="max-w-md mx-auto">
        <SearchForm />
        {typeof query !== 'undefined' && (
          <Suspense fallback={<PreLoader />}>
            <SearchResults query={query} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
