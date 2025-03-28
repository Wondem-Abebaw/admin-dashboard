"use client";

import { collectionQueryBuilder } from "@/utility/collection-builder/collection-query-builder";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchComponent({
  placeholder,
  searchFrom,
}: {
  placeholder?: string;
  searchFrom?: string[];
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  // console.log("searchParams", searchParams);
  // console.log("pathname", pathname);
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      const newParams = collectionQueryBuilder({
        search: term,
        searchFrom: searchFrom,
      });

      newParams.forEach((value, key) => {
        params.set(key, value);
      });
    } else {
      params.delete("search");
      Array.from(params.keys()).forEach((key) => {
        if (key.startsWith("searchFrom")) {
          params.delete(key);
        }
      });
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder ?? "Search"}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
