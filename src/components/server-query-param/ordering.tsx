"use client";

import { MoveDownIcon, MoveUpIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function OrderingComponent({ field }: { field: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  console.log("searchParams ordering", searchParams);

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

    const newOrderBy = [{ field: field, direction: direction }];

    params.set("orderBy", JSON.stringify(newOrderBy));

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col">
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
