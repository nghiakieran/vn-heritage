import { cn } from "~/lib/utils";

const Input = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        "w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  );
};

export { Input };
