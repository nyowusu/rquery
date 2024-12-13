import { queryKeys } from "./constants";

export const generateUserKey = (userId: number, token: string) => {
  // user token has been deliberately removed from the query key
  // so that the key remains the same for the user data
  return [queryKeys.user, userId];
};

export const generateUserAppointmentKeys = (userId: number, token: string) => {
  return [queryKeys.appointments, queryKeys.user, userId, token];
};
