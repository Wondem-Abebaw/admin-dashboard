"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
  total: number; // Total number of records
  title?: string;
  defaultSkip: number;
  defaultTop: number;
}

export default function ServerPaginationComponent({
  total,
  title,
  defaultSkip,
  defaultTop,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const PAGE_SIZES = [10, 20, 50, 100];

  // Read URL params or use defaults
  const [top, setTop] = useState(
    parseInt(params.get("top") || `${defaultTop}`, 10)
  );
  const [skip, setSkip] = useState(
    parseInt(params.get("skip") || `${defaultSkip}`, 10)
  );

  const totalPages = Math.ceil(total / top);
  const currentPage = Math.floor(skip / top) + 1;
  console.log("totalPages", totalPages);

  useEffect(() => {
    setSkip(parseInt(params.get("skip") || `${defaultSkip}`, 10));
    setTop(parseInt(params.get("top") || `${defaultTop}`, 10));
  }, [searchParams]);

  const updatePagination = (newPage: number, newTop: number) => {
    const newSkip = (newPage - 1) * newTop;
    params.set("skip", newSkip.toString());
    params.set("top", newTop.toString());

    replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    updatePagination(page, top);
  };

  const handlePageSizeChange = (newTop: number) => {
    updatePagination(1, newTop); // Reset to first page when page size changes
  };

  // Pagination range display
  const startItem = Math.min(skip + 1, total);
  const endItem = Math.min(skip + top, total);

  return (
    <div className="flex items-center justify-between space-x-4">
      {/* Pagination Info */}
      <span className="text-sm font-medium w-full">
        {startItem}-{endItem} of {total} {title}
      </span>

      {/* Pagination Component */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </Button>
          </PaginationItem>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 3)
            .map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

          {/* Ellipsis for large sets */}
          {totalPages > 5 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              &gt;
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Page Size Selector */}
      <Select
        value={top.toString()}
        onValueChange={(value) => handlePageSizeChange(Number(value))}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Page Size" />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZES.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size} / page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
