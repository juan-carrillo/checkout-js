import { PaymentInitializeOptions } from '@bigcommerce/checkout-sdk';
import React, { useCallback, FunctionComponent, Fragment } from 'react';

import { withHostedCreditCardFieldset, WithInjectedHostedCreditCardFieldsetProps } from '../hostedCreditCard';

import CreditCardPaymentMethod, { CreditCardPaymentMethodProps } from './CreditCardPaymentMethod';
import MollieAPMCustomForm from './MollieAPMCustomForm';

export type MolliePaymentMethodsProps = CreditCardPaymentMethodProps;

export enum MolliePaymentMethodType {
    creditcard = 'credit_card',
}

const MolliePaymentMethod: FunctionComponent<MolliePaymentMethodsProps & WithInjectedHostedCreditCardFieldsetProps > = ({
    initializePayment,
    getHostedFieldset,
    hostedValidationSchema,
    getHostedFormContainerIds,
    method,
    getHostedFormOptions,
    getHostedStoredCardValidationFieldset,
    hostedStoredCardValidationSchema,
    ...props
}) => {
    const containerId = `mollie-${method.method}`;
    const initializeMolliePayment: CreditCardPaymentMethodProps['initializePayment'] = useCallback(async (options: PaymentInitializeOptions, selectedInstrument) => {
        const mollieElements = getMolliesElementOptions();

        return initializePayment({
            ...options,
            mollie: {
                containerId,
                cardNumberId : mollieElements.cardNumberElementOptions.containerId,
                cardCvcId: mollieElements.cardCvcElementOptions.containerId,
                cardHolderId: mollieElements.cardHolderElementOptions.containerId,
                cardExpiryId: mollieElements.cardExpiryElementOptions.containerId,
                styles : {
                    base: {
                        color: '#333333',
                        '::placeholder' : {
                            color: '#999999',
                        },
                    },
                    valid: {
                        color: '#090',
                    },
                    invalid: {
                        color: '#D14343',
                    },
                },
                ...(selectedInstrument && !selectedInstrument?.trustedShippingAddress && { form : await getHostedFormOptions(selectedInstrument) }),
            },
        });
    }, [initializePayment, containerId, getHostedFormOptions]);

    const getMolliesElementOptions = () => {
        const containersIds = getHostedFormContainerIds();

        return {
            cardNumberElementOptions: {
                containerId: containersIds.ccNumber,
            },
            cardExpiryElementOptions: {
                containerId: containersIds.ccExpiry,
            },
            cardCvcElementOptions: {
                containerId: containersIds.ccCvv,
            },
            cardHolderElementOptions: {
                containerId: containersIds.ccName,
            },
        };
    };

    function isCreditCard(): boolean {

        return method.method === MolliePaymentMethodType.creditcard;
    }

    return (
        <Fragment>
            {
                isCreditCard() ?
                    <CreditCardPaymentMethod
                        { ...props }
                        method={ method }
                        cardFieldset={ getHostedFieldset({shouldShowCardNameField: true}) }
                        cardValidationSchema={ hostedValidationSchema }
                        getStoredCardValidationFieldset={ getHostedStoredCardValidationFieldset }
                        initializePayment= { initializeMolliePayment }
                        storedCardValidationSchema={ hostedStoredCardValidationSchema }
                    />
                : <MollieAPMCustomForm method={ method } />
            }
        </Fragment>
    );
};

export default withHostedCreditCardFieldset(MolliePaymentMethod);
