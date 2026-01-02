import { BsCalendar } from "react-icons/bs";
import { PiEmpty } from "react-icons/pi";

const Table = ({
    columns=[],
    data,
    pagination,
    headerExtra,
    rowExtra,
    styles = {}
}) => {

    return (
        <div className="bg-white shadow-sm rounded-xl shadow overflow-x-auto">
            <table className={`min-w-full divide-y divide-gray-200 text-xs sm:text-sm`}>
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                                style={{ width: col.width || "auto" }}
                            >
                                {col.label}
                            </th>
                        ))}

                        {/* 🔹 Extra Header Slot */}
                        {headerExtra && (
                            <th className={`${styles.headerExtra || "p-3"}`}>
                                {headerExtra}
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-gray-50"
                            >
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`${styles.cell || "p-3"} ${col.cellClass || ""}`}
                                    >
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}

                                {/* 🔹 Extra Row Slot */}
                                {rowExtra && (
                                    <td className={`${styles.rowExtra || "p-3"}`}>
                                        {rowExtra(row)}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr className={`${styles.emptyRow || ""}`}>
                            <td
                                colSpan={columns.length + (rowExtra ? 1 : 0)}
                                className="p-3 text-center"
                            >
                                <div className={`${styles.emptyWrapper || "flex flex-col items-center justify-center py-20 text-center"}`}>
                                    {/* ✅ Allow custom icon component or icon string */}
                                    {typeof styles.emptyIcon === "string" ? (
                                        <PiEmpty
                                            className={`${styles.icon || "w-16 h-16 mb-4 text-gray-400"}`}
                                        />
                                    ) : (
                                        styles.emptyIcon || (
                                            <BsCalendar
                                                icon="uil:calender"
                                                className="w-16 h-16 mb-4 text-gray-400"
                                            />
                                        )
                                    )}
                                    <h3 className={`${styles.emptyTitle || "text-lg font-semibold text-gray-800"}`}>
                                        {styles.emptyTitleText || "No bookings to display"}
                                    </h3>
                                    <p className={`${styles.emptyText || "text-sm text-gray-500"}`}>
                                        {styles.emptySubText || "You do not have any bookings"}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 🔹 Custom Pagination */}
            {pagination && (
                <div className={`w-full flex-1${styles.paginationWrapper || "mt-4"}`}>
                    {pagination}
                </div>
            )}
        </div>
    );
};

export default Table;