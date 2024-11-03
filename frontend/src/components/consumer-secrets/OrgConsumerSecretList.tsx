import {faEdit, faEye, faRemove} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
                    consumerSecrets?.map((secret) => {
                        return (
                            <Tr key={secret.name + secret.createdAt} className="h-10">
                                <Td>{timeSince(new Date(secret.createdAt ?? Date.now()))}</Td>
                                <Td>{secret.name}</Td>
                                <Td>
                                    {secret.type}
                                </Td>
                                <Td>
                                    {secret.secretComment}
                                </Td>
                                <Td>
                                    <div className="flex justify-center">
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