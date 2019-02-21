export interface ICoordinates {
  x: number;
  y: number;
}

export interface ITabBodyScrollerProps<IContentItem> {
  titles: string[];
  content: IContentItem[];
  activeColors: string[];
  inactiveColors: string[];
  renderBodyItem: (contentItem: IContentItem, index: number) => React.ReactNode;
}
