import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  TableOptions,
} from "@tanstack/react-table";
import { useMemo, useEffect, useState } from "react";

interface HashtagsObject {
  [key: string]: number;
}

interface DataItem {
  _id: string;
  user: string;
  name: string;
  starsReceived: number;
  starsLeft: number;
  text: string;
  hashtags: HashtagsObject;
  channels: string[];
}

const BasicTable = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Started");
    const fetchDataFromServer = async () => {
      try {
        console.log("Fetching data from server...");
        setIsLoading(true);

        const response = await fetch(
          "https://leaderboard-server.vercel.app/api/data"
        );
        const data: DataItem[] = await response.json();

        setData(data);
        console.log("Data fetched from server:", data);
      } catch (error) {
        console.error("Error fetching data from server:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataFromServer();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "_id",
      },
      {
        header: "User",
        accessorKey: "user",
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Stars Received",
        accessorKey: "starsReceived",
      },
      {
        header: "Stars Left",
        accessorKey: "starsLeft",
      },
      {
        header: "Text",
        accessorKey: "text",
      },
      {
        header: "Hashtags",
        accessorKey: "hashtags",
      },
      {
        header: "Channels",
        accessorKey: "channels",
      },
    ],
    []
  );

  const options: TableOptions<DataItem> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  };

  const table = useReactTable(options);

  return (
    <div>
      {isLoading ? (
        <p>Loading data from server...</p>
      ) : (
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
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
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BasicTable;
