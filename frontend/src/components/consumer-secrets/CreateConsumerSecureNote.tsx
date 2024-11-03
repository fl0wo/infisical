import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

import {
    secureNoteSchema, TCreateConsumerSecretSecureNoteFormData,
} from "@app/components/utilities/consumer-secrets/types";
import {FormControl, Input, TextArea} from "@app/components/v2";

export default function CreateConsumerSecureNote({
                                                     onSubmit,
                                                     onFormFieldsChanged,
                                                     renderActions,
                                                     currentSecret
                                                 }: {
    onSubmit: (data: TCreateConsumerSecretSecureNoteFormData) => void;
    onFormFieldsChanged?: () => void;
    renderActions: (
        isSubmitting: boolean,
        resetFormFields: () => void
    ) => React.ReactNode;
    currentSecret?: TCreateConsumerSecretSecureNoteFormData
}) {

    const {
        control,
        formState: { isSubmitting },
        reset,
        handleSubmit
    } = useForm<TCreateConsumerSecretSecureNoteFormData>({
        resolver: yupResolver(secureNoteSchema),
        defaultValues: {
            type: "secure_note", // do I really need to keep this? or line 8 is enough?
            ...currentSecret
        },
    });

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="name"
                    defaultValue=""
                    render={({field, fieldState: {error}}) => (
                        <FormControl
                            label="Consumer Secret Name"
                            isError={Boolean(error)}
                            errorText={error?.message}
                        >
                            <Input {...field} onChangeCapture={onFormFieldsChanged} placeholder="Type your consumer secret name"/>
                        </FormControl>
                    )}
                />

                <Controller
                    control={control}
                    name="note"
                    defaultValue=""
                    render={({field, fieldState: {error}}) => (
                        <FormControl
                            label="Content"
                            isError={Boolean(error)}
                            errorText={error?.message}
                        >
                            <TextArea {...field} onChangeCapture={onFormFieldsChanged} placeholder="Type your content"/>
                        </FormControl>
                    )}
                />

                <Controller
                    control={control}
                    name="notes"
                    defaultValue=""
                    render={({field, fieldState: {error}}) => (
                        <FormControl
                            label="Public Notes"
                            isError={Boolean(error)}
                            errorText={error?.message}
                        >
                            <TextArea {...field} onChangeCapture={onFormFieldsChanged} placeholder="Type your notes"/>
                        </FormControl>
                    )}
                />

                {renderActions(isSubmitting, reset)}
            </form>
        </div>
    );
}