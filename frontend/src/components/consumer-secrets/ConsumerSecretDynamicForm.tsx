import {CreateConsumerWebsiteLogin} from "@app/components/consumer-secrets/CreateConsumerWebsiteLogin";
import {TConsumerSecretFetched, WebsiteLoginContent} from "@app/hooks/api/consumer-secrets/types";
import {TCreateConsumerSecretFormData} from "@app/pages/org/[id]/user-secrets";

export default function ConsumerSecretDynamicForm({
                                                      type,
                                                      onSubmit,
                                                      onFormFieldsChanged,
                                                      renderActions,
                                                      currentSecret
}: {
    type?: TCreateConsumerSecretFormData["type"]
    onSubmit: (data: TCreateConsumerSecretFormData["data"]) => void;
    onFormFieldsChanged?: () => void;
    renderActions: (isSubmitting: boolean, resetFormFields: () => void) => React.ReactNode;
    currentSecret?: TConsumerSecretFetched
}) {
    switch (type) {
        case "website_login":
            return <CreateConsumerWebsiteLogin
                onSubmit={onSubmit}
                onFormFieldsChanged={onFormFieldsChanged}
                renderActions={renderActions}
                currentSecret={{
                    type: "website_login",
                    notes: currentSecret?.secretComment ?? "",
                    name: currentSecret?.name ?? "",

                    ...(currentSecret?.secretValue as WebsiteLoginContent ?? {}),
                }}
            />;
        // case "credit_card":
        //     return <CreateConsumerCreditCard onSubmit={onSubmit} renderActions={renderActions} />;
        // case "secure_note":
        //     return <CreateConsumerSecureNote onSubmit={onSubmit} renderActions={renderActions} />;
        default:
            return null;
    }
}
