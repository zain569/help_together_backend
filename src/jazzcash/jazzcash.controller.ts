import { Controller, Post, Body } from '@nestjs/common';
import { JazzcashService } from './jazzcash.service.js';

@Controller('jazzcash')
export class JazzcashController {
  constructor(private readonly jazzcashService: JazzcashService) { }

  @Post('create_js_payment')
  createPayment(
    @Body() body: { amount: Number }
  ) {
    return this.jazzcashService.createPayment(Number(body.amount));
  };

  @Post('callback')
  callBack(
    @Body() body: Record<string, string>
  ) {
    const isValid = this.jazzcashService.verifyResponse(body);

    if (!isValid) {
      return {
        success: false,
        message: "Invalid JAZZCASH RESPONSE"
      };
    };

    if (body.pp_ResponseCode === '000') {
      return {
        success: true,
        message: "Payment Successfull",
        transactionReference: body.pp_TxnRefNo
      };
    };

    return {
      success: false,
      message: body.pp_ResponseMessage || "Payment Failed",
      responseCode: body.pp_ResponseCode,
    };
  }
}
