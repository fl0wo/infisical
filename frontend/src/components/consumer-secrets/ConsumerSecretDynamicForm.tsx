import CreateConsumerCreditCard from "@app/components/consumer-secrets/CreateConsumerCreditCard";
import CreateConsumerSecureNote from "@app/components/consumer-secrets/CreateConsumerSecureNote";
import {CreateConsumerWebsiteLogin} from "@app/components/consumer-secrets/CreateConsumerWebsiteLogin";
import {TCreateConsumerSecretFormData} from "@app/components/utilities/consumer-secrets/types";
import {
    CreditCardContent,
    SecureNoteContent,
    TConsumerSecretFetched,
    WebsiteLoginContent
} from "@app/hooks/api/consumer-secrets/types";

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
        case "credit_card":
            return <CreateConsumerCreditCard
                onSubmit={onSubmit}
                onFormFieldsChanged={onFormFieldsChanged}
                renderActions={renderActions}
                currentSecret={{
                    type: "credit_card",

                    name: currentSecret?.name ?? "",
                    notes: currentSecret?.secretComment ?? "",

                    ...(currentSecret?.secretValue as CreditCardContent ?? {}),
                }}
            />;
        case "secure_note":
            return <CreateConsumerSecureNote
                onSubmit={onSubmit}
                onFormFieldsChanged={onFormFieldsChanged}
                renderActions={renderActions}
                currentSecret={{
                    type: "secure_note",
                    notes: currentSecret?.secretComment ?? "",
                    name: currentSecret?.name ?? "",

                    ...(currentSecret?.secretValue as SecureNoteContent ?? {}),
                }}
            />;
        // add more dynamic forms here
        default:
            return null;
    }
}
