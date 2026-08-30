export function ChevronIcon({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg className="chevron-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {dir === "prev" ? (
        <path
          d="M15.5 5.5 9 12l6.5 6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M8.5 5.5 15 12l-6.5 6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
