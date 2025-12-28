import { LucideIcon } from "lucide-react";

interface SubHeadingProps {
  title: string;
  Icon?: LucideIcon; // optional icon
  className?: string;
}

const SubHeading: React.FC<SubHeadingProps> = ({
  title,
  Icon,
  className = "",
}) => {
  return (
    <h2
      className={`flex items-center gap-1 text-base font-medium text-gray-900 mb-4 ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 text-gray-900" />}
      {title}
    </h2>
  );
};

export default SubHeading;
