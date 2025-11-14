interface SelectProps<T> {
  label?: string;
  items: string[] | number[] | { [key: string]: string | number }[];
  onChange: (value: T) => void;
}

const termMap: { [key: string]: string } = {
  "FA": "Fall",
  "SP": "Spring",
  "SU": "Summer"
};

// simple select component for now, generalizes object so that it can iterate through it like
// a list and ignore the key name...
// takes in a label, list of objects used to display each option, and an onChange function
// which will just be a useState and change the associated state to the selected value
export default function Select<T>({ label, items, onChange }: SelectProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <select
        className="border-1 w-65"
        onChange={(e) => {onChange(e.target.value as T)}}
      >
        {
          (items.length <= 0) ? (
            <option key={"none"} value={""}>No options available</option>
          ) : (
            items.map((item, index) => {
              let val;
              if (typeof item == "string") {
                val = item;
              } else {
                val = Object.values(item)[0];
              }
              //?? means if val is null default to index as key
              //conditional rendering if label is "Terms", map value to full term name otherwise just show value
              return (
                <option key={val ?? index} value={val}>
                  {(label == "Terms") ? termMap[val] : val}
                </option>
              );
            })
          )
        }
      </select>
    </div>
  );
}
