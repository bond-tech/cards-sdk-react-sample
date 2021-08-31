class BondCards {
  constructor() {
    this.BONDSTUDIO = '/api/v0/cards';
    this.ENV_ID = process.env.REACT_APP_ENV_ID;
    this.ENV = 'sandbox';

    // // Internal Collect.js initialization
    this.internalForm = window.VGSCollect.create(this.ENV_ID, this.ENV, function (state) {});
  }

  field({
    selector,
    type,
    css = {},
    placeholder,
    successColor,
    errorColor,
    color,
    lineHeight,
    fontSize,
    fontFamily,
    disabled,
    readOnly,
    autoFocus,
    hideValue = true,
  }) {
    const validations = type === 'new_pin' ? ['required'] : [];
    if (type === 'confirm_pin')
      validations.push({
        type: 'compareValue',
        params: {
          field: 'new_pin',
          function: 'match',
        },
      });

    const requestParams = {
      type: 'card-security-code',
      validations: validations,
      name: type,
      css,
      placeholder,
      successColor,
      errorColor,
      color,
      lineHeight,
      fontSize,
      fontFamily,
      disabled,
      readOnly,
      autoFocus,
      hideValue,
    };

    return new Promise((resolve, reject) => {
      const newField = this.internalForm.field(selector, requestParams);
      if (newField) {
        resolve(newField);
      } else {
        reject(`Field ${type} not initialized.`);
      }
    });
  }

  submit({
    cardId,
    identity,
    authorization,
    currentPin = undefined,
    newPin,
    successCallback,
    errorCallback,
  }) {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Identity: identity,
        Authorization: authorization,
      },
      data: {
        card_id: cardId,
        new_pin: newPin,
      },
    };

    return new Promise((resolve, reject) => {
      const submitResult = this.internalForm.submit(
        `${this.BONDSTUDIO}/set_pin`,
        options,
        successCallback,
        errorCallback
      );
      if (submitResult) {
        resolve(submitResult);
      } else {
        reject('Form Submit failed.');
      }
    });
  }
}

module.exports = BondCards;
