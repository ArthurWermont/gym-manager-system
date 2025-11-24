interface Column {
  header: string;
  accessor: string;
}

interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
}

export default function Table({ columns, data }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/60">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="bg-neutral-800/70 text-gray-400 uppercase text-xs tracking-wide">
          <tr>
            {columns.map(col => (
              <th key={col.accessor} className="px-4 py-3 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-t border-neutral-800 hover:bg-neutral-800/50 transition"
            >
              {columns.map(col => (
                <td key={col.accessor} className="px-4 py-3">
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
