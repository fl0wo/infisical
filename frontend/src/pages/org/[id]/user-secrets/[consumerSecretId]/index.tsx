import Head from "next/head";

import {OrgPermissionActions, OrgPermissionSubjects, useOrganization} from "@app/context";
import {withPermission} from "@app/hoc";
import SettingsOrg from "@app/pages/org/[id]/settings";

const ConsumerSecretInspectPage = withPermission(() => {

        const {currentOrg} = useOrganization();

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
                    <div className="mt-6 text-3xl font-semibold text-gray-200">
                        Consumer Secret
                    </div>
                    <div className="mb-6 text-lg text-mineshaft-300">
                        Inspecting secret
                    </div>

                    {/* list all current consumer secrets */}
                    <div className="mt-6">
                        <div className="mt-2">
                            ciao ciao
                            {JSON.stringify(currentOrg)}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    },
    // TODO: should apply the right permissions
    {
        action: OrgPermissionActions.Delete,
        subject: OrgPermissionSubjects.SecretScanning,
    })

Object.assign(ConsumerSecretInspectPage, {
    requireAuth: true
});

SettingsOrg.requireAuth = true;

export default ConsumerSecretInspectPage;