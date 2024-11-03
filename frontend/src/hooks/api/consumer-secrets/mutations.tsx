import {useMutation, useQueryClient} from "@tanstack/react-query";

import {apiRequest} from "@app/config/request";
import {consumerSecretKeys} from "@app/hooks/api/consumer-secrets/queries";
import {TConsumerSecret} from "@app/hooks/api/consumer-secrets/types";

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
        }
    });
};
export const useUpdateOrganizationConsumerSecret = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: {
            consumerSecretId: string,
            name: string,
            secretComment: string,

            type: TConsumerSecret["type"],
            secretValue: TConsumerSecret["secret"]
        }) => {

            const {consumerSecretId} = body;

            const payload = {
                ...body,
                organizationId: undefined,
            }

            const {data} = await apiRequest.patch(`/api/v3/consumer-secrets/${consumerSecretId}`, payload);
            return data;
        },
        onSuccess: (_, {consumerSecretId}) => {
            // wait 2sec
            setTimeout(() => {
                queryClient.invalidateQueries(consumerSecretKeys.forOrganizationConsumerSecrets(consumerSecretId));
            }, 2000);
        }
    });
};

export const useDeleteOrganizationConsumerSecret = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               id
                           }: {
            organizationId: string;
            id: string;
        }) => {
            const {data} = await apiRequest.delete(`/api/v3/consumer-secrets/${id}`);
            return data;
        },
        onSuccess: (_, {organizationId}) => {
            queryClient.invalidateQueries(consumerSecretKeys.forOrganizationConsumerSecrets(organizationId));
        }
    });
};
