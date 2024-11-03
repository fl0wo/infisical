import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

export const consumerSecretKeys = {
  forOrganizationConsumerSecrets: (organizationId: string) => ["consumer-secrets", organizationId] as const,
};

export const useOrganizationConsumerSecrets = (organizationId: string) => {
  return useQuery({
    queryKey: consumerSecretKeys.forOrganizationConsumerSecrets(organizationId),
    queryFn: async () => {
      const { data } = await apiRequest.get(`/api/v3/consumer-secrets/${organizationId}`);
      return data;
    },
    staleTime: 0,
  });
};