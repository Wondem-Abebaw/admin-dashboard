import React from 'react';
import { 
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
  }[];
  onRowClick?: (item: T) => void;
}

export function Table<T extends { id: string | number }>({ 
  data, 
  columns, 
  onRowClick 
}: TableProps<T>) {
  return (
    <div className="w-full overflow-auto">
      <ShadcnTable>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow 
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'cursor-pointer' : ''}
            >
              {columns.map((column, index) => (
                <TableCell key={index}>
                  {column.render 
                    ? column.render(item[column.accessor], item)
                    : item[column.accessor] as React.ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </ShadcnTable>
    </div>
  );
}
