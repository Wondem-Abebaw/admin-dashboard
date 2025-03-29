"use client";
import { MoveDownIcon, MoveUpIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortingComponent({ field }: { field: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // Parse orderBy manually
  let parsedOrderBy: { field: string; direction: "asc" | "desc" }[] = [];
  let index = 0;

  while (searchParams.get(`orderBy[${index}][field]`)) {
    parsedOrderBy.push({
      field: searchParams.get(`orderBy[${index}][field]`) as string,
      direction: searchParams.get(`orderBy[${index}][direction]`) as
        | "asc"
        | "desc",
    });
    index++;
  }

  console.log("Parsed OrderBy:", parsedOrderBy);

  // Find the current field's sorting state
  const currentOrder = parsedOrderBy.find((o) => o.field === field);
  const currentDirection = currentOrder?.direction || "";

  // Function to update sorting
  const setSorting = (direction: "asc" | "desc") => {
    const params = new URLSearchParams(searchParams);

    // Reset orderBy with only the selected field
    params.delete("orderBy[0][field]");
    params.delete("orderBy[0][direction]");

    params.set("orderBy[0][field]", field);
    params.set("orderBy[0][direction]", direction);

    replace(`${pathname}?${params.toString()}`);
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
