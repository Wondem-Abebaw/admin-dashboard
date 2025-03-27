"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { collectionQueryBuilder } from "@/utility/collection-builder/collection-query-builder";
import { CollectionQuery } from "@/models/collection.model";

export default function UserFilterComponent() {
  const [collection, setCollection] = useState<CollectionQuery>();

  const [openExport, setOpenExport] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const updateFilter = (collection: CollectionQuery) => {
    const newParams = collectionQueryBuilder(collection);
    newParams.forEach((value, key) => {
      params.set(key, value);
    });
    replace(`${pathname}?${params?.toString()}`);
  };
  const resetFilter = () => {
    setFilterValue([]);
    params.delete("filter");
    replace(`${pathname}?${params?.toString()}`);
  };

  const filterQuery = (data: string[]) => {
    let filterQueryValue: any[] = [];
    const filterMap: { [key: string]: any[] } = {};

    data.forEach((item) => {
      filterMap[JSON.parse(item)?.field] = data.filter(
        (query) => JSON.parse(query)?.field === JSON.parse(item).field
      );
    });

    Object.keys(filterMap).forEach((key) => {
      filterQueryValue = [
        ...filterQueryValue,
        filterMap[key].map((item) => JSON.parse(item)),
      ];
    });

    return filterQueryValue;
  };

  const filteringVariables = [
    [
      { field: "enabled", value: true, operator: "=", name: "Active" },
      { field: "enabled", value: false, operator: "=", name: "Inactive" },
    ],
    [
      { field: "gender", value: "male", operator: "=", name: "Male" },
      { field: "gender", value: "female", operator: "=", name: "Female" },
    ],
  ];

  useEffect(() => {
    const filter = filterQuery(filterValue);
    setCollection({
      ...collection,
      filter: [...filter],
    });
  }, [filterValue]);

  return (
    <div className="flex">
      <div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setOpenExport(true)}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          {filterValue.length > 0 && (
            <span
              className="text-blue-500 cursor-pointer pt-1"
              onClick={() => resetFilter()}
            >
              Reset filters
            </span>
          )}
        </div>

        <Dialog open={openExport} onOpenChange={setOpenExport}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Filter </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {filteringVariables.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  {group.map((filter, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${idx}-${index}`}
                        checked={filterValue.includes(JSON.stringify(filter))}
                        onCheckedChange={(checked) => {
                          setFilterValue((prev) =>
                            checked
                              ? [...prev, JSON.stringify(filter)]
                              : prev.filter(
                                  (val) => val !== JSON.stringify(filter)
                                )
                          );
                        }}
                      />
                      <label
                        htmlFor={`filter-${idx}-${index}`}
                        className="text-sm"
                      >
                        {filter.name}
                      </label>
                    </div>
                  ))}

                  {idx < filteringVariables.length - 1 && <Separator />}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={() => updateFilter(collection)}>
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
