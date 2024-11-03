import {TCreateConsumerSecretCreditCardFormData} from "@app/components/utilities/consumer-secrets/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CreateConsumerCreditCard(_: {
    onSubmit: (data: TCreateConsumerSecretCreditCardFormData) => void;
    onFormFieldsChanged?: () => void;
    renderActions: (
        isSubmitting: boolean,
        resetFormFields: () => void
    ) => React.ReactNode;
    currentSecret?: TCreateConsumerSecretCreditCardFormData;
}) {
    return (
        <div>
            credit card form not implemented
        </div>
    );
}