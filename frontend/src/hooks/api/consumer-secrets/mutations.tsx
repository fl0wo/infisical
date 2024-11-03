import {useMutation, useQueryClient} from "@tanstack/react-query";

import {apiRequest} from "@app/config/request";
import {consumerSecretKeys} from "@app/hooks/api/consumer-secrets/queries";
import {TConsumerSecret, TCreateConsumerSecretRequest} from "@app/hooks/api/consumer-secrets/types";

export const useCreateOrganizationConsumerSecret = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: {
            organizationId: string,
            name: string,
            secretComment: string,

            type: TConsumerSecret["type"],
            secretValue: TConsumerSecret["secret"]
        }) => {

            const {organizationId} = body;

            const payload = {
                ...body,
                organizationId: undefined,
            }

            const {data} = await apiRequest.post(`/api/v3/consumer-secrets/${organizationId}`, payload);
            return data;
        },
        onSuccess: (_, {organizationId}) => {
            // wait 2sec
            setTimeout(() => {
                queryClient.invalidateQueries(consumerSecretKeys.forOrganizationConsumerSecrets(organizationId));
            }, 2000);
            // queryClient.invalidateQueries(consumerSecretKeys.forOrganizationConsumerSecrets(organizationId));
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
            const {data} = await apiRequest.patch(`/api/v3/consumer-secrets/${organizationId}/${id}`, {
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
            const {data} = await apiRequest.delete(`/api/v3/consumer-secrets/${organizationId}/${id}`);
            return data;
        },
        onSuccess: (_, {organizationId}) => {
            queryClient.invalidateQueries(consumerSecretKeys.forOrganizationConsumerSecrets(organizationId));
        }
    });
};
