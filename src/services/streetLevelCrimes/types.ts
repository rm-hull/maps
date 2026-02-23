export type StreetLevelCrime = {
  category: string;
  persistent_id: string;
  month: string;
  location: Location;
  context: string;
  id: number;
  location_type: string;
  location_subtype: string;
  outcome_status?: OutcomeStatus;
};

export type Location = {
  latitude: string;
  longitude: string;
  street: {
    id: number;
    name: string;
  };
};

export type OutcomeStatus = {
  category: string;
  date: string;
};
