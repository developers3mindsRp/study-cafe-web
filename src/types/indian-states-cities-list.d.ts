declare module "indian-states-cities-list" {
  interface StateItem {
    label: string;
    value: string;
  }

  const IndianStatesList: {
    STATES_OBJECT: StateItem[];
  };

  export default IndianStatesList;
}
