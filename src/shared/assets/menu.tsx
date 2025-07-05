import { FC, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  className?: string;
}
export const Menu: FC<Props> = ({ className, ...props }: Props) => {
  return (
    <svg
      {...props}
      className={className}
      width="37"
      height="22"
      viewBox="0 0 37 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 21H18" stroke="white" strokeLinecap="round" />
      <path d="M1 10.5H36" stroke="white" strokeLinecap="round" />
      <path d="M18 1L36 0.999998" stroke="white" strokeLinecap="round" />
    </svg>
  );
};
