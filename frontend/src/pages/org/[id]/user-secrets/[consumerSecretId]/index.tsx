import Head from "next/head";
import {useRouter} from "next/router";
import {faBackward} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import ConsumerSecretDynamicForm from "@app/components/consumer-secrets/ConsumerSecretDynamicForm";
import {IconButton} from "@app/components/v2";
import {OrgPermissionActions, OrgPermissionSubjects} from "@app/context";
import {withPermission} from "@app/hoc";
import {useOrganizationConsumerSecret} from "@app/hooks/api/consumer-secrets/queries";

const ConsumerSecretInspectPage = withPermission(() => {

        const router = useRouter();

        const consumerSecretId = router.query.consumerSecretId as string;

        const {
            data:consumerSecretFetched,
            isLoading
        } = useOrganizationConsumerSecret(consumerSecretId);

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
                                        onSubmit={(a:any) => {
                                            console.log(a);
                                        }}
                                        renderActions={() => null}
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