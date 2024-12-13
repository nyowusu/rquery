import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import {
  generateUserAppointmentKeys,
  generateUserKey,
} from "@/react-query/keyFactories";

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

export function useUser() {
  const queryClient = useQueryClient();

  // get details on the userID
  const { userId, userToken } = useLoginData();

  // call useQuery to update user data from server
  const { data: user } = useQuery({
    enabled: !!userId,
    queryKey: generateUserKey(userId, userToken),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity,
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // update the user in the query cache
    queryClient.setQueryData(generateUserKey(userId, userToken), newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // reset user to null in query cache
    queryClient.removeQueries({ queryKey: generateUserKey(userId, userToken) });
    queryClient.removeQueries({
      queryKey: generateUserAppointmentKeys(userId, userToken),
    });
  }

  return { user, updateUser, clearUser };
}
