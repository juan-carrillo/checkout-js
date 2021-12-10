import { PaymentInitializeOptions } from '@bigcommerce/checkout-sdk';
import React, { useCallback, FunctionComponent, Fragment, useMemo } from 'react';

import { withHostedCreditCardFieldset, WithInjectedHostedCreditCardFieldsetProps } from '../hostedCreditCard';

import CreditCardPaymentMethod, { CreditCardPaymentMethodProps } from './CreditCardPaymentMethod';

export type SquarePaymentMethodProps = CreditCardPaymentMethodProps;

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

    const walletButtons = useMemo(() => (
        <input
            className="button-masterpass"
            id="sq-masterpass"
            type="button"
        />
    ), []);

    return(
        <Fragment>
            <CreditCardPaymentMethod
                { ...rest }
                method={ method }
                cardFieldset={ getHostedFieldset({ shouldShowPostalCodeField: true }) }
                cardValidationSchema={ hostedValidationSchema }
                getStoredCardValidationFieldset={ getHostedStoredCardValidationFieldset }
                initializePayment= { initializeSquarePayment }
                storedCardValidationSchema={ hostedStoredCardValidationSchema }
            />
            { isMasterpassEnabled && walletButtons }
        </Fragment>
    );
};

export default withHostedCreditCardFieldset(SquarePaymentMethod);
