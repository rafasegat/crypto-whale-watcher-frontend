import React, { FC } from "react";

type TypeList = {
  image: string;
};

type Props = {
  list: TypeList[];
  cols?: number;
};

const defaultProps: Props = {
  list: [{ image: "" }],
  cols: 0,
};

const GridImage: FC<Props> = ({ list, cols }: Props) => {
  return (
    <div className="grid-image">
      <ul>
        {list.map((item) => {
          return (
            <li key={item.image}>
              <img src={`../images/${item.image}`} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

GridImage.defaultProps = defaultProps;
export default GridImage;
