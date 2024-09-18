import { FunctionComponent } from "react";

type ListItemProps = {
  id: string;
  label: string;
};

const ListItem: FunctionComponent<ListItemProps> = ({ label }) => (
  <li>{label}</li>
);

const mapToItem = (item: ListItemProps) => <ListItem key={item.id} {...item} />;

type ListProps = {
  id: string;
  label: string;
  items: ListItemProps[];
};

export const List: FunctionComponent<ListProps> = ({ label, items }) => {
  return (
    <>
      {label}
      <ul>{items.map(mapToItem)}</ul>
    </>
  );
};
