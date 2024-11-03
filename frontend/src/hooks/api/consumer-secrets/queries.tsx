import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";
import {TConsumerSecretFetched, TConsumerSecretFetchedResponse} from "@app/hooks/api/consumer-secrets/types";

export const consumerSecretKeys = {
  forOrganizationConsumerSecrets: (organizationId: string) => ["consumer-secrets", organizationId] as const,
};

export const useOrganizationConsumerSecrets = (organizationId?: string) => {
  return useQuery({
    queryKey: consumerSecretKeys.forOrganizationConsumerSecrets(organizationId!),
    queryFn: async () => {
      const { data } = await apiRequest.get(`/api/v3/consumer-secrets/${organizationId}`);
      return data;
    },
    select: (data) => data.consumerSecrets
        ?.toSorted((a:TConsumerSecretFetched, b:TConsumerSecretFetched) => new Date(b.createdAt ?? Date.now()).getTime() - new Date(a.createdAt ?? Date.now()).getTime()) as TConsumerSecretFetchedResponse["consumerSecrets"],
    staleTime: 0,

    enabled: !!organizationId,
  });
};