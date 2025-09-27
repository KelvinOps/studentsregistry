import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

// Generic type for table row data
type TableRowData = Record<string, unknown>;

interface Column<T = TableRowData> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T = TableRowData> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  filterOptions?: { key: string; label: string; options: { value: string; label: string }[] }[];
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  className?: string;
  "data-testid"?: string;
}

export default function DataTable<T extends TableRowData = TableRowData>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  filterable = false,
  filterOptions = [],
  pagination = true,
  pageSize = 10,
  onRowClick,
  className = "",
  "data-testid": testId,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data
  const filteredData = data.filter((row) => {
    // Search filter
    if (searchQuery) {
      const searchableText = columns
        .map(col => String(row[col.key] || ""))
        .join(" ")
        .toLowerCase();
      if (!searchableText.includes(searchQuery.toLowerCase())) {
        return false;
      }
    }

    // Column filters
    for (const [key, value] of Object.entries(filters)) {
      if (value && String(row[key]) !== value) {
        return false;
      }
    }

    return true;
  });

  // Sort data
  const sortedData = sortField 
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        // Convert to strings for comparison to handle mixed types safely
        const aStr = String(aValue);
        const bStr = String(bValue);
        
        let comparison = 0;
        if (aStr > bStr) comparison = 1;
        if (aStr < bStr) comparison = -1;
        
        return sortDirection === "desc" ? -comparison : comparison;
      })
    : filteredData;

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = pagination 
    ? sortedData.slice(startIndex, startIndex + pageSize)
    : sortedData;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className={className} data-testid={testId}>
      {/* Search and Filters */}
      {(searchable || filterable) && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {searchable && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                  data-testid={`${testId}-search`}
                />
              </div>
            )}
            
            {filterable && filterOptions.map((filter) => (
              <Select
                key={filter.key}
                onValueChange={(value) => handleFilterChange(filter.key, value)}
                data-testid={`${testId}-filter-${filter.key}`}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All {filter.label}</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key}
                  className={column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => column.sortable && handleSort(column.key)}
                  data-testid={`${testId}-header-${column.key}`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && sortField === column.key && (
                      <span className="text-primary">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="text-center py-8 text-muted-foreground"
                  data-testid={`${testId}-empty`}
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow 
                  key={index}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onRowClick?.(row)}
                  data-testid={`${testId}-row-${index}`}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} data-testid={`${testId}-cell-${index}-${column.key}`}>
                      {column.render 
                        ? column.render(row[column.key], row)
                        : String(row[column.key] || "")
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              data-testid={`${testId}-prev-page`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              data-testid={`${testId}-next-page`}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}