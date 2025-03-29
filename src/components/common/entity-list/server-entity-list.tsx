import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  PlusCircleIcon,
  CheckIcon,
  MinusIcon,
  Ellipsis,
} from "lucide-react";
import SearchComponent from "@/components/server-query-param/search";
import SortingComponent from "@/components/server-query-param/Sorting";
import ShowArchivedComponent from "@/components/server-query-param/show-archived";
import EmptyIcon from "../empty-icon/empty-icon";
import ServerPaginationComponent from "@/components/server-query-param/server-pagination";
import dateFormat from "dateformat";

interface Column {
  key: string | string[];
  name: string;
  hideSort?: boolean;
  isDate?: boolean;
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
  defaultSkip: number;
  defaultTop: number;
  showNewButton?: boolean;
  newButtonText?: string;
  title: string;
  searchFrom?: string[];
  orderBy: string;
  header?: React.ReactNode;
  filterComponent?: React.ReactNode;
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
  header,
  filterComponent,
  defaultSkip,
  defaultTop,
}: ServerEntityListProps) {
  const childeView = (item: any, keys: string[]) => {
    if (keys.length && item) {
      keys.forEach((key: any) => {
        if (item[key] !== null && item[key] !== undefined) {
          item = item[key];
        } else {
          item = "";
        }
      });
    }
    return item;
  };
  return (
    <div className="flex-col space-y-2 border p-2 text-sm">
      <div className="flex  items-center h-10 justify-between font-semibold dark:text-white border">
        {title}
        <div className="flex h-full items-center space-x-3">
          <div> {header ?? "Header component"}</div>
          {<ShowArchivedComponent />}
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
          <div>{filterComponent ?? ""}</div>
          {/* <div>Reset filter component</div> */}
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
                <th key={col?.key} className="px-6 py-3 ">
                  <div className="flex items-center">
                    <div>{col.name}</div>
                    <div>
                      {!col.hideSort && <SortingComponent field={col?.key} />}
                    </div>
                  </div>
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
                    {col.render ? (
                      col.render(item)
                    ) : !Array.isArray(col.key) ? (
                      typeof item[col.key] === "boolean" ? (
                        item[col.key] ? (
                          <CheckIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <MinusIcon className="h-5 w-5 text-red-400" />
                        )
                      ) : col.isDate ? (
                        item[col.key] !== null ? (
                          dateFormat(item[col.key], "ddd, mmm d, yyyy, h:MM TT")
                        ) : (
                          <Ellipsis className="h-4 w-4 text-gray-700" />
                        )
                      ) : (
                        item[col.key]
                      )
                    ) : (
                      childeView(item, col.key)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {total > 0 && (
          <div className="flex justify-end p-2 w-full">
            <ServerPaginationComponent
              total={total}
              title={title}
              defaultSkip={defaultSkip}
              defaultTop={defaultTop}
            />
          </div>
        )}
        {!items?.length && (
          <div className="w-full flex justify-center items-center h-56">
            <EmptyIcon />
          </div>
        )}
      </div>
    </div>
  );
}
