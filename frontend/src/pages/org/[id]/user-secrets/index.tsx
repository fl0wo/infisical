import {useState} from "react";
import Head from "next/head";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as yup from "yup";

import CreateConsumerCreditCard from "@app/components/consumer-secrets/CreateConsumerCreditCard";
import CreateConsumerSecureNote from "@app/components/consumer-secrets/CreateConsumerSecureNote";
import {
    consumerSecretWebsiteLogin,
    CreateConsumerWebsiteLogin,
} from "@app/components/consumer-secrets/CreateConsumerWebsiteLogin";
import {OrgConsumerSecretList} from "@app/components/consumer-secrets/OrgConsumerSecretList";
import {createNotification} from "@app/components/notifications";
import {OrgPermissionCan} from "@app/components/permissions";
import {Button, Modal, ModalContent, Select, SelectItem} from "@app/components/v2";
import {OrgPermissionActions, OrgPermissionSubjects} from "@app/context";
import {withPermission} from "@app/hoc";
import {usePopUp} from "@app/hooks";
import {useCreateOrganizationConsumerSecret, useOrganizationConsumerSecrets} from "@app/hooks/api/consumer-secrets";

const consumerSecretTypes = [
    {
        name: "Website Login",
        type: "website_login"
    },
    {
        name: "Credit Card",
        type: "credit_card"
    },
    {
        name: "Secure Note",
        type: "secure_note"
    }
];

// dynamically adapts to the type of consumer secret being created
export const consumerSecretFormSchema = yup.object({
    type: yup
        .string()
        .oneOf(
            consumerSecretTypes
                .map((consumerSecretType) =>
                    consumerSecretType.type
                )
        )
        .required()
        .label("Consumer Secret Type")
}).shape({
    data: yup.lazy((value) => {
        switch (value.type) {
            case "website_login":
                return consumerSecretWebsiteLogin;
            // TODO: implement those as well
            // case "credit_card":
            //     return creditCardSchema;
            // case "secure_note":
            //     return secureNoteSchema;
            default:
                return yup.mixed().notRequired();
        }
    })
});

export type TCreateConsumerSecretFormData = yup.InferType<typeof consumerSecretFormSchema>;

const UserSecrets = withPermission(() => {

        const {popUp, handlePopUpOpen, handlePopUpClose, handlePopUpToggle} = usePopUp([
            "addNewConsumerSecret"
        ] as const);

        const {
            data: orgConsumerSecrets,
            isLoading: isOrgConsumerSecretsLoading,
        } = useOrganizationConsumerSecrets("organizationId");

        console.log("Replied data", orgConsumerSecrets);

        const mutate = useCreateOrganizationConsumerSecret();

        const [selectedConsumerSecretType, setSelectedConsumerSecretType] = useState<TCreateConsumerSecretFormData["type"] | undefined>();

        const onCreateConsumerSecret = async (
            data: TCreateConsumerSecretFormData["data"]
        ) => {
            try {

                // The secret will be added regardless of it's content, the content will be saved as a JSON stringlyfied object
                // The secret will be encrypted and saved in the database
                // Why I'd keep the secret as a JSON and not as a separate table?

                // PROS of keeping the content as a JSON in the db instead of hierarchical tables:
                // 1. If i need to add fields to the secret, I can do it without changing the db's schema
                // 2. If i need new types of secrets, I can do it without changing the db's schema
                // 3. I can easily retrieve the secrets without having to join tables
                // 4. As an MVP this is the fastest way to implement it
                // 5. I do not want to build query to filter based on secret's fields (e.g. find all credit cards that start with 2384) (maybe at max I'd need to do a fuzzy search (full-text))

                // CONS of keeping the content as a JSON in the db instead of hierarchical tables:
                // 1. Cannot enforce the schema of the content
                // 2. Cannot enforce the types of the content
                // 3. Field's uniqueness and indexes cannot exist
                // 4. I cant create relationships between fields of the content and other tables
                // 5. No db constraints, just application constraints

                console.log("data to push", data);

                // Overall, for low number of N secrets, I feel inserting contents as JSON is an "ok-ish" approach, surely the fastest to implement.
                await mutate.mutateAsync({
                    // fixme: understand how to get the CURRENT organizationId
                    organizationId: "7cbe3e71-6cf5-4460-8a4d-9d1828330779",
                    name: data.name,
                    secretComment: data.notes,
                    type: data.type,
                    secretValue: data
                });

                createNotification({text: "Secret created!", type: "success"});
                handlePopUpClose("addNewConsumerSecret");
            } catch (err) {
                createNotification({text: "Failed to create project", type: "error"});
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
                            Manage your consumer secrets here.
                        </div>

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

                        {/* list all current consumer secrets */}

                        <div className="mt-6">
                            <div className="text-lg font-semibold text-gray-200">
                                Current Consumer Secrets
                            </div>
                            <div className="mt-2">
                                {
                                    isOrgConsumerSecretsLoading ? (
                                        <div>Loading...</div>
                                    ) : (

                                        <OrgConsumerSecretList
                                            isLoading={isOrgConsumerSecretsLoading}
                                            consumerSecrets={orgConsumerSecrets}
                                        />
                                        // <div>
                                        //     {
                                        //         orgConsumerSecrets?.map((consumerSecret:TConsumerSecretFetched) => (
                                        //             <div key={consumerSecret.name}>
                                        //                 <div>
                                        //                     {consumerSecret.name}
                                        //                 </div>
                                        //                 <div>
                                        //                     {consumerSecret.type}
                                        //                 </div>
                                        //                 <div>
                                        //                     {consumerSecret.secretComment}
                                        //                 </div>
                                        //                 <div>
                                        //                     {JSON.stringify(consumerSecret.secretValue)}
                                        //                 </div>
                                        //             </div>
                                        //         ))
                                        //     }
                                        // </div>
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

                            {
                                selectedConsumerSecretType === "website_login" && (
                                    <CreateConsumerWebsiteLogin
                                        onSubmit={onCreateConsumerSecret}
                                        renderActions={renderFormsActions}
                                    />
                                )
                            }

                            {
                                selectedConsumerSecretType === "credit_card" && (
                                    <CreateConsumerCreditCard/>
                                )
                            }

                            {
                                selectedConsumerSecretType === "secure_note" && (
                                    <CreateConsumerSecureNote/>
                                )
                            }

                            {/* add more consumer type forms */}

                        </ModalContent>
                    </Modal>
                </div>
            </div>
        );
    },
    {
        action: OrgPermissionActions.Read,
        subject: OrgPermissionSubjects.SecretScanning,
    }
);

Object.assign(UserSecrets, {
    requireAuth: true
});

export default UserSecrets;
