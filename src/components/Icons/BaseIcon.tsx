import React, { FC } from "react";

// List of icons
import LinkedIn from "./LinkedIn";
import Behance from "./Behance";
import Instagram from "./Instagram";
import Dribbble from "./Dribbble";
import ExternalLink from "./ExternalLink";

type Props = {
  icon?: "LinkedIn" | "Behance" | "Instagram" | "Dribbble" | "ExternalLink";
  size?: string;
  width?: string;
  height?: string;
  viewBox?: string;
  color?: string;
  hover?: string;
  bounce?: boolean;
};

const defaultProps: Props = {
  icon: "LinkedIn",
  size: "16",
  width: "",
  height: "",
  viewBox: "",
  color: "black",
  hover: "",
  bounce: false,
};

const BaseIcon: FC<Props> = ({
  icon,
  size,
  width,
  height,
  viewBox,
  color,
  hover,
  bounce,
}: Props) => {
  if (!icon) return null;
  const components = {
    LinkedIn,
    Behance,
    Instagram,
    Dribbble,
    ExternalLink,
  };

  const Icon = components[icon];
  const finalViewBox =
    width && height ? `0 0 ${width} ${height}` : viewBox || size;
  const finalSize = size || "16";
  const finalColor = color || "black";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || finalSize}
      height={height || finalSize}
      viewBox={`0 0 ${finalViewBox} ${finalViewBox}`}
      className={`base-icon fill-current text-${finalColor} ${
        hover ? `hover:text-${hover}` : ""
      } ${bounce ? "has-bounce" : "no-bounce"}`}
    >
      <Icon />
    </svg>
  );
};
BaseIcon.defaultProps = defaultProps;
export default BaseIcon;
