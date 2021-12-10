import React, { FunctionComponent, ReactNode } from 'react';

import { TranslatedString } from '../../locale';
import { Fieldset, Legend } from '../../ui/form';

import HostedCreditCardCodeField from './HostedCreditCardCodeField';
import HostedCreditCardExpiryField from './HostedCreditCardExpiryField';
import HostedCreditCardNameField from './HostedCreditCardNameField';
import HostedCreditCardNumberField from './HostedCreditCardNumberField';
import HostedCreditCardPostalCodeField from './HostedCreditCardPostalCodeField';

export interface HostedCreditCardFieldsetProps {
    additionalFields?: ReactNode;
    cardCodeId?: string;
    cardExpiryId: string;
    cardNameId?: string;
    cardNumberId: string;
    postalCodeId?: string;
    focusedFieldType?: string;
}

export interface HostedCreditCardFieldsetValues {
    hostedForm: {
        cardType?: string;
        errors?: {
            cardCode?: string;
            cardExpiry?: string;
            cardName?: string;
            cardNumber?: string;
            cardPCode?: string;
        };
    };
}

const HostedCreditCardFieldset: FunctionComponent<HostedCreditCardFieldsetProps> = ({
    additionalFields,
    cardCodeId,
    cardExpiryId,
    cardNameId,
    cardNumberId,
    postalCodeId,
    focusedFieldType,
}) => (
    <Fieldset
        legend={
            <Legend hidden>
                <TranslatedString id="payment.credit_card_text" />
            </Legend>
        }
    >
        <div className="form-ccFields">
            <HostedCreditCardNumberField
                appearFocused={ focusedFieldType === 'cardNumber' }
                id={ cardNumberId }
                name="hostedForm.errors.cardNumber"
            />

            <HostedCreditCardExpiryField
                appearFocused={ focusedFieldType === 'cardExpiry' }
                id={ cardExpiryId }
                name="hostedForm.errors.cardExpiry"
            />

            { cardNameId && <HostedCreditCardNameField
                appearFocused={ focusedFieldType === 'cardName' }
                id={ cardNameId }
                name="hostedForm.errors.cardName"
            /> }

            { cardCodeId && <HostedCreditCardCodeField
                appearFocused={ focusedFieldType === 'cardCode' }
                id={ cardCodeId }
                name="hostedForm.errors.cardCode"
            /> }

            { postalCodeId && <HostedCreditCardPostalCodeField
                appearFocused={ focusedFieldType === 'cardPCode' }
                id={ postalCodeId }
                name="hostedForm.errors.cardPCode"
            /> }

            { additionalFields }
        </div>
    </Fieldset>
);

export default HostedCreditCardFieldset;
