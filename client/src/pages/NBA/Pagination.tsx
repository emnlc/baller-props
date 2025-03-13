export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const MAX_VISIBLE_PAGES = 7;

  const getPageNumbers = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const half = Math.floor((MAX_VISIBLE_PAGES - 2) / 2);

    if (currentPage <= half + 2) {
      pages.push(
        ...Array.from({ length: MAX_VISIBLE_PAGES - 2 }, (_, i) => i + 1)
      );
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - half - 1) {
      pages.push(1);
      pages.push("...");
      pages.push(
        ...Array.from(
          { length: MAX_VISIBLE_PAGES - 2 },
          (_, i) => totalPages - (MAX_VISIBLE_PAGES - 3) + i
        )
      );
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(
        ...Array.from(
          { length: MAX_VISIBLE_PAGES - 4 },
          (_, i) => currentPage - half + i
        )
      );
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center  justify-center gap-2 p-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center bg-background-700 border border-background-600 hover:bg-background-600 text-xs text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        ‹
      </button>

      {/* Page Buttons */}
      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="w-8 h-8 flex items-center justify-center text-white"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            className={`w-8 h-8 ${
              currentPage === page
                ? "bg-accent-500 hover:bg-accent-400 border-accent-600 text-white"
                : "bg-background-700 hover:bg-background-600"
            } border border-background-600 text-xs rounded-lg transition-all`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center bg-background-700 border border-background-600 hover:bg-background-600 text-xs text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        ›
      </button>
    </div>
  );
};
