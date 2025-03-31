"use client";

import { useState, useEffect, ReactElement } from "react";
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
import { CollectionQuery } from "@/models/collection.model";

interface PaginationProps {
  total: number;
  title: string | ReactElement<any>;
  onPaginationChange: (skip: number, top: number) => void;
  collection: CollectionQuery | null;
}

export default function ClientPaginationComponent({
  total,
  title,
  onPaginationChange,
  collection,
}: PaginationProps) {
  // Default values
  const defaultTop = collection?.top ?? 10;
  const defaultSkip = collection?.skip ?? 0;

  // State variables
  const [top, setTop] = useState(defaultTop);
  const [skip, setSkip] = useState(defaultSkip);
  const totalPages = Math.ceil(total / top);
  const [currentPage, setCurrentPage] = useState(Math.floor(skip / top) + 1);
  const step = 3; // Number of middle pages to show

  // Notify parent when pagination changes
  useEffect(() => {
    onPaginationChange(skip, top);
  }, [skip, top]);

  // Update pagination state
  const updatePagination = (newPage: number, newPageSize: number = top) => {
    setSkip((newPage - 1) * newPageSize);
    setTop(newPageSize);
    setCurrentPage(newPage);
  };

  const goToPage = (page: number) => updatePagination(page);
  const changePageSize = (size: string) =>
    updatePagination(1, parseInt(size, 10));

  // Pagination range logic
  const startPage = Math.max(2, Math.min(currentPage - 1, totalPages - step));
  const endPage = Math.min(totalPages - 1, Math.max(currentPage + 1, step));
  const showLeftEllipsis = startPage > 2;
  const showRightEllipsis = endPage < totalPages - 1;

  // Helper function to render pagination items
  const renderPaginationItem = (page: number, isActive: boolean) => (
    <PaginationItem key={page}>
      <PaginationLink isActive={isActive} onClick={() => goToPage(page)}>
        {page}
      </PaginationLink>
    </PaginationItem>
  );

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
              <PaginationLink onClick={() => goToPage(currentPage - 1)}>
                &lt;
              </PaginationLink>
            </PaginationItem>
          )}

          {/* First Page */}
          {renderPaginationItem(1, currentPage === 1)}

          {/* Left Ellipsis */}
          {showLeftEllipsis && (
            <PaginationItem>
              <PaginationEllipsis onClick={() => goToPage(startPage - step)} />
            </PaginationItem>
          )}

          {/* Middle Pages */}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => renderPaginationItem(page, page === currentPage))}

          {/* Right Ellipsis */}
          {showRightEllipsis && (
            <PaginationItem>
              <PaginationEllipsis onClick={() => goToPage(endPage + step)} />
            </PaginationItem>
          )}

          {/* Last Page */}
          {totalPages > 1 &&
            renderPaginationItem(totalPages, currentPage === totalPages)}

          {/* Next Button */}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => goToPage(currentPage + 1)}>
                &gt;
              </PaginationLink>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      {/* Page Size Selector */}
      <Select value={top.toString()} onValueChange={changePageSize}>
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
