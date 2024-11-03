import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";
import {TConsumerSecretFetched, TConsumerSecretFetchedResponse} from "@app/hooks/api/consumer-secrets/types";

export const consumerSecretKeys = {
  forOrganizationConsumerSecrets: (organizationId: string) => ["consumer-secrets", organizationId] as const,
  forOrganizationConsumerSecret: (consumerSecretId: string) => ["consumer-secrets", consumerSecretId] as const,
};

export const useOrganizationConsumerSecrets = (organizationId?: string) => {
  return useQuery({
    queryKey: consumerSecretKeys.forOrganizationConsumerSecrets(organizationId!),
    queryFn: async () => {
      const { data } = await apiRequest.get(`/api/v3/consumer-secrets/list/${organizationId}`);
      return data;
    },
    select: (data) => data.consumerSecrets
        // todo: sort on backend side instead
        ?.toSorted((a:TConsumerSecretFetched, b:TConsumerSecretFetched) => new Date(b.createdAt ?? Date.now()).getTime() - new Date(a.createdAt ?? Date.now()).getTime()) as TConsumerSecretFetchedResponse["consumerSecrets"],
    staleTime: 0,

    enabled: !!organizationId,
  });
};

export const useOrganizationConsumerSecret = (consumerSecretId?: string) => {
  return useQuery({
    queryKey: consumerSecretKeys.forOrganizationConsumerSecret(consumerSecretId!),
    queryFn: async () => {
      const { data } = await apiRequest.get(`/api/v3/consumer-secrets/get/${consumerSecretId}`);
      return data;
    },
    select: (data) => data.consumerSecret as TConsumerSecretFetched,
    staleTime: 0,

    enabled: !!consumerSecretId,
  });
};