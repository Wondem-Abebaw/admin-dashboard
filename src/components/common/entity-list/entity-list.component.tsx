"use client";

import { ReactElement, useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  FunnelIcon,
  PlusCircleIcon,
  PrinterIcon,
  ChevronRightIcon,
  MinusIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash-es";
import dateFormat from "dateformat";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import EmptyIcon from "../empty-icon/empty-icon";
import { useDispatch, useSelector } from "react-redux";
import { CollectionQuery } from "@/models/collection.model";
import { EntityConfig, entityViewMode } from "@/models/entity-config.model";
import {
  removeEntityListCollection,
  setEntityListCollection,
} from "@/store/slice/entity-list/entity-list-slice";
import { RootState } from "@/store/app.store";
import { toast } from "sonner";
import Spinner from "../spinner/spinner";
import { MoveDownIcon, MoveUpIcon } from "lucide-react";
import ClientPaginationComponent from "../client-pagination/client-pagination";

type FunctionType = (args: any) => void;

interface Props<T> {
  showAllHeader?: boolean;
  config?: EntityConfig<T>;
  tableKey?: string;
  check?: boolean;
  showNewButton?: Boolean;
  newButtonText?: string;
  showExport?: boolean;
  showArchived?: boolean;
  showSelector?: boolean;
  viewMode: entityViewMode;
  collectionQuery?: CollectionQuery;
  setCollection?: FunctionType;
  items?: any;
  selectedItem?: any;
  itemsLoading?: boolean;
  fullDetailWidth?: boolean;
  pageSize?: number[];
  defaultPageSize?: number;
  initialPage?: number;
  parentStyle?: string;
  total: any;
  header?: any;
  loading?: boolean;
  title: string | ReactElement<any>;
  detailWidth?: any;
  onItemsSelected?: FunctionType;
  onShowArchived?: FunctionType;
  onShowSelector?: FunctionType;
  onPaginationChange: any;
  onSearch?: FunctionType;
  onFilterChange?: any;
  onOrder?: FunctionType;
  printModalChange?: any;
  exportExcelChange?: any;
  children?: ReactElement<any>;
}

export default function EntityList<T>(props: Props<T>) {
  const {
    detailWidth = { list: "md:w-3/12", content: "md:w-9/12" },
    viewMode,
    selectedItem = [],
    items,
    config,
    tableKey,
    title,
    itemsLoading,
    total,
    pageSize,
    defaultPageSize,
    fullDetailWidth,
    onPaginationChange,
    onSearch,
    onShowArchived,
    onShowSelector,
    onFilterChange,
    onOrder,
    onItemsSelected,
    showNewButton,
    newButtonText = "New",
    showArchived = true,
    header,
    parentStyle,
    showExport,
    showSelector = true,
    collectionQuery,
    setCollection,
    showAllHeader = true,
    children,
  } = props;

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const pdfRef = useRef(null);
  const dispatch = useDispatch();

  const [renderCount, setRenderCount] = useState<number>(0);
  const [opened, setOpened] = useState(false);
  const [printItems, setPrintItems] = useState<any[]>([]);
  const [checkedItems, setCheckedItems] = useState<any[]>([]);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(
    fullDetailWidth ?? false
  );
  const [check, setCheck] = useState<boolean>(props?.check ?? false);

  const [defaultValue] = useState<EntityConfig<T>>({
    rootUrl: "",
    detailUrl: "edit",
    identity: "id",
    name: "",
    visibleColumn: [],
    primaryColumn: { name: "Name", key: "name" },
    showFullScreen: true,
    showClose: true,
    hasActions: false,
    showDetail: true,
  });

  const collection = useSelector(
    (state: RootState) => state?.entityListReducer?.collections
  ).filter((item) => item?.key === tableKey);

  const [setting, setSetting] = useState<EntityConfig<T>>();
  const [filterValue, setFilterValue] = useState<string[]>([]);
  const [filterMenus, setFilterProps] = useState<any>({});
  const [order, setOrder] = useState<{ field: string; direction: string }>({
    field: "",
    direction: "",
  });
  useEffect(() => {
    if (collection) {
      let filters: string[] = [];
      collection?.[0]?.collection?.filter?.forEach((item: any) => {
        item?.forEach((filter: any) => {
          filters.push(JSON.stringify(filter));
        });
      });

      if (collection?.[0]?.collection?.orderBy) {
        onOrder?.({
          field: collection?.[0]?.collection?.orderBy?.[0]?.field,
          direction: collection?.[0]?.collection?.orderBy?.[0]?.direction,
        });
        setOrder({
          field: collection?.[0]?.collection?.orderBy?.[0]?.field,
          direction:
            collection?.[0]?.collection?.orderBy?.[0]?.direction ?? "desc",
        });
      }
      if (collection?.[0]?.collection?.search) {
        onSearch?.(collection?.[0]?.collection?.search);
      }
      setFilterValue(filters);
    }
  }, []);

  useEffect(() => {
    setSetting({
      ...defaultValue,
      ...config,
    });

    if (config?.filter && config?.filter?.length > 0) {
      let filterTemp: any[] = [];
      config?.filter?.forEach((item, idx) => {
        item.forEach((filter, index) => {
          filterTemp?.push({
            key: filter.field + index,
            label: (
              <div className="flex items-center gap-2">
                <Checkbox
                  id={filter.field + index}
                  value={JSON.stringify(filter)}
                  onCheckedChange={(checked) => {
                    const currentValue = JSON.stringify(filter);
                    if (checked) {
                      setFilterValue([...filterValue, currentValue]);
                    } else {
                      setFilterValue(
                        filterValue.filter((v) => v !== currentValue)
                      );
                    }
                  }}
                />
                <label htmlFor={filter.field + index}>{filter.name}</label>
              </div>
            ),
          });
        });

        if (setting !== undefined && setting?.filter?.length !== idx + 1) {
          filterTemp?.push({ type: "divider" });
        }
      });
      setFilterProps({ items: filterTemp });
    }
  }, [config, defaultValue]);

  useEffect(() => {
    if (onItemsSelected) {
      onItemsSelected(checkedItems);
    }
  }, [checkedItems]);

  useEffect(() => {
    onFilterChange(filterQuery(filterValue));
  }, [filterValue]);

  useEffect(() => {
    setCheck(props?.check ?? check);
  }, [props?.check]);

  useEffect(() => {
    onShowSelector?.(check);
  }, [check]);

  useEffect(() => {
    if (allChecked) {
      setCheckedItems(items ? items : []);
    } else {
      setCheckedItems([]);
    }
  }, [allChecked]);

  useEffect(() => {
    if (check && opened && checkedItems.length === 0) {
      toast("Please select items to export");
    } else if (check) {
      setPrintItems(checkedItems);
    } else {
      setPrintItems(items ? items : []);
    }
  }, [opened]);

  useEffect(() => {
    if (
      collectionQuery?.skip !== 0 ||
      collectionQuery?.top !== 10 ||
      collectionQuery?.search ||
      (collectionQuery?.filter && collectionQuery?.filter?.length > 0) ||
      (collectionQuery?.orderBy && collectionQuery?.orderBy?.length > 0)
    ) {
      dispatch(
        setEntityListCollection({ key: tableKey, collection: collectionQuery })
      );
    }
  }, [collectionQuery, tableKey]);

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

  const exportToExcel = async () => {
    toast({
      variant: "destructive",
      title: "Warning",
      description: "Please select items to export",
    });
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8;";
    const fileExtension = ".xlsx";

    if (check && checkedItems.length === 0) {
      toast("Please select items to export");
      return null;
    }

    const exportItems = check ? checkedItems : items;
    const exportData: any = exportItems?.map((item: any) => {
      let data: any = {};

      setting?.visibleColumn.map((col) => {
        if (col?.print !== false && col?.hide !== true) {
          if (!Array.isArray(col.key)) {
            if (col?.isDate) {
              return dateFormat(
                item[`${col.key}`],
                "ddd, mmm d, yyyy, h:MM TT "
              );
            } else {
              return (data[`${col.key}`] = item[`${col.key}`]);
            }
          } else {
            if (col?.isDate) {
              return (data[`${col.key}`] = dateFormat(
                childeView(item, col.key),
                "ddd, mmm d, yyyy, h:MM TT"
              ));
            } else {
              return (data[`${col.key}`] = childeView(item, col.key));
            }
          }
        }
      });
      return data;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, title + fileExtension);
  };

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

  const handlePrint = useReactToPrint({
    documentTitle: title?.toString(),
    pageStyle: "@page { size: auto; margin: 0mm; }",
    print: async () => pdfRef.current,
  });

  return (
    <div
      className={`h-full flex gap-2 relative shadow-md  ${
        showAllHeader ? "p-2" : "p-0"
      } ${parentStyle}`}
    >
      <div
        className={`flex-col gap-2 border rounded-lg ${
          viewMode === "list"
            ? "w-full"
            : !fullScreen
            ? detailWidth.list
            : "hidden"
        }`}
      >
        {showAllHeader && (
          <div className="h-14 border-b flex items-center justify-between p-2">
            <div className="font-semibold">{title}</div>

            <div className="flex items-center gap-4">
              {showArchived && viewMode !== "detail" && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="archived"
                    onCheckedChange={(checked) => onShowArchived?.(checked)}
                  />
                  <label htmlFor="archived">Show Archived</label>
                </div>
              )}

              {filterValue?.length > 0 && viewMode !== "detail" && (
                <Button
                  variant="link"
                  className="text-blue-500"
                  onClick={() => {
                    setFilterValue([]);
                    onSearch?.("");
                    onOrder?.({
                      field: "createdAt",
                      direction: "desc",
                    });
                    dispatch(removeEntityListCollection(tableKey ?? ""));
                  }}
                >
                  Reset filters
                </Button>
              )}

              {header}

              {showExport !== false && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        if (check && checkedItems.length === 0) {
                          toast("Please select items to export");
                        } else {
                          setOpened(!opened);
                        }
                      }}
                    >
                      <PrinterIcon className="h-4 w-4 mr-2" />
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToExcel}>
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        )}

        <div
          className={`w-full p-2 ${
            viewMode === "list"
              ? "h-10 flex items-center justify-between"
              : "flex-col gap-2"
          }`}
        >
          <div
            className={`h-full flex items-center ${
              showNewButton === false ? "invisible" : "visible"
            }`}
          >
            <Link href={`${setting?.rootUrl}/new`}>
              <Button className="flex items-center gap-2">
                <PlusCircleIcon className="h-4 w-4" />
                {newButtonText ?? "New"}
              </Button>
            </Link>
          </div>

          <div className="flex gap-2 justify-end">
            <Input
              placeholder="Search here"
              defaultValue={collection?.[0]?.collection?.search ?? ""}
              className={viewMode === "list" ? "w-80" : "w-full"}
              onChange={debounce((e) => onSearch?.(e.target.value), 1000)}
            />

            {setting?.filter && filterMenus !== undefined && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FunnelIcon className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {filterMenus.items?.map((item: any, index: number) => (
                    <DropdownMenuItem key={index}>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {showSelector && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Checkbox
                        checked={check}
                        onCheckedChange={(checked) => {
                          if (check) {
                            setAllChecked(false);
                            setCheck(!check);
                          } else {
                            setCheck(!check);
                          }
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Selector</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <div className="px-2 overflow-x-auto relative">
          <Spinner loading={itemsLoading}>
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  {check && (
                    <th scope="col" className="p-4">
                      <Checkbox
                        checked={allChecked}
                        onCheckedChange={() => setAllChecked(!allChecked)}
                      />
                    </th>
                  )}
                  {setting?.visibleColumn?.map(
                    (col, idx) =>
                      !col.hide && (
                        <th key={idx} className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span>{col.name}</span>
                            {!col.hideSort && (
                              <div className="flex space-x-0">
                                <MoveUpIcon
                                  className={`h-3 w-3 cursor-pointer ${
                                    order.field === col.key &&
                                    order.direction === "asc"
                                      ? "text-blue-500"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setOrder({
                                      field: `${col.key}`,
                                      direction: "asc",
                                    });
                                    onOrder?.({
                                      field: `${col.key}`,
                                      direction: "asc",
                                    });
                                  }}
                                />
                                <MoveDownIcon
                                  className={`h-3 w-3 cursor-pointer ${
                                    order.field === col.key &&
                                    order.direction === "desc"
                                      ? "text-blue-500"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setOrder({
                                      field: `${col.key}`,
                                      direction: "desc",
                                    });
                                    onOrder?.({
                                      field: `${col.key}`,
                                      direction: "desc",
                                    });
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </th>
                      )
                  )}
                  {viewMode === "list" && setting?.showDetail && (
                    <th className="px-6 py-3"></th>
                  )}
                </tr>
              </thead>
              <tbody>
                {items?.map((item: any, idx: number) => (
                  <tr
                    key={idx}
                    onDoubleClick={() => {
                      if (setting?.showDetail) {
                        router.push(
                          `${setting?.detailUrl}/${
                            item?.deletedAt ? "archived" : "active"
                          }/${
                            !Array.isArray(setting?.identity)
                              ? setting?.identity
                                ? item[setting?.identity]
                                : item.id
                              : setting?.identity &&
                                childeView(item, setting?.identity)
                          }`
                        );
                      }
                    }}
                    className={`
                      border-b hover:bg-gray-200 dark:hover:bg-gray-800 
                      ${
                        checkedItems.some(
                          (checkedItem) =>
                            checkedItem.id ===
                            (!Array.isArray(setting?.identity)
                              ? setting?.identity
                                ? checkedItem[setting?.identity]
                                : checkedItem.id
                              : setting?.identity &&
                                childeView(checkedItem, setting?.identity))
                        ) && "bg-blue-50"
                      }
                    `}
                  >
                    {check && (
                      <td className="p-4">
                        <Checkbox
                          checked={checkedItems.some(
                            (checkedItem) =>
                              (!Array.isArray(setting?.identity)
                                ? setting?.identity
                                  ? checkedItem[setting?.identity]
                                  : checkedItem.id
                                : setting?.identity &&
                                  childeView(
                                    checkedItem,
                                    setting?.identity
                                  )) ===
                              (!Array.isArray(setting?.identity)
                                ? setting?.identity
                                  ? item[setting?.identity]
                                  : item.id
                                : setting?.identity &&
                                  childeView(item, setting?.identity))
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCheckedItems([...checkedItems, item]);
                            } else {
                              setCheckedItems(
                                checkedItems.filter(
                                  (checkedItem) =>
                                    (!Array.isArray(setting?.identity)
                                      ? setting?.identity
                                        ? checkedItem[setting?.identity]
                                        : checkedItem.id
                                      : setting?.identity &&
                                        childeView(
                                          checkedItem,
                                          setting?.identity
                                        )) !==
                                    (!Array.isArray(setting?.identity)
                                      ? setting?.identity
                                        ? item[setting?.identity]
                                        : item.id
                                      : setting?.identity &&
                                        childeView(item, setting?.identity))
                                )
                              );
                            }
                          }}
                        />
                      </td>
                    )}
                    {setting?.visibleColumn.map(
                      (col, index) =>
                        !col.hide && (
                          <td
                            key={
                              Array.isArray(col.key)
                                ? col.key.join(".")
                                : col.key
                            }
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            {col.render ? (
                              col.render(item)
                            ) : !Array.isArray(col.key) ? (
                              typeof item[col.key] === "boolean" ? (
                                item[col.key] ? (
                                  <CheckIcon className="h-5 w-5 text-green-500" />
                                ) : (
                                  <MinusIcon className="h-5 w-5 text-red-500" />
                                )
                              ) : col.isDate ? (
                                dateFormat(
                                  item[col.key],
                                  "ddd, mmm d, yyyy, h:MM TT"
                                )
                              ) : (
                                item[col.key]
                              )
                            ) : (
                              childeView(item, col.key)
                            )}
                          </td>
                        )
                    )}
                    {viewMode === "list" && setting?.showDetail && (
                      <td className="px-6 py-4">
                        <ChevronRightIcon
                          className="h-5 w-5 cursor-pointer"
                          onClick={() =>
                            router.push(
                              `${setting?.detailUrl}/${
                                item?.deletedAt ? "archived" : "active"
                              }/${
                                !Array.isArray(setting?.identity)
                                  ? setting?.identity
                                    ? item[setting?.identity]
                                    : item.id
                                  : setting?.identity &&
                                    childeView(item, setting?.identity)
                              }`
                            )
                          }
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Spinner>

          {!items?.length && (
            <div className="w-full flex justify-center items-center h-56">
              <EmptyIcon />
            </div>
          )}
        </div>

        {total > 0 && (
          <div className="flex justify-end p-2">
            <ClientPaginationComponent
              total={total}
              title={title}
              collection={collection?.[0]?.collection}
              onPaginationChange={(skip: number, top: number) =>
                onPaginationChange(skip, top)
              }
            />
          </div>
        )}
      </div>

      {/* detail  view */}
      <div
        className={`${viewMode === "detail" ? "block" : "hidden"} ${
          fullScreen ? "w-full" : detailWidth.content
        } flex-col space-y-2 px-2 h-full overflow-auto`}
      >
        <div className="flex justify-between items-center p-2 h-14 border dark:border-gray-500 dark:bg-gray-500">
          <div className="flex items-center h-full text-sm font-semibold dark:text-white">
            {title}
          </div>
          <div className="flex items-center space-x-2 h-full dark:text-white">
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  onClick={() => setFullScreen(!fullScreen)}
                  className="cursor-pointer"
                >
                  {fullScreen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 fill-current"
                      viewBox="0 0 32 32"
                    >
                      <path d="M4.71875 3.28125L3.28125 4.71875L10.5625 12L5 12L5 14L14 14L14 5L12 5L12 10.5625 Z M 27.28125 3.28125L20 10.5625L20 5L18 5L18 14L27 14L27 12L21.4375 12L28.71875 4.71875 Z M 5 18L5 20L10.5625 20L3.28125 27.28125L4.71875 28.71875L12 21.4375L12 27L14 27L14 18 Z M 18 18L18 27L20 27L20 21.4375L27.28125 28.71875L28.71875 27.28125L21.4375 20L27 20L27 18Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 fill-current dark:fill-white"
                      viewBox="0 0 48 48"
                    >
                      <path d="M7.484375 5.984375 A 1.50015 1.50015 0 0 0 6 7.6914062L6 15.5 A 1.50015 1.50015 0 1 0 9 15.5L9 11.121094L16.439453 18.560547 A 1.50015 1.50015 0 1 0 18.560547 16.439453L11.121094 9L15.5 9 A 1.50015 1.50015 0 1 0 15.5 6L7.6894531 6 A 1.50015 1.50015 0 0 0 7.484375 5.984375 z" />
                    </svg>
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {fullScreen ? "Minimize" : "Maximize"}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  onClick={() =>
                    setting?.rootUrl && router.push(setting.rootUrl)
                  }
                  className="cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 fill-current"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.5 2C2.675781 2 2 2.675781 2 3.5L2 12.5C2 13.324219 2.675781 14 3.5 14L12.5 14C13.324219 14 14 13.324219 14 12.5L14 3.5C14 2.675781 13.324219 2 12.5 2 Z M 3.5 3L12.5 3C12.78125 3 13 3.21875 13 3.5L13 12.5C13 12.78125 12.78125 13 12.5 13L3.5 13C3.21875 13 3 12.78125 3 12.5L3 3.5C3 3.21875 3.21875 3 3.5 3 Z M 5.726563 5.023438L5.023438 5.726563L7.292969 8L5.023438 10.269531L5.726563 10.980469L8 8.707031L10.269531 10.980469L10.980469 10.269531L8.707031 8L10.980469 5.726563L10.269531 5.023438L8 7.292969Z" />
                  </svg>
                </span>
              </TooltipTrigger>
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex space-x-2 min-h-full">{children}</div>
      </div>
      {/* Print Dialog */}
      <Dialog open={opened && printItems.length > 0} onOpenChange={setOpened}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Print Preview</DialogTitle>
          </DialogHeader>

          <div className="overflow-x-auto" ref={pdfRef}>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {setting?.visibleColumn?.map(
                    (col) =>
                      col?.print !== false && (
                        <th key={col.name} className="px-4 py-2 text-left">
                          {col.name}
                        </th>
                      )
                  )}
                </tr>
              </thead>
              <tbody>
                {printItems.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    {setting?.visibleColumn.map(
                      (col) =>
                        col?.print !== false && (
                          <td
                            key={
                              Array.isArray(col.key)
                                ? col.key.join(".")
                                : col.key
                            }
                            className="px-4 py-2"
                          >
                            {col.render ? (
                              col.render(item)
                            ) : !Array.isArray(col.key) ? (
                              typeof item[col.key] === "boolean" ? (
                                item[col.key] ? (
                                  <CheckIcon className="h-4 w-4 text-green-500" />
                                ) : (
                                  <MinusIcon className="h-4 w-4 text-red-500" />
                                )
                              ) : col.isDate ? (
                                dateFormat(
                                  item[col.key],
                                  "ddd, mmm d, yyyy, h:MM TT"
                                )
                              ) : (
                                item[col.key]
                              )
                            ) : (
                              childeView(item, col.key)
                            )}
                          </td>
                        )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button
              className="flex items-center gap-2"
              onClick={() => handlePrint()}
            >
              <PrinterIcon className="h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
