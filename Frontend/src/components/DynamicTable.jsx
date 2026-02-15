import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";

const DynamicTable = ({
  data = [],
  columnConfig = {},
  handleUpdate = () => {},
  handleDelete = () => {},
  page = 1, // current backend page (1-based)
  totalRecords = 0, // total items from backend
  onPageChange = () => {},
}) => {
  const columns = useMemo(
    () =>
      Object.keys(columnConfig).map((key) => ({
        accessorKey: key,
        header: columnConfig[key]?.label || key,
        Cell: ({ cell, row }) =>
          columnConfig[key]?.render
            ? columnConfig[key].render(cell.getValue(), row.original)
            : cell.getValue() || "--",
      })),
    [columnConfig]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableSorting: true,
    manualPagination: true, // you control pagination via backend
    enableColumnActions: false,
    enableDensityToggle: false,
    rowCount: totalRecords, // correct total count for pagination

    muiTablePaperProps: {
      elevation: 0,
      sx: { border: "1px solid #e5e7eb", borderRadius: "8px" },
    },
    muiTableBodyProps: {
      sx: { "& tr:hover": { backgroundColor: "#f9fafb" } },
    },
    muiTableHeadCellProps: {
      sx: { backgroundColor: "#000", color: "#fff", textAlign: "center" },
    },
    muiTableBodyCellProps: {
      sx: { textAlign: "center" },
    },
    muiPaginationProps: {
      shape: "rounded",
      variant: "outlined",
      color: "standard",
    },

    // Controlled pagination
    state: {
      pagination: { pageIndex: page - 1, pageSize: 10 },
    },
    onPaginationChange: (updater) => {
      const newPage = typeof updater === "function" ? updater({ pageIndex: page - 1 }).pageIndex + 1 : updater.pageIndex + 1;
      if (newPage !== page) onPageChange(newPage);
    },
  });

  return (
    <Box sx={{ mt: 2 }}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default DynamicTable;
