import {CreateConsumerWebsiteLogin} from "@app/components/consumer-secrets/CreateConsumerWebsiteLogin";
import {TCreateConsumerSecretFormData} from "@app/pages/org/[id]/user-secrets";

export default function ConsumerSecretDynamicForm({type, onSubmit, renderActions}: {
    type?: TCreateConsumerSecretFormData["type"]
    onSubmit: (data: TCreateConsumerSecretFormData["data"]) => void;
    renderActions: (isSubmitting: boolean, resetFormFields: () => void) => React.ReactNode;
}) {
    switch (type) {
        case "website_login":
            return <CreateConsumerWebsiteLogin onSubmit={onSubmit} renderActions={renderActions} />;
        // case "credit_card":
        //     return <CreateConsumerCreditCard onSubmit={onSubmit} renderActions={renderActions} />;
        // case "secure_note":
        //     return <CreateConsumerSecureNote onSubmit={onSubmit} renderActions={renderActions} />;
        default:
            return null;
    }
}
