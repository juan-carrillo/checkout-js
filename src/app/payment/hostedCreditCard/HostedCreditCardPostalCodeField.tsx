import React, { useCallback, FunctionComponent } from 'react';

import { TranslatedString } from '../../locale';
import { FormField, TextInputIframeContainer } from '../../ui/form';

export interface HostedCreditCardPostalCodeFieldProps {
    appearFocused: boolean;
    id: string;
    name: string;
}

const HostedCreditCardPostalCodeField: FunctionComponent<HostedCreditCardPostalCodeFieldProps> = ({
    appearFocused,
    id,
    name,
}) => {
    const renderInput = useCallback(() => (<>
        <TextInputIframeContainer
            appearFocused={ appearFocused }
            id={ id }
        />
    </>), [id, appearFocused]);

    return (
        <FormField
            additionalClassName="form-field--postCode"
            input={ renderInput }
            labelContent={ <TranslatedString id="payment.postal_code_label" /> }
            name={ name }
        />
    );
};

export default HostedCreditCardPostalCodeField;
