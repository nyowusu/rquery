import { useQuery } from "@tanstack/react-query";

import type { Appointment } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";

import { useLoginData } from "@/auth/AuthContext";
import { generateUserAppointmentKeys } from "@/react-query/keyFactories";

// for when we need a query function for useQuery
async function getUserAppointments(
  userId: number,
  userToken: string
): Promise<Appointment[] | null> {
  const { data } = await axiosInstance.get(`/user/${userId}/appointments`, {
    headers: getJWTHeader(userToken),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  const { userId, userToken } = useLoginData();
  // replace with React Query

  const fallback: Appointment[] = [];
  const { data: userAppointments = fallback } = useQuery({
    enabled: !!userId,
    queryKey: generateUserAppointmentKeys(userId, userToken),
    queryFn: () => getUserAppointments(userId, userToken),
  });
  return userAppointments;
}
