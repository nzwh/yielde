import { cn } from "@/lib/utils";
import { MdCheck } from "react-icons/md";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  name?: string;
}

export function Checkbox({
  checked,
  onChange,
  id = "terms",
  name = "terms",
}: CheckboxProps) {
  return (
    <div className="relative flex">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={cn(
          "border-[#EDEDED] bg-white checked:bg-[#798BFF] hover:bg-[#B7B7B7] hover:checked:bg-[#3B4ACF]",
          "peer size-3.5 cursor-pointer appearance-none rounded-sm border transition-all duration-200 ease-in-out focus-visible:ring-1 focus-visible:ring-[#8290EF] focus-visible:outline-none",
        )}
      />
      <MdCheck className="pointer-events-none absolute inset-0 size-3.5 text-white opacity-0 peer-checked:opacity-100" />
    </div>
  );
}
