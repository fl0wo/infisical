import {useMutation, useQueryClient} from "@tanstack/react-query";

import {apiRequest} from "@app/config/request";
import {consumerSecretKeys} from "@app/hooks/api/consumer-secrets/queries";
import {TConsumerSecret, TCreateConsumerSecretRequest} from "@app/hooks/api/consumer-secrets/types";

/*
Create REST endpoints to handle the following operations:
Create: Add a new set of credentials.
Read: Retrieve the list of saved credentials.
Update: Modify existing credentials.
Delete: Remove credentials.
 */

export const useCreateOrganizationConsumerSecret = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({organizationId, name, content}: {
            organizationId: string;
            name: string;
            note?: string;
            content: TConsumerSecret;
        }) => {
            const {data} = await apiRequest.post(`/api/v1/organization/${organizationId}/consumer-secrets`, {
                name,
                content
            });
            return data;
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries(consumerSecretKeys.forOrganizationConsumerSecrets(organizationId));
        }
    });
};
export const useUpdateOrganizationConsumerSecret = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
                               organizationId,
                               id,
                               name,
                               content
                           }: TCreateConsumerSecretRequest) => {
            const {data} = await apiRequest.patch(`/api/v1/organization/${organizationId}/consumer-secrets/${id}`, {
                name,
                content
            });
            return data;
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries(consumerSecretKeys.forOrganizationConsumerSecrets(organizationId));
        }
    });
};

export const useDeleteOrganizationConsumerSecret = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               organizationId,
                               id
                           }: {
            organizationId: string;
            id: string;
        }) => {
            const {data} = await apiRequest.delete(`/api/v1/organization/${organizationId}/consumer-secrets/${id}`);
            return data;
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries(consumerSecretKeys.forOrganizationConsumerSecrets(organizationId));
        }
    });
};
