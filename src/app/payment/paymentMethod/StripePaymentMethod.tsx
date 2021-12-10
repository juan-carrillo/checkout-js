import { PaymentInitializeOptions, StripeElementOptions } from '@bigcommerce/checkout-sdk';
import React, { useCallback, FunctionComponent, Fragment } from 'react';

import { withCheckout, CheckoutContextProps } from '../../checkout';
import { withHostedCreditCardFieldset, WithInjectedHostedCreditCardFieldsetProps } from '../hostedCreditCard';

import { HostedWidgetPaymentMethodProps } from './HostedWidgetPaymentMethod';
import CreditCardPaymentMethod from './CreditCardPaymentMethod';

export type StripePaymentMethodProps = Omit<HostedWidgetPaymentMethodProps, 'containerId'>;

export interface StripeOptions {
    alipay?: StripeElementOptions;
    card: StripeElementOptions;
    cardCvc: StripeElementOptions;
    cardExpiry: StripeElementOptions;
    cardNumber: StripeElementOptions;
    iban: StripeElementOptions;
    idealBank: StripeElementOptions;
}
interface WithCheckoutStripePaymentMethodProps {
    storeUrl: string;
}
export enum StripeElementType {
    alipay = 'alipay',
    card = 'card',
    cardCvc = 'cardCvc',
    cardExpiry = 'cardExpiry',
    cardNumber = 'cardNumber',
    iban = 'iban',
    idealBank = 'idealBank',
}
const StripePaymentMethod: FunctionComponent<StripePaymentMethodProps & WithInjectedHostedCreditCardFieldsetProps & WithCheckoutStripePaymentMethodProps> = ({
    initializePayment,
    getHostedFieldset,
    hostedValidationSchema,
    getHostedFormContainerIds,
    getHostedFormOptions,
    getHostedStoredCardValidationFieldset,
    hostedStoredCardValidationSchema,
    method,
    storeUrl,
    ...rest
    }) => {
    const { useIndividualCardFields } = method.initializationData;
    const paymentMethodType = method.id as StripeElementType;
    // const additionalStripeV3Classes = paymentMethodType !== StripeElementType.alipay ? 'optimizedCheckout-form-input widget--stripev3' : '';
    const containerId = `stripe-${paymentMethodType}-component-field`;
    const classes = {
        base: 'form-input optimizedCheckout-form-input',
    };
    const stripeOptions: StripeOptions = {
        [StripeElementType.card]: {
            classes,
        },
        [StripeElementType.cardCvc]: {
            classes,
            placeholder: '',
        },
        [StripeElementType.cardExpiry]: {
            classes,
        },
        [StripeElementType.cardNumber]: {
            classes,
            showIcon: true,
            placeholder: '',
        },
        [StripeElementType.iban]: {
            classes,
            supportedCountries: ['SEPA'],
        },
        [StripeElementType.idealBank]: {
            classes,
        },
    };

    const getIndividualCardElementOptions = useCallback((stripeInitializeOptions: StripeOptions) => {
        const containersIds = getHostedFormContainerIds();

        return {
            cardNumberElementOptions: {
                ...stripeInitializeOptions[StripeElementType.cardNumber],
                containerId: containersIds.ccNumber
            },
            cardExpiryElementOptions: {
                ...stripeInitializeOptions[StripeElementType.cardExpiry],
                containerId: containersIds.ccExpiry
            },
            cardCvcElementOptions: {
                ...stripeInitializeOptions[StripeElementType.cardCvc],
                containerId: containersIds.ccCvv
            },
        };
    }, []);

    const getStripeOptions = useCallback((stripeInitializeOptions: StripeOptions) => {
        if (useIndividualCardFields) {
            return getIndividualCardElementOptions(stripeInitializeOptions);
        }

        return stripeInitializeOptions[paymentMethodType];
    }, [paymentMethodType, getIndividualCardElementOptions, useIndividualCardFields]);

    const initializeStripePayment: HostedWidgetPaymentMethodProps['initializePayment'] = useCallback(async (options: PaymentInitializeOptions, selectedInstrument) => {
        return initializePayment({
            ...options,
            stripev3: { containerId,
                options: getStripeOptions(stripeOptions),
                ...(selectedInstrument && { form : await getHostedFormOptions(selectedInstrument) })},
        });
    }, [initializePayment, containerId, getStripeOptions, stripeOptions, getHostedFormOptions]);

    return (
        <Fragment>
            <CreditCardPaymentMethod
                { ...rest }
                method={ method }
                cardFieldset={ getHostedFieldset(false) }
                cardValidationSchema={ hostedValidationSchema }
                getStoredCardValidationFieldset={ getHostedStoredCardValidationFieldset }
                initializePayment= { initializeStripePayment }
                storedCardValidationSchema={ hostedStoredCardValidationSchema }
            />
        </Fragment>
    );
    /**
     * {
            method.id === 'iban' &&
            <p className="stripe-sepa-mandate-disclaimer">
                <TranslatedString data={ {storeUrl} } id="payment.stripe_sepa_mandate_disclaimer" />
            </p>
        }
     */
};

function mapFromCheckoutProps(
    { checkoutState }: CheckoutContextProps) {
    const { data: { getConfig } } = checkoutState;
    const config = getConfig();

    if (!config) {
        return null;
    }

    return {
        storeUrl: config.links.siteLink,
    };
}

export default withHostedCreditCardFieldset(withCheckout(mapFromCheckoutProps)(StripePaymentMethod));
