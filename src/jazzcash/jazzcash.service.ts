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

  // TRANSACTION REFERENCE

  private generateTransactionReference(): string {
    const now = new Date();

    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1,).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    return (
      `HT${year}${month}${day}` + `${hours}${minute}${second}`
    );
  };

  // TRANSACTION DATE TIME

  private getJazzCashDateTime(): string {
    const now = new Date();

    return (
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0')
    );
  };

  // EXPIRY DATE TIME

  private getJazzCashExpiryDateTime(): string {
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    return (
      expiry.getFullYear().toString() +

      String(expiry.getMonth() + 1).padStart(2, '0') +
      String(expiry.getDate()).padStart(2, '0') +
      String(expiry.getHours()).padStart(2, '0') +
      String(expiry.getMinutes()).padStart(2, '0') +
      String(expiry.getSeconds()).padStart(2, '0')
    );
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
