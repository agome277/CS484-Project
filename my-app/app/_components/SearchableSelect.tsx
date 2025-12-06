import { useState, useMemo, useEffect, useRef } from "react";

interface SearchableSelectProps<T> {
  label?: string;
  items: T[];
  value: T;
  onChange: (value: T) => void;
  getOptionText?: (item: T) => string;
}

export default function SearchableSelect<T>({
  label, // label for search box
  items, // full list of items to select from
  value, // current value
  onChange, // callback when selection changes
  getOptionText = (item) => String(item), // optional formatting function, defaults to string conversion
}: SearchableSelectProps<T>) {
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const selectRef = useRef<HTMLSelectElement>(null);

  // filters list based on search
  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter((item) =>
      getOptionText(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, items]);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Auto select the first item when search results change
  useEffect(() => {
    if (search && filteredItems.length > 0) {
      onChangeRef.current(filteredItems[0]);
    }
  }, [search, filteredItems]);

  // used to preserve searches, finds an initial value passed from parent
  useEffect(() => {
    const idx = items.findIndex(
      (i) => getOptionText(i) === getOptionText(value)
    );
    if (idx !== -1) setHighlightIndex(idx);
  }, [value, items]);

  // keeps current value highlighted on filtering or defaults to first item
  useEffect(() => {
    const idx = filteredItems.findIndex(
      (i) => getOptionText(i) === getOptionText(value)
    );

    if (idx !== -1) {
      setHighlightIndex(idx);
    } else {
      setHighlightIndex(0);
    }
  }, [filteredItems, value]);

  // matches highlight/select to index
  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.selectedIndex = highlightIndex;
    }
  }, [highlightIndex]);

  // handles key presses to select item with keyboard
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault(); // prevent cursor moving inside input
      setHighlightIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      onChangeRef.current(filteredItems[highlightIndex]);
    }
  };

  return (
    <div className="flex flex-col gap-2 relative w-80">
      {label && <label>{label}</label>}
      {/* Search bar */}
      <input
        className="border px-2 py-1"
        placeholder={`Search ${label?.toLowerCase()}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {/* Options list */}
      <select
        className="border px-2 py-1 mt-1"
        size={5}
        value={
          filteredItems[highlightIndex]
            ? getOptionText(filteredItems[highlightIndex])
            : ""
        } // selected/highlighted item formatted correctly
        onChange={() => {}}
      >
        {filteredItems.length === 0 ? (
          <option disabled>No matches</option>
        ) : (
          filteredItems.map((item, index) => (
            <option
              key={index}
              value={getOptionText(item)}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(item); // handles selection, accounts for first item selection issue
                setHighlightIndex(index); // mouse selected item index saved
              }}
            >
              {getOptionText(item)}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
