export type Event = {
  id: number;
  name: string;
  date: string;
  time: string;
  description: string;
  location: string;
  category: string;
  createdBy: string;
  createdAt: string;
  isApproved: boolean;
  creator: {
    firstName: string;
    lastName: string;
  };
  personalized: boolean;
};
