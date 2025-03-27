"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "../ui/checkbox";

export default function ShowArchivedComponent() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams);

  // Read initial state from URL
  const initialArchivedState = params.get("withArchived") === "true";
  const [isChecked, setIsChecked] = useState(initialArchivedState);

  useEffect(() => {
    setIsChecked(params.get("withArchived") === "true");
  }, [searchParams]);

  const toggleArchived = (checked: boolean) => {
    if (checked) {
      params.set("withArchived", "true");
    } else {
      params.delete("withArchived"); // Remove param when unchecked
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-1">
      <Checkbox
        className="border-primary"
        id="id1"
        checked={isChecked}
        onCheckedChange={(checked) => {
          if (typeof checked === "boolean") {
            setIsChecked(checked); // Update local state
            toggleArchived(checked);
          }
        }}
      />
      <label
        htmlFor="id1"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Show Archived
      </label>
    </div>
  );
}
