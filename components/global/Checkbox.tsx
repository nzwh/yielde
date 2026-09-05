import { cn } from "@/lib/utils";
import { MdCheck } from "react-icons/md";

export const Checkbox = () => (
  <div className="relative flex">
    <input
      type="checkbox"
      id="terms"
      name="terms"
      required
      className={cn(
        "border-[#EDEDED] bg-white checked:bg-[#798BFF] hover:bg-[#B7B7B7] hover:checked:bg-[#3B4ACF] focus-visible:ring-[#8290EF]",
        "peer size-3.5 cursor-pointer appearance-none rounded-sm border transition-all duration-200 ease-in-out focus-visible:ring-1 focus-visible:outline-none",
      )}
    />
    <MdCheck className="pointer-events-none absolute inset-0 size-3.5 text-white opacity-0 peer-checked:opacity-100" />
  </div>
);
