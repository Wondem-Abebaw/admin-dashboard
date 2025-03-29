"use client";

import { useState, useEffect } from "react";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

interface PaginationProps {
  total: number;
  title: string;
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

  // State initialization using default values or URL parameters
  const [top, setTop] = useState(
    parseInt(params.get("top") || `${defaultTop}`, 10)
  );
  const [skip, setSkip] = useState(
    parseInt(params.get("skip") || `${defaultSkip}`, 10)
  );

  const totalPages = Math.ceil(total / top);
  const [currentPage, setCurrentPage] = useState(Math.floor(skip / top) + 1);
  const step = 3; // Number of middle pages to show

  // Update currentPage when skip/top changes
  useEffect(() => {
    setCurrentPage(Math.floor(skip / top) + 1);
  }, [skip, top]);

  // Update URL parameters & state
  const updatePagination = (newPage: number, newPageSize?: number) => {
    const newSkip = (newPage - 1) * (newPageSize || top);
    params.set("skip", newSkip.toString());
    params.set("top", (newPageSize || top).toString());
    replace(`${pathname}?${params.toString()}`);

    setSkip(newSkip);
    if (newPageSize) setTop(newPageSize);
    setCurrentPage(newPage);
  };

  // Handle page navigation
  const handlePageChange = (page: number) => {
    updatePagination(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: string) => {
    updatePagination(1, parseInt(size, 10));
  };

  // Pagination range logic
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage === 1) {
    endPage = Math.min(totalPages - 1, step);
  }
  if (currentPage === totalPages) {
    startPage = Math.max(2, totalPages - step + 1);
  }

  const showLeftEllipsis = startPage > 2;
  const showRightEllipsis = endPage < totalPages - 1;

  return (
    <div className="flex items-center space-x-4">
      {/* Show range info */}
      <span className="text-sm w-full flex flex-nowrap">
        {skip + 1}-{Math.min(skip + top, total)} of {total} {title}
      </span>

      {/* Pagination Controls */}
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                &lt;
              </PaginationLink>
            </PaginationItem>
          )}

          {/* First Page Always Visible */}
          <PaginationItem>
            <PaginationLink
              isActive={currentPage === 1}
              onClick={() => handlePageChange(1)}
            >
              1
            </PaginationLink>
          </PaginationItem>

          {/* Left Ellipsis */}
          {showLeftEllipsis && (
            <PaginationItem>
              <PaginationEllipsis
                onClick={() => handlePageChange(startPage - step)}
              />
            </PaginationItem>
          )}

          {/* Middle Pages */}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Right Ellipsis */}
          {showRightEllipsis && (
            <PaginationItem>
              <PaginationEllipsis
                onClick={() => handlePageChange(endPage + step)}
              />
            </PaginationItem>
          )}

          {/* Last Page Always Visible */}
          {totalPages > 1 && (
            <PaginationItem>
              <PaginationLink
                isActive={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Next Button */}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                &gt;
              </PaginationLink>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      {/* Page Size Selector */}
      <Select value={top.toString()} onValueChange={handlePageSizeChange}>
        <SelectTrigger className="w-24">
          <SelectValue placeholder={`${top} / page`} />
        </SelectTrigger>
        <SelectContent>
          {[10, 20, 50, 100].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size} / page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
