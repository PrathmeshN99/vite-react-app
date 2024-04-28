import React, { useState, useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface DataItem {
  _id: string;
  user: string;
  name: string;
  starsReceived: number;
  starsLeft: number;
  text: string;
  hashtags: { [key: string]: number };
  channels: string[];
}

const BasicTable: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [sorting, setSorting] = useState<any[]>([]);
  const [filtering, setFiltering] = useState<string>("");

  useEffect(() => {
    const fetchDataFromServer = async () => {
      try {
        const response = await fetch(
          "https://leaderboard-server.vercel.app/api/data"
        );
        const data: DataItem[] = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data from server:", error);
      }
    };

    fetchDataFromServer();
  }, []);

  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "_id" },
      { header: "User", accessorKey: "user" },
      { header: "Name", accessorKey: "name" },
      { header: "Stars Received", accessorKey: "starsReceived" },
      { header: "Stars Left", accessorKey: "starsLeft" },
      { header: "Text", accessorKey: "text" },
      {
        header: "Hashtags",
        accessorKey: "hashtags",
        cell: ({ getValue }: { getValue: () => { [key: string]: number } }) => {
          const hashtags = getValue();
          if (!hashtags) return null;

          return (
            <div>
              {Object.entries(hashtags).map(([key, value]) => (
                <div key={key}>{`${key}: ${value}`}</div>
              ))}
            </div>
          );
        },
      },
      { header: "Channels", accessorKey: "channels" },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <input
        type="text"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        className="bg-gray-800 text-white px-4 py-2 rounded-md border-none focus:outline-none"
      />
      <table className="w-full table-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-4 py-2 text-left cursor-pointer"
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted()
                        ? header.column.getIsSorted() === "asc"
                          ? "🔼"
                          : "🔽"
                        : null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => table.setPageIndex(0)}
          className="px-4 py-2 rounded-md bg-blue-500 text-white focus:outline-none hover:bg-blue-600"
        >
          First page
        </button>
        <button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          className="px-4 py-2 rounded-md bg-blue-500 text-white focus:outline-none hover:bg-blue-600"
        >
          Previous page
        </button>
        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          className="px-4 py-2 rounded-md bg-blue-500 text-white focus:outline-none hover:bg-blue-600"
        >
          Next page
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          className="px-4 py-2 rounded-md bg-blue-500 text-white focus:outline-none hover:bg-blue-600"
        >
          Last page
        </button>
      </div>
    </div>
  );
};

export default BasicTable;
