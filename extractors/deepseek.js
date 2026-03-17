({
  request: {
    url: "{{baseUrl}}/user/balance",
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer {{apiKey}}"
    }
  },
  extractor: function(response) {
    // DeepSeek返回格式: { is_available: true, balance_infos: [{ currency, total_balance, granted_balance, topped_up_balance }] }
    var isValid = response.is_available === true;
    var balanceInfo = response.balance_infos && response.balance_infos[0];
    var remaining = balanceInfo ? parseFloat(balanceInfo.total_balance) : 0;
    var unit = balanceInfo ? balanceInfo.currency : "CNY";

    return {
      isValid: isValid,
      remaining: remaining,
      unit: unit,
      extra: balanceInfo ? "赠送:" + balanceInfo.granted_balance + " | 充值:" + balanceInfo.topped_up_balance : ""
    };
  }
})
