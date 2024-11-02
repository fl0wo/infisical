import {Controller} from "react-hook-form";

import {FormControl, Input} from "@app/components/v2";

export default function CreateConsumerSecureNote({control}:{control:any}) {
    return (
        <div>
            <Controller
                control={control}
                name="name"
                defaultValue=""
                render={({field, fieldState: {error}}) => (
                    <FormControl
                        label="Secure note"
                        isError={Boolean(error)}
                        errorText={error?.message}
                    >
                        <Input {...field} placeholder="Type your consumer secure note"/>
                    </FormControl>
                )}
            />
        </div>
    );
}