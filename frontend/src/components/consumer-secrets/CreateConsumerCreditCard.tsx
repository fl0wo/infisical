import {useState} from "react";
import Cards from "react-credit-cards-2";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

import {
    consumerSecretWebsiteLogin,
    TCreateConsumerSecretCreditCardFormData,
} from "@app/components/utilities/consumer-secrets/types";
import {FormControl, Input} from "@app/components/v2";

import "react-credit-cards-2/dist/es/styles-compiled.css";

export default function CreateConsumerCreditCard({
                                                     onSubmit,
                                                     onFormFieldsChanged,
                                                     renderActions,
                                                     currentSecret
                                                 }: {
    onSubmit: (data: TCreateConsumerSecretCreditCardFormData) => void;
    onFormFieldsChanged?: () => void;
    renderActions: (
        isSubmitting: boolean,
        resetFormFields: () => void
    ) => React.ReactNode;
    currentSecret?: TCreateConsumerSecretCreditCardFormData;
}) {

    const [state, setState] = useState({
        number: currentSecret?.cardNumber ?? "",
        expiry: currentSecret?.expirationDate ?? "",
        cvc: currentSecret?.cvv ?? "",
        name: currentSecret?.cardHolderName ?? "",
        focus: "",
    });

    const {
        control,
        formState: { isSubmitting },
        reset,
        handleSubmit
    } = useForm<TCreateConsumerSecretCreditCardFormData>({
        resolver: yupResolver(consumerSecretWebsiteLogin),
        defaultValues: {
            type: "credit_card", // do I really need to keep this? or line 8 is enough?
            ...currentSecret
        },
    });

    return (
        <div>
            <div className="mt-4 mb-4">
                <Cards
                    number={state.number}
                    expiry={state.expiry}
                    cvc={state.cvc}
                    name={state.name}
                    focused={state.focus as any}
                />
            </div>


            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="name"
                    defaultValue=""
                    render={({field, fieldState: {error}}) => (
                        <FormControl
                            label="Card Name"
                            isError={Boolean(error)}
                            errorText={error?.message}
                        >
                            <Input {...field}
                                   onChangeCapture={onFormFieldsChanged}
                                   placeholder="Type your consumer secret name"/>
                        </FormControl>
                    )}
                />
                <Controller
                    control={control}
                    name="cardNumber"
                    defaultValue=""
                    render={({field, fieldState: {error}}) => (
                        <FormControl
                            label="Card Numner"
                            isError={Boolean(error)}
                            errorText={error?.message}
                        >
                            <Input
                                {...field}
                                placeholder="Type your card number"
                                type="number"
                                value={state.number}
                                onChange={(val)=>{
                                    if(val.target.value.length > 19){
                                        return;
                                    }
                                    setState((prev) => ({
                                        ...prev,
                                        number: val.target.value,
                                        focus: "number"
                                    }));
                                }}
                                maxLength={19}
                                onFocus={() => {
                                    setState((prev) => ({
                                        ...prev,
                                        focus: "number"
                                    }));
                                }}
                                onChangeCapture={onFormFieldsChanged}
                            />
                        </FormControl>
                    )}
                />

                {/* card holder */}
                <Controller
                    control={control}
                    name="cardHolderName"
                    defaultValue=""
                    render={({field, fieldState: {error}}) => (
                        <FormControl
                            label="Card Holder Name"
                            isError={Boolean(error)}
                            errorText={error?.message}
                        >
                            <Input
                                {...field}
                                onChangeCapture={onFormFieldsChanged}
                                value={state.name}
                                onChange={(val)=>{
                                    setState((prev) => ({
                                        ...prev,
                                        name: val.target.value,
                                        focus: "name"
                                    }));
                                }}
                                onFocus={() => {
                                    setState((prev) => ({
                                        ...prev,
                                        focus: "name"
                                    }));
                                }}
                                placeholder="Type your card holder name"/>
                        </FormControl>
                    )}
                />

                {/* expiry date */}
                <Controller
                    control={control}
                    name="expirationDate"
                    defaultValue=""
                    render={({field, fieldState: {error}}) => (
                        <FormControl
                            label="Expiration Date"
                            isError={Boolean(error)}
                            errorText={error?.message}
                        >
                            <Input
                                {...field}
                                onChangeCapture={onFormFieldsChanged}
                                value={state.expiry}
                                onChange={(val)=>{
                                    if(val.target.value.length > 4){
                                        return;
                                    }
                                    setState((prev) => ({
                                        ...prev,
                                        expiry: val.target.value,
                                        focus: "expiry"
                                    }));
                                }}
                                onFocus={() => {
                                    setState((prev) => ({
                                        ...prev,
                                        focus: "expiry"
                                    }));
                                }}
                                placeholder="Type your expiration date"/>
                        </FormControl>
                    )}
                />

                {/* cvv */}
                <Controller
                    control={control}
                    name="cvv"
                    defaultValue=""
                    render={({field, fieldState: {error}}) => (
                        <FormControl
                            label="CVV"
                            isError={Boolean(error)}
                            errorText={error?.message}
                        >
                            <Input
                                {...field}
                                onChangeCapture={onFormFieldsChanged}
                                value={state.cvc}
                                onChange={(val)=>{
                                    if(val.target.value.length > 3){
                                        return;
                                    }
                                    setState((prev) => ({
                                        ...prev,
                                        cvc: val.target.value,
                                        focus: "cvc"
                                    }));
                                }}
                                onFocus={() => {
                                    setState((prev) => ({
                                        ...prev,
                                        focus: "cvc"
                                    }));
                                }}
                                placeholder="Type your cvv"/>
                        </FormControl>
                    )}
                />

                {/* notes */}
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
                            <Input {...field} onChangeCapture={onFormFieldsChanged} placeholder="Type your notes"/>
                        </FormControl>
                    )}
                />

                {renderActions(isSubmitting, reset)}

            </form>
        </div>
);
}