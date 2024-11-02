import {useMutation, useQueryClient} from "@tanstack/react-query";

import {apiRequest} from "@app/config/request";
import {consumerSecretKeys} from "@app/hooks/api/consumer-secrets/queries";
import {TConsumerSecret, TCreateConsumerSecretRequest} from "@app/hooks/api/consumer-secrets/types";


export const useCreateOrganizationConsumerSecret = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({organizationId, name, note, content}: {
            organizationId: string;
            name: string;
            note?: string;
            content: TConsumerSecret;
        }) => {
            const {data} = await apiRequest.post(`/api/v1/organization/${organizationId}/consumer-secrets`, {
                name,
                note,
                content
            });
            return data;
        },
        onSuccess: (_, {organizationId}) => {
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
                               note,
                               content
                           }: TCreateConsumerSecretRequest) => {
            const {data} = await apiRequest.patch(`/api/v1/organization/${organizationId}/consumer-secrets/${id}`, {
                name,
                note,
                content
            });
            return data;
        },
        onSuccess: (_, {organizationId}) => {
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
        onSuccess: (_, {organizationId}) => {
            queryClient.invalidateQueries(consumerSecretKeys.forOrganizationConsumerSecrets(organizationId));
        }
    });
};
