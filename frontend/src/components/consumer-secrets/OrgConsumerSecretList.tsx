import {useRouter} from "next/router";
import {twMerge} from "tailwind-merge";

import {Table, TableContainer, TableSkeleton, TBody, Td, Th, THead, Tr} from "@app/components/v2";
import timeSince from "@app/ee/utilities/timeSince";
import {TConsumerSecretFetched} from "@app/hooks/api/consumer-secrets/types";

export const OrgConsumerSecretList = ({
                                          consumerSecrets,
                                          isLoading
                                      }: {
    consumerSecrets?: TConsumerSecretFetched[],
    isLoading: boolean
}) => {

    const router = useRouter();

    return <TableContainer className="mt-8">
        <Table>
            <THead>
                <Tr>
                    <Th className="flex-1">Secret Name</Th>
                    <Th className="flex-1">Secret Type</Th>
                    <Th className="flex-1">Date</Th>
                    <Th className="flex-1">Note</Th>
                </Tr>
            </THead>
            <TBody>
                {!isLoading &&
                    consumerSecrets &&
                    consumerSecrets
                        ?.map((secret) => {
                            function secondsAgo(createdAt: string | undefined) {
                                return (Date.now() - new Date(createdAt ?? Date.now()).getTime()) / 1000;
                            }

                            return (
                            <Tr
                                onClick={() => {
                                    if(!secret.id) {
                                        console.log("No secret id found", secret);
                                        return;
                                    }
                                    const url = `${router.asPath}/${secret.id}`;
                                    router.push(url)
                                }}
                                key={secret.id}
                                className={
                                    twMerge(
                                        "h-10",
                                        "cursor-pointer hover:text-black hover:bg-primary",
                                        "transition-colors",
                                        "duration-200",
                                        "border-b",
                                        "border-gray-200",
                                        secondsAgo(secret.createdAt) < 10 && "bg-primary text-black",
                                    )
                                }
                            >
                                <Td>{secret.name}</Td>
                                <Td>
                                    {secret.type === "website_login" && "Website Login"}
                                    {secret.type === "credit_card" && "Credit Card"}
                                    {secret.type === "secure_note" && "Secure Note"}
                                </Td>
                                <Td>{timeSince(new Date(secret.createdAt ?? Date.now()))}</Td>
                                <Td>
                                    {secret.secretComment}
                                </Td>
                            </Tr>
                        );
                    })}
                {isLoading && <TableSkeleton columns={7} innerKey="consumerSecrets"/>}
            </TBody>
        </Table>
    </TableContainer>
}