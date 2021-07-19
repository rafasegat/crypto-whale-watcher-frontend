import React, { FC } from "react";
import BaseIcon from "components/Icons/BaseIcon";

type TypeList = {
  title: string;
  link: string;
  image: string;
};

type Props = {
  list: TypeList[];
  cols?: number;
};

const defaultProps: Props = {
  list: [{ title: "", link: "", image: "" }],
  cols: 0,
};

const GridImage: FC<Props> = ({ list, cols }: Props) => {
  return (
    <div className="grid-image-link">
      <ul>
        {list.map((item) => {
          return (
            <li key={item.image}>
              <a href={item.link} target="_blank">
                <img src={`../images/${item.image}`} />
                <h3>
                  {item.title}
                  <BaseIcon
                    icon="ExternalLink"
                    width="17.111"
                    height="17.113"
                  />
                </h3>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

GridImage.defaultProps = defaultProps;
export default GridImage;
