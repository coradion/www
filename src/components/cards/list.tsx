import { VoidFunctionComponent } from "react";

type ListItemProps = {
  id: string;
  label: string;
};

const ListItem: VoidFunctionComponent<ListItemProps> = ({ label }) => (
  <li>{label}</li>
);

const mapToItem = (item: ListItemProps) => <ListItem key={item.id} {...item} />;

type ListProps = {
  id: string;
  label: string;
  items: ListItemProps[];
};

export const List: VoidFunctionComponent<ListProps> = ({ label, items }) => {
  return (
    <>
      {label}
      <ul>{items.map(mapToItem)}</ul>
    </>
  );
};
