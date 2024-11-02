import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

import {FormControl, Input, TextArea} from "@app/components/v2";

// Define WebsiteLogin schema
export const consumerSecretWebsiteLogin = yup.object({
    type: yup
        .string()
        .default("website_login"),

    // SMELL: those are shared with the other consumer secret types as well (credit card, secure note)
    name: yup
        .string()
        .required()
        .max(64, "Too long, maximum length is 64 characters"),

    notes: yup
        .string()
        .max(256, "Too long, maximum length is 256 characters"),

    // website login related fields only
    url: yup.string().url().required("URL is required for website login"),
    username: yup.string().required("Username is required for website login"),
    password: yup.string().required("Password is required for website login")
});

export type TCreateConsumerSecretWebsiteLoginFormData = yup.InferType<typeof consumerSecretWebsiteLogin>;

export const CreateConsumerWebsiteLogin = ({onSubmit, renderActions}: {
    onSubmit: (data: TCreateConsumerSecretWebsiteLoginFormData) => void;
    renderActions: (
        isSubmitting: boolean,
        resetFormFields: () => void
    ) => React.ReactNode;
}) => {

    const {
        control,
        formState: { isSubmitting },
        reset,
        handleSubmit
    } = useForm<TCreateConsumerSecretWebsiteLoginFormData>({
        resolver: yupResolver(consumerSecretWebsiteLogin),
        defaultValues: {
            type: "website_login" // do I really need to keep this? or line 8 is enough?
        }
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
                        <Input {...field} placeholder="Type your consumer secret name"/>
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
                        <Input type="url" {...field} placeholder="Type your URL"/>
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
                        <Input {...field} placeholder="Type your username"/>
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
                        <Input type="password" {...field} placeholder="Type your password"/>
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
                        <TextArea {...field} placeholder="Type your notes"/>
                    </FormControl>
                )}

            />

            {renderActions(isSubmitting,reset)}
        </form>
    );
}