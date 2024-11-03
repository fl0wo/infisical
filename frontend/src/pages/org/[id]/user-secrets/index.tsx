import {useState} from "react";
import Head from "next/head";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

// eslint-disable-next-line import/no-cycle
import ConsumerSecretDynamicForm from "@app/components/consumer-secrets/ConsumerSecretDynamicForm";
import {OrgConsumerSecretList} from "@app/components/consumer-secrets/OrgConsumerSecretList";
import {createNotification} from "@app/components/notifications";
import {OrgPermissionCan} from "@app/components/permissions";
import {consumerSecretTypes, TCreateConsumerSecretFormData} from "@app/components/utilities/consumer-secrets/types";
import {Button, Modal, ModalContent, Select, SelectItem} from "@app/components/v2";
import {OrgPermissionActions, OrgPermissionSubjects, useOrganization} from "@app/context";
import {withPermission} from "@app/hoc";
import {usePopUp} from "@app/hooks";
import {useCreateOrganizationConsumerSecret, useOrganizationConsumerSecrets} from "@app/hooks/api/consumer-secrets";
import SettingsOrg from "@app/pages/org/[id]/settings";


const UserSecrets = withPermission(() => {

        const {popUp, handlePopUpOpen, handlePopUpClose, handlePopUpToggle} = usePopUp([
            "addNewConsumerSecret"
        ] as const);

        const {currentOrg} = useOrganization();

        const currentOrgId = currentOrg?.id;

        const {
            data: orgConsumerSecrets,
            isLoading: isOrgConsumerSecretsLoading,
        } = useOrganizationConsumerSecrets(currentOrgId);

        const mutate = useCreateOrganizationConsumerSecret();

        const [selectedConsumerSecretType, setSelectedConsumerSecretType] = useState<TCreateConsumerSecretFormData["type"] | undefined>();

        const onCreateConsumerSecret = async (
            data: TCreateConsumerSecretFormData["data"]
        ) => {
            try {

                if (!currentOrgId) {
                    throw new Error("Organization ID not found");
                }

                await mutate.mutateAsync({
                    organizationId: currentOrgId,
                    name: data.name,
                    secretComment: data.notes,
                    type: data.type,
                    secretValue: data
                });

                createNotification({text: "User secret created!", type: "success"});
                handlePopUpClose("addNewConsumerSecret");
            } catch (err) {
                createNotification({text: "Failed to create user secret", type: "error"});
            }
        };

        const renderFormsActions = (
            isSubmitting: boolean,
            resetFormFields: () => void
        ) => (
            <div className="mt-14 flex">
                <div
                    className="absolute right-0 bottom-0 mr-6 mb-6 flex items-start justify-end">
                    <Button
                        key="layout-cancel-create-consumer-secret"
                        onClick={() => {
                            setSelectedConsumerSecretType(undefined);
                            handlePopUpClose("addNewConsumerSecret");
                            resetFormFields();
                        }}
                        colorSchema="secondary"
                        variant="plain"
                        className="py-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        isDisabled={isSubmitting}
                        isLoading={isSubmitting}
                        key="layout-create-consumer-secret-submit"
                        className="ml-4"
                        type="submit"
                    >
                        Create Consumer Secret
                    </Button>
                </div>
            </div>
        )

        return (
            <div>
                <Head>
                    <title>
                        Consumer Secrets
                    </title>
                    <link rel="icon" href="/infisical.ico"/>
                    <meta property="og:image" content="/images/message.png"/>
                </Head>
                <div className="flex h-full w-full justify-center bg-bunker-800 text-white">
                    <div className="w-full max-w-7xl px-6">
                        <div className="mt-6 text-3xl font-semibold text-gray-200">
                            Consumer Secrets
                        </div>
                        <div className="mb-6 text-lg text-mineshaft-300">
                            Create and manage your consumer secrets to centralize your organization&apos;s non-technical secrets.
                        </div>


                        <div
                            className="relative mb-6 flex justify-between rounded-md border border-mineshaft-600 bg-mineshaft-800 p-6">
                            <div className="flex flex-col items-start">
                                <div className="mb-1 flex flex-row">
                                    User Secrets{" "}
                                </div>
                                <div>
                                    <p className="text-mineshaft-300">
                                        Create and share secrets such as website logins, credit cards, and secure notes.
                                    </p>
                                </div>
                            </div>

                            <div className="flex h-[3.25rem] items-center">
                                {/* FIXME: should look for ConsumerSecret OrgPermissionSubject not Workspace */}
                                <OrgPermissionCan I={OrgPermissionActions.Create} an={OrgPermissionSubjects.Workspace}>
                                    {(isAllowed) => (
                                        <Button
                                            isDisabled={!isAllowed}
                                            colorSchema="primary"
                                            leftIcon={<FontAwesomeIcon icon={faPlus}/>}
                                            onClick={() => {
                                                console.log("Create new user secret");
                                                handlePopUpOpen("addNewConsumerSecret");
                                            }}
                                            className="ml-2"
                                        >
                                            Add New Consumer Secret
                                        </Button>
                                    )}
                                </OrgPermissionCan>
                            </div>
                        </div>


                        {/* list all current consumer secrets */}

                        <div className="mt-6">
                            <div className="mt-2">
                                {
                                    isOrgConsumerSecretsLoading ? (
                                        <div>Loading...</div>
                                    ) : (

                                        <OrgConsumerSecretList
                                            isLoading={isOrgConsumerSecretsLoading}
                                            consumerSecrets={orgConsumerSecrets}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </div>


                    <Modal
                        isOpen={popUp.addNewConsumerSecret.isOpen}
                        onOpenChange={(isModalOpen) => {
                            handlePopUpToggle("addNewConsumerSecret", isModalOpen);
                        }}
                    >
                        <ModalContent
                            title="Create a new consumer secret"
                            subTitle="Create a new consumer secret so all users within the organization can use it."
                        >

                            <Select
                                value={selectedConsumerSecretType}
                                onValueChange={setSelectedConsumerSecretType}
                                placeholder="What would like to add to Consumer Secrets?"
                                className="w-full border border-mineshaft-500 mb-4"
                            >
                                {consumerSecretTypes?.map((consumerSecretType) => (
                                    <SelectItem
                                        value={consumerSecretType.type}
                                        key={`selectable-consumer-secret-type-${consumerSecretType.type}`}
                                    >
                                        {consumerSecretType.name}
                                    </SelectItem>
                                ))}
                            </Select>

                            <ConsumerSecretDynamicForm
                                type={selectedConsumerSecretType}
                                onSubmit={onCreateConsumerSecret}
                                renderActions={renderFormsActions}
                            />

                            {/* add more consumer type forms */}

                        </ModalContent>
                    </Modal>
                </div>
            </div>
        )
            ;
    },
    {
        action: OrgPermissionActions.Read,
        subject: OrgPermissionSubjects.SecretScanning,
    }
);

Object.assign(UserSecrets, {
    requireAuth: true
});

SettingsOrg.requireAuth = true;

export default UserSecrets;
