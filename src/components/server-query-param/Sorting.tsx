"use client";

import { collectionQueryBuilder } from "@/utility/collection-builder/collection-query-builder";
import { MoveDownIcon, MoveUpIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortingComponent({ field }: { field: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // Parse existing orderBy param as an array
  const currentOrderBy = searchParams.get("orderBy");
  let parsedOrderBy: { field: string; direction: "asc" | "desc" }[] = [];

  if (currentOrderBy) {
    try {
      parsedOrderBy = JSON.parse(currentOrderBy);
    } catch (error) {
      console.error("Error parsing orderBy:", error);
    }
  }

  // Find the current order field
  const currentOrder = parsedOrderBy.find((o) => o.field === field);
  const currentDirection = currentOrder?.direction || "";

  const setSorting = (direction: "asc" | "desc") => {
    const params = new URLSearchParams(searchParams);

    const newParams = collectionQueryBuilder({
      orderBy: [{ field: field, direction: direction }],
    });

    newParams.forEach((value, key) => {
      params.set(key, value);
    });

    replace(`${pathname}?${params?.toString()}`);
  };

  return (
    <div className="flex space-x-0">
      <MoveUpIcon
        className={`h-3 w-3 cursor-pointer ${
          currentDirection === "asc" ? "text-blue-500" : "text-gray-500"
        }`}
        onClick={() => setSorting("asc")}
      />
      <MoveDownIcon
        className={`h-3 w-3 cursor-pointer ${
          currentDirection === "desc" ? "text-blue-500" : "text-gray-500"
        }`}
        onClick={() => setSorting("desc")}
      />
    </div>
  );
}
