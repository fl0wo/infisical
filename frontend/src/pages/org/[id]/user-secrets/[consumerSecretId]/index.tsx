import {useState} from "react";
import Head from "next/head";
import {useRouter} from "next/router";
import {faBackward} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import ConsumerSecretDynamicForm from "@app/components/consumer-secrets/ConsumerSecretDynamicForm";
import {createNotification} from "@app/components/notifications";
import {Button, IconButton} from "@app/components/v2";
import {OrgPermissionActions, OrgPermissionSubjects} from "@app/context";
import {withPermission} from "@app/hoc";
import {
    useDeleteOrganizationConsumerSecret,
    useUpdateOrganizationConsumerSecret
} from "@app/hooks/api/consumer-secrets";
import {useOrganizationConsumerSecret} from "@app/hooks/api/consumer-secrets/queries";
import {TCreateConsumerSecretFormData} from "@app/pages/org/[id]/user-secrets";

const ConsumerSecretInspectPage = withPermission(() => {

        const router = useRouter();
        const consumerSecretId = router.query.consumerSecretId as string;

        const {
            data:consumerSecretFetched,
            isLoading
        } = useOrganizationConsumerSecret(consumerSecretId);

        const updateConsumerSecretMutation = useUpdateOrganizationConsumerSecret();
        const deleteConsumerSecretMutation = useDeleteOrganizationConsumerSecret();

        const [formFieldsChanged, setFormFieldsChanged] = useState(false);

        const onUpdateConsumerSecret = async (
            data: TCreateConsumerSecretFormData["data"]
        ) => {
            try {

                if (!consumerSecretId) {
                    throw new Error("Consumer Secret ID not found");
                }

                console.log("data to push", data);

                await updateConsumerSecretMutation.mutateAsync({
                    consumerSecretId,
                    name: data.name,
                    secretComment: data.notes,
                    type: data.type,
                    secretValue: data
                });

                createNotification({text: "Secret updated!", type: "success"});
            } catch (err) {
                createNotification({text: "Failed to update secret", type: "error"});
            }
        };

        const renderFormsActions = (
            isSubmitting: boolean,
            resetFormFields: () => void
        ) =>
            <div className="mt-14 flex">
                <div className="absolute right-0 bottom-0 mr-6 mb-6 flex items-start justify-end">
                    {
                        !formFieldsChanged &&
                        <Button
                            key="layout-delete-consumer-secret"
                            onClick={() => {
                                deleteConsumerSecretMutation.mutateAsync({id:consumerSecretId});
                            }}
                            colorSchema="danger"
                            variant="outline_bg"
                            className="py-2 w-36"
                        >
                            Delete{isSubmitting ? "ing" : ""} {consumerSecretFetched?.name}
                        </Button>
                    }
                    {
                        formFieldsChanged && <>
                            <Button
                                key="layout-cancel-update-consumer-secret"
                                onClick={() => {
                                    resetFormFields();
                                    setFormFieldsChanged(false);
                                }}
                                colorSchema="secondary"
                                variant="plain"
                                className="py-2"
                            >
                                Discard Changes
                            </Button>
                            <Button
                                isDisabled={isSubmitting}
                                isLoading={isSubmitting}
                                key="layout-update-consumer-secret-submit"
                                className="ml-4"
                                type="submit"
                            >
                                Edit{isSubmitting ? "ing" : ""} {consumerSecretFetched?.name}
                            </Button>
                        </>
                    }
                </div>
            </div>

        return <div>
            <Head>
                <title>
                    Consumer Secret
                </title>
                <link rel="icon" href="/infisical.ico"/>
                <meta property="og:image" content="/images/message.png"/>
            </Head>
            <div className="flex h-full w-full justify-center bg-bunker-800 text-white">
                <div className="w-full max-w-7xl px-6">
                    <div className="mt-6 text-3xl font-semibold text-gray-200 flex flex-row gap-2">
                        <IconButton
                            variant="outline_bg"
                            onClick={() => {
                                const url = router.asPath.split("/").slice(0, -1).join("/");
                                router.push(url);
                            }}
                            ariaLabel="Back"
                            size="xs"
                        >
                            <FontAwesomeIcon icon={faBackward} />
                        </IconButton>
                        Consumer Secret
                    </div>
                    <div className="mb-6 text-lg text-mineshaft-300">
                        Inspect, edit and delete consumer secrets.
                    </div>


                    {/* list all current consumer secrets */}
                    <div className="mt-6">
                        <div className="mt-2">

                            {
                                isLoading && <div>Loading...</div>
                            }

                            {
                                !isLoading && consumerSecretFetched && <div>
                                    <ConsumerSecretDynamicForm
                                        type={consumerSecretFetched.type}
                                        onSubmit={onUpdateConsumerSecret}
                                        onFormFieldsChanged={() => {setFormFieldsChanged(true);}}
                                        renderActions={renderFormsActions}
                                        currentSecret={consumerSecretFetched}
                                    />
                                </div>
                            }

                        </div>
                    </div>

                </div>
            </div>
        </div>
    },
    // TODO: should apply the right permissions
    {
        action: OrgPermissionActions.Read,
        subject: OrgPermissionSubjects.Settings,
    })

Object.assign(ConsumerSecretInspectPage, {
    requireAuth: true
});

export default ConsumerSecretInspectPage;