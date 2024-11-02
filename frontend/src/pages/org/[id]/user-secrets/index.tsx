import {Controller, useForm} from "react-hook-form";
import Head from "next/head";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

import {createNotification} from "@app/components/notifications";
import {OrgPermissionCan} from "@app/components/permissions";
import {
    Button,
    FormControl,
    Input,
    Modal,
    ModalContent
} from "@app/components/v2";
import {OrgPermissionActions, OrgPermissionSubjects} from "@app/context";
import {withPermission} from "@app/hoc";
import {usePopUp} from "@app/hooks";

const formSchema = yup.object({
    name: yup
        .string()
        .required()
        .label("Consumer Secret Name")
        .trim()
        .max(64, "Too long, maximum length is 64 characters"),
});

type TCreateConsumerSecretFormData = yup.InferType<typeof formSchema>;

const UserSecrets = withPermission(() => {

        const { popUp, handlePopUpOpen, handlePopUpClose, handlePopUpToggle } = usePopUp([
            "addNewConsumerSecret"
        ] as const);

        const {
            control,
            formState: { isSubmitting },
            reset,
            handleSubmit
        } = useForm<TCreateConsumerSecretFormData>({
            resolver: yupResolver(formSchema),
            defaultValues: {
                name: "",
            }
        });


        const onCreateProject = async (data: TCreateConsumerSecretFormData) => {
            try {
                console.log(data)
                createNotification({ text: "Ciao!", type: "success" });
            } catch (err) {
                createNotification({ text: "Failed to create project", type: "error" });
            }
        };


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

                        {/* propose add new consumer secret */}
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

                    </div>

                    <Modal
                        isOpen={popUp.addNewConsumerSecret.isOpen}
                        onOpenChange={(isModalOpen) => {
                            handlePopUpToggle("addNewConsumerSecret", isModalOpen);
                            reset();
                        }}
                    >
                        <ModalContent
                            title="Create a new consumer secret"
                            subTitle="Create a new consumer secret so all users within the organization can use it."
                        >
                            <form onSubmit={handleSubmit(onCreateProject)}>
                                <Controller
                                    control={control}
                                    name="name"
                                    defaultValue=""
                                    render={({ field, fieldState: { error } }) => (
                                        <FormControl
                                            label="Consumer Secret Name"
                                            isError={Boolean(error)}
                                            errorText={error?.message}
                                        >
                                            <Input {...field} placeholder="Type your consumer secret name" />
                                        </FormControl>
                                    )}
                                />
                                <div className="mt-14 flex">
                                    <div className="absolute right-0 bottom-0 mr-6 mb-6 flex items-start justify-end">
                                        <Button
                                            key="layout-cancel-create-consumer-secret"
                                            onClick={() => handlePopUpClose("addNewConsumerSecret")}
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
                            </form>
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
