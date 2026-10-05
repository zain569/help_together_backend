import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!
    )
  }
  async createCheckoutSession(
    amount: number,
    donationId: string,
  ) {

    const frontend_url = this.configService.get<string>('FRONTEND_URL')!
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'pkr',

            product_data: {
              name: 'Donation',
            },

            unit_amount: Math.round(amount * 100),
          },
          quantity: 1
        },
      ],

      metadata: {
        donationId,
      },

      success_url: `${frontend_url}payment-success`,

      cancel_url: `${frontend_url}payment-cancel`
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url,
    }
  };

  constructWebhookEvent(
    payload: Buffer,
    signature: string,
  ) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET')!,
    )
  }

  // src/stripe/stripe.service.ts

  async createSubscription(
    email: string,
    frequency: string,
    subscriptionId: string,
  ) {
    let priceId: string | undefined;

    if (frequency === 'monthly') {
      priceId = this.configService.get<string>(
        'STRIPE_MONTHLY_PRICE_ID',
      );
    }

    if (frequency === 'yearly') {
      priceId = this.configService.get<string>(
        'STRIPE_YEARLY_PRICE_ID',
      );
    }

    if (!priceId) {
      throw new Error('Invalid subscription frequency');
    }

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL');

    const session =
      await this.stripe.checkout.sessions.create({
        mode: 'subscription',

        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        customer_email: email,

        metadata: {
          subscriptionId,
        },

        success_url:
          `${frontendUrl}payment-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${frontendUrl}payment-cancel`,
      });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }
}
