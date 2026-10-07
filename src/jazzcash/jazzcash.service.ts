import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto'


@Injectable()
export class JazzcashService {
  private readonly merchantId: string;
  private readonly password: string;
  private readonly integritySalt: string;
  private readonly returnUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.merchantId = this.configService.get<string>('JAZZCASH_MERCHANT_ID')!;

    this.password = this.configService.get<string>('JAZZCASH_PASSWORD')!;

    this.integritySalt = this.configService.get<string>('JAZZCASH_INTEGRITY_SALT')!;

    this.returnUrl = this.configService.get<string>('JAZZCASH_RETURN_URL')!;

    this.validateConfiguration();
  }

  private validateConfiguration(): void {
    if (!this.merchantId) {
      throw new Error("JAZZCASH_MERCHANT_ID is missing")
    };

    if (!this.password) {
      throw new Error("JAZZCASH_PASSWORD is missing")
    };

    if (!this.integritySalt) {
      throw new Error("JAZZCASH_INTEGRITY_SALT is missing")
    };

    if (!this.returnUrl) {
      throw new Error("RETURN_URL is missing")
    };
  }

  createPayment(amount: number) {
    try {
      if (!amount || amount <= 150) {
        throw new Error("Amount is Larger then 150 PKR");
      };

      const txnRefNo = this.generateTransactionReference();
      const txnDateTime = this.getJazzCashDateTime();
      const txnExpiryDateTime = this.getJazzCashExpiryDateTime();

      const paymentData: Record<string, string> = {
        pp_Version: '1.1',
        pp_TxnType: 'MWALLET',
        pp_Language: 'EN',
        pp_MerchantID: this.merchantId,
        pp_SubMerchantID: '',
        pp_Password: this.password,
        pp_BankID: 'TBANK',
        pp_ProductID: 'RETL',
        pp_TxnRefNo: txnRefNo,
        pp_Amount: this.formatAmount(amount),
        pp_TxnCurrency: 'PKR',
        pp_TxnDateTime: txnDateTime,
        pp_BillReference: `HT-${txnRefNo}`,
        pp_Description: 'HelpTogether Donation',
        pp_TxnExpiryDateTime: txnExpiryDateTime,
        pp_ReturnURL: this.returnUrl,
        ppmpf_1: '',
        ppmpf_2: '',
        ppmpf_3: '',
        ppmpf_4: '',
        ppmpf_5: '',
      };

      const secureHash = this.generateSecureHash(paymentData);

      paymentData.pp_SecureHash = secureHash;

      return {
        transactionReference: txnRefNo,
        paymentData,
      };
    } catch (err) {
      console.error(
        'JazzCash payment creation error:',
        err,
      );

      throw new InternalServerErrorException(
        'Unable to create JazzCash payment',
      );
    }
  }

  // Make a time zone for a jazzcash

  private formatJazzCashDateTime(date: Date): string {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);

    const values = Object.fromEntries(
      parts
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, part.value]),
    );

    return (
      values.year +
      values.month +
      values.day +
      values.hour +
      values.minute +
      values.second
    );
  }

  // TRANSACTION REFERENCE

  private generateTransactionReference(): string {
    return `HT${this.formatJazzCashDateTime(new Date())}`
  };

  // TRANSACTION DATE TIME

  private getJazzCashDateTime(): string {
    return this.formatJazzCashDateTime(new Date())
  };

  // EXPIRY DATE TIME

  private getJazzCashExpiryDateTime(): string {
    return this.formatJazzCashDateTime(
      new Date(Date.now() + 60 * 60 * 1000)
    )
  };

  // AMOUNT

  private formatAmount(amount: number): string {
    return Math.round(amount * 100).toString();
  };

  // SECURE HASH

  private generateSecureHash(data: Record<string, string>): string {
    const fields = Object.keys(data)
      .filter((key) => key !== 'pp_SecureHash' && data[key] !== undefined && data[key] !== null && data[key] !== '',
      ).sort();

    const hashString = this.integritySalt + fields.map((key) => data[key]).join('');

    return crypto
      .createHmac('sha256', this.integritySalt)
      .update(hashString)
      .digest('hex')
      .toUpperCase();
  };

  // VERIFY RESPONSE

  verifyResponse(response: Record<string, string>): boolean {
    const receivedHash = response.pp_SecureHash;

    if (!receivedHash) {
      return false;
    }

    const calculatedHash = this.generateSecureHash(response);

    return (
      calculatedHash.toUpperCase() === receivedHash.toUpperCase()
    );
  }
}
