import { PaymentInitializeOptions } from '@bigcommerce/checkout-sdk';
import React, { useCallback, FunctionComponent } from 'react';
import { Omit } from 'utility-types';

import CreditCardPaymentMethod from './CreditCardPaymentMethod';
import { HostedFieldPaymentMethodProps } from './HostedFieldPaymentMethod';
import { withHostedCreditCardFieldset, WithInjectedHostedCreditCardFieldsetProps } from '../hostedCreditCard';

export type SquarePaymentMethodProps = Omit<HostedFieldPaymentMethodProps, 'cardCodeId' | 'cardExpiryId' | 'cardNumberId' | 'postalCodeId' | 'walletButtons'>;

const SquarePaymentMethod: FunctionComponent<SquarePaymentMethodProps & WithInjectedHostedCreditCardFieldsetProps> = ({
    initializePayment,
    method,
    hostedValidationSchema,
    hostedStoredCardValidationSchema,
    getHostedFieldset,
    getHostedFormContainerIds,
    getHostedFormOptions,
    getHostedStoredCardValidationFieldset,
    ...rest
}) => {
    const isMasterpassEnabled = method.initializationData && method.initializationData.enableMasterpass;

    const initializeSquarePayment = useCallback((options: PaymentInitializeOptions) => {
        const containerIds = getHostedFormContainerIds();

        return initializePayment({
            ...options,
            square: {
                cardNumber: {
                    elementId: containerIds.ccNumber,
                },
                cvv: {
                    elementId: containerIds.ccCvv,
                },
                expirationDate: {
                    elementId: containerIds.ccExpiry,
                },
                postalCode: {
                    elementId: containerIds.ccPCode,
                },
                inputClass: 'form-input',
                // FIXME: Need to pass the color values of the theme
                inputStyles: [
                    {
                        color: '#333',
                        fontSize: '13px',
                        lineHeight: '20px',
                    },
                ],
                masterpass: isMasterpassEnabled && {
                    elementId: 'sq-masterpass',
                },
            },
        })
    }, [initializePayment, isMasterpassEnabled]);
/*
    const walletButtons = useMemo(() => (
        <input
            className="button-masterpass"
            id="sq-masterpass"
            type="button"
        />
    ), []);
*/
    return <CreditCardPaymentMethod
        { ...rest }
        method={ method }
        cardFieldset={ getHostedFieldset({
            shouldShowPostalCodeField: true
        }) }
        cardValidationSchema={ hostedValidationSchema }
        getStoredCardValidationFieldset={ getHostedStoredCardValidationFieldset }
        initializePayment= { initializeSquarePayment }
        storedCardValidationSchema={ hostedStoredCardValidationSchema }
    />

    /*
    return <HostedFieldPaymentMethod
        { ...rest }
        cardCodeId="sq-cvv"
        cardExpiryId="sq-expiration-date"
        cardNumberId="sq-card-number"
        initializePayment={ initializeSquarePayment }
        method={ method }
        postalCodeId="sq-postal-code"
        walletButtons={ isMasterpassEnabled && walletButtons }
    />;
    */
};

export default withHostedCreditCardFieldset(SquarePaymentMethod);
