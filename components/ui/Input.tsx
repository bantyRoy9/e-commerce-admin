interface Props {
  label: string;

  type?: string;

  value: string;

  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  placeholder?: string;
}

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <div className="mb-5">

      <label className="block mb-2 text-sm font-medium">
        {label}
      </label>

      <input
        className="
        w-full
        border
        rounded-xl
        h-12
        px-4
        outline-none
        focus:border-green-600
        "
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

    </div>
  );
}