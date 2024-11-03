import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

import {
    consumerSecretWebsiteLogin,
    TCreateConsumerSecretWebsiteLoginFormData
} from "@app/components/utilities/consumer-secrets/types";
import {FormControl, Input, TextArea} from "@app/components/v2";

export const CreateConsumerWebsiteLogin = ({
                                               onSubmit,
                                               onFormFieldsChanged,
                                               renderActions,
                                               currentSecret
}: {
    onSubmit: (data: TCreateConsumerSecretWebsiteLoginFormData) => void;
    onFormFieldsChanged?: () => void;
    renderActions: (
        isSubmitting: boolean,
        resetFormFields: () => void
    ) => React.ReactNode;
    currentSecret?: TCreateConsumerSecretWebsiteLoginFormData;
}) => {

    const {
        control,
        formState: { isSubmitting },
        reset,
        handleSubmit
    } = useForm<TCreateConsumerSecretWebsiteLoginFormData>({
        resolver: yupResolver(consumerSecretWebsiteLogin),
        defaultValues: {
            type: "website_login", // do I really need to keep this? or line 8 is enough?
            ...currentSecret
        },
    });

    return (
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
                name="url"
                defaultValue=""
                render={({field, fieldState: {error}}) => (
                    <FormControl
                        label="URL"
                        isError={Boolean(error)}
                        errorText={error?.message}
                    >
                        <Input type="url" {...field} onChangeCapture={onFormFieldsChanged} placeholder="Type your URL"/>
                    </FormControl>
                )}
            />

            <Controller
                control={control}
                name="username"
                defaultValue=""
                render={({field, fieldState: {error}}) => (
                    <FormControl
                        label="Username or Email"
                        isError={Boolean(error)}
                        errorText={error?.message}
                    >
                        <Input {...field} onChangeCapture={onFormFieldsChanged} placeholder="Type your username"/>
                    </FormControl>
                )}
            />

            <Controller
                control={control}
                name="password"
                defaultValue=""
                render={({field, fieldState: {error}}) => (
                    <FormControl
                        label="Password"
                        isError={Boolean(error)}
                        errorText={error?.message}
                    >
                        <Input type={currentSecret?.password ? "text" : "password"} {...field} onChangeCapture={onFormFieldsChanged} placeholder="Type your password"/>
                    </FormControl>
                )}

            />

            <Controller
                control={control}
                name="notes"
                defaultValue=""
                render={({field, fieldState: {error}}) => (
                    <FormControl
                        label="Notes"
                        isError={Boolean(error)}
                        errorText={error?.message}
                    >
                        <TextArea {...field} onChangeCapture={onFormFieldsChanged} placeholder="Type your notes"/>
                    </FormControl>
                )}

            />

            {renderActions(isSubmitting,reset)}
        </form>
    );
}