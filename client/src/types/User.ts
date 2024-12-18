export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: "Female" | "Male";
  city: string;
  role: "user" | "admin";
  birthDate: string;
  phoneNumber: string;
  interests: string[];
  points: number;
  createdAt: string;
  updatedAt: string;
};
