module.exports = function() {
  const bitcoinMessage = require("bitcoinjs-message");

  const Mempool = function() {
    this.addressesOpenForValidation = {};
    this.timeoutRequests = {};
    this.requestValidationTimeStamp = {};
    this.mempoolValid = {};
    this.TimeoutRequestsWindowTime = 5 * 60 * 1000; //TODO 5 *
  };

  Mempool.prototype.addRequestValidation = function async(address) {
    let self = this;
    let validationWindow = 0;
    if (!this.windowTimeIsValidForAddress(address)) {
      this.addressesOpenForValidation[address] = address;
      this.requestValidationTimeStamp[address] = Number(
        new Date()
          .getTime()
          .toString()
          .slice(0, -3)
      );
      this.timeoutRequests[address] = setTimeout(function() {
        self.removeValidationRequest(address);
      }, self.TimeoutRequestsWindowTime);
      validationWindow = this.TimeoutRequestsWindowTime / 1000;
    } else {
      let timeLeft = this.getTimeLeftForAddress(address);
      validationWindow = timeLeft;
    }
    return {
      walletAddress: address,
      requestTimeStamp: this.requestValidationTimeStamp[address],
      message: this.getStarRegistryMessage(address),
      validationWindow: validationWindow
    };
  };

  Mempool.prototype.getTimeLeftForAddress = function(address) {
    let timeElapse =
      Number(
        new Date()
          .getTime()
          .toString()
          .slice(0, -3)
      ) - this.requestValidationTimeStamp[address];

    return this.TimeoutRequestsWindowTime / 1000 - timeElapse;
  };

  Mempool.prototype.getStarRegistryMessage = function(address) {
    return `${address}:${
      this.requestValidationTimeStamp[address]
    }:starRegistry`;
  };

  Mempool.prototype.windowTimeIsValidForAddress = function(address) {
    return this.addressesOpenForValidation[address];
  };

  Mempool.prototype.removeValidationRequest = function(address) {
    this.addressesOpenForValidation[address] = null;
  };

  Mempool.prototype.validadeRequestByWallet = function async(
    address,
    signature
  ) {
    const message = this.getStarRegistryMessage(address);
    const toReturn = {
      registerStar: false,
      status: {
        address: address,
        requestTimeStamp: this.requestValidationTimeStamp[address],
        message: message,
        validationWindow: this.getTimeLeftForAddress(address),
        messageSignature: false
      }
    };
    if (this.windowTimeIsValidForAddress(address)) {
      let isSignatureValid = bitcoinMessage.verify(message, address, signature);
      toReturn.registerStar = true;
      toReturn.status.messageSignature = isSignatureValid;
      if (isSignatureValid) {
        this.mempoolValid[address] = toReturn;
        clearTimeout(this.timeoutRequests[address]);
      }
    }
    return toReturn;
  };

  Mempool.prototype.verifyAddressRequest = function async(address) {
    return this.mempoolValid[address];
  };

  return new Mempool();
};
