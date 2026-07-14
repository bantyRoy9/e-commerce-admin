interface Props {
  text: string;
  loading?: boolean;
  onClick: () => void;
}

export default function Button({
  text,
  loading,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="
      w-full
      bg-green-600
      hover:bg-green-700
      text-white
      rounded-xl
      h-12
      font-semibold
      transition
      "
    >
      {loading ? "Please wait..." : text}
    </button>
  );
}