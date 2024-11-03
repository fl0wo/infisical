import {faEdit, faEye, faRemove} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {twMerge} from "tailwind-merge";

import {IconButton, Table, TableContainer, TableSkeleton, TBody, Td, Th, THead, Tr} from "@app/components/v2";
import timeSince from "@app/ee/utilities/timeSince";
import {TConsumerSecretFetched} from "@app/hooks/api/consumer-secrets/types";

export const OrgConsumerSecretList = ({
                                          consumerSecrets,
                                          isLoading
                                      }: {
    consumerSecrets: TConsumerSecretFetched[],
    isLoading: boolean
}) => {


    return <TableContainer className="mt-8">
        <Table>
            <THead>
                <Tr>
                    <Th className="flex-1">Date</Th>
                    <Th className="flex-1">Secret Name</Th>
                    <Th className="flex-1">Secret Type</Th>
                    <Th className="flex-1">Note</Th>

                    <Th className="flex-1">Action</Th>
                    <Th className="w-5"/>
                </Tr>
            </THead>
            <TBody>
                {!isLoading &&
                    consumerSecrets &&
                    consumerSecrets
                        ?.toSorted((a, b) => new Date(b.createdAt ?? Date.now()).getTime() - new Date(a.createdAt ?? Date.now()).getTime())
                        ?.map((secret) => {
                        return (
                            <Tr
                                onClick={() => {
                                  // open popup with show secret
                                }}
                                key={secret.name + secret.createdAt}
                                className={
                                    twMerge(
                                        "h-10",
                                        "opacity-80 hover:opacity-100 cursor-pointer",
                                        "transition-colors",
                                        "duration-200",
                                        "border-b",
                                        "border-gray-200",
                                        // less than 10sec ago? Show as new and highlight green
                                        Date.now() - new Date(secret.createdAt ?? Date.now()).getTime() < 10 * 1000 && "bg-primary text-black",
                                    )
                                }
                            >
                                <Td>{timeSince(new Date(secret.createdAt ?? Date.now()))}</Td>
                                <Td>{secret.name}</Td>
                                <Td>
                                    {secret.type}
                                </Td>
                                <Td>
                                    {secret.secretComment}
                                </Td>
                                <Td>
                                    <div className="flex justify-center gap-2">
                                        <IconButton
                                            variant="outline_bg"
                                            colorSchema="primary"
                                            ariaLabel="view"
                                            onClick={() => {
                                                // open popuo with show secret
                                            }}
                                            className=" flex items-center rounded py-2"
                                        >
                                            <FontAwesomeIcon className="pr-2" icon={faEye} />
                                        </IconButton>

                                        <IconButton
                                            variant="outline_bg"
                                            colorSchema="secondary"
                                            ariaLabel="edit"
                                            onClick={() => {
                                                // open popup with edit secret
                                            }}
                                            className=" flex items-center rounded py-2"
                                        >
                                            <FontAwesomeIcon className="pr-2" icon={faEdit} />
                                        </IconButton>

                                        <IconButton
                                            variant="outline_bg"
                                            colorSchema="danger"
                                            ariaLabel="delete"
                                            onClick={() => {
                                                // open popup with delete secret
                                            }}
                                            className="flex items-center rounded"
                                        >
                                            <FontAwesomeIcon className="pr-2" icon={faRemove}/>
                                        </IconButton>

                                    </div>
                                </Td>
                            </Tr>
                        );
                    })}
                {isLoading && <TableSkeleton columns={7} innerKey="consumerSecrets"/>}
            </TBody>
        </Table>
    </TableContainer>
}