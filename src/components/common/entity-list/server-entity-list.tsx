import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, PlusCircleIcon } from "lucide-react";
import SearchComponent from "@/components/server-query-param/search";

interface Column {
  key: string;
  name: string;
  hideSort?: boolean;
  render?: (item: any) => React.ReactNode;
}

interface ServerEntityListProps {
  config: {
    selectable?: boolean;
    rootUrl: string;
    columns: Column[];
  };
  items: any[];
  total: number;
  showNewButton?: boolean;
  newButtonText?: string;
  title: string;
  searchFrom?: string[];
  orderBy: string;
}

export default function ServerEntityList({
  config,
  items,
  total,
  showNewButton,
  newButtonText,
  title,
  searchFrom,
  orderBy,
}: ServerEntityListProps) {
  return (
    <div className="flex-col space-y-2 border p-2">
      <div className="flex  items-center h-10 justify-between font-semibold dark:text-white border">
        {title}
        <div className="flex h-full items-center space-x-4">
          {/* {header ?? "Header component"} */}
        </div>
      </div>

      <div className={`w-full p-2 flex h-10  items-center justify-between `}>
        <div
          className={`flex h-full items-center ${
            showNewButton === false ? "invisible" : "visible"
          }`}
        >
          <Link
            href={`${config?.rootUrl}/new`}
            // state={{ id: location?.state?.id }}
          >
            <Button className="flex items-center justify-center rounded bg-primary shadow-none">
              <span>
                <PlusCircleIcon />
              </span>
              <span>{newButtonText ?? "New"}</span>
            </Button>
          </Link>
        </div>

        <div className="flex justify-end space-x-2">
          <div>
            <SearchComponent searchFrom={searchFrom} />
          </div>
          <div>filter component</div>
          <div>Reset filter component</div>
          {/* <div>Show selector component</div> */}
        </div>
      </div>
      <div className="relative overflow-x-auto px-2">
        {" "}
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {config.selectable && (
                <th className="px-4 py-2">
                  <input type="checkbox" />
                </th>
              )}
              {config.columns.map((col) => (
                <th key={col.key} className="px-6 py-3">
                  <a
                    href={`?orderBy=${col.key}&direction=${
                      orderBy === col.key && direction === "asc"
                        ? "desc"
                        : "asc"
                    }`}
                    className="flex items-center gap-2"
                  >
                    {col.name}
                    {!col.hideSort && (
                      <>
                        <ChevronUp
                          className={`h-4 w-4 ${
                            orderBy === col.key && direction === "asc"
                              ? "text-blue-500"
                              : ""
                          }`}
                        />
                        <ChevronDown
                          className={`h-4 w-4 ${
                            orderBy === col.key && direction === "desc"
                              ? "text-blue-500"
                              : ""
                          }`}
                        />
                      </>
                    )}
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-100">
                {config.selectable && (
                  <td className="px-4 py-2">
                    <input type="checkbox" />
                  </td>
                )}
                {config.columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
