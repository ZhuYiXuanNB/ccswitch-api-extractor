({
  request: {
    url: "{{baseUrl}}/v1/api/openplatform/coding_plan/remains",
    method: "POST",
    headers: {
      "Authorization": "Bearer {{apiKey}}",
      "Content-Type": "application/json"
    }
  },
  extractor: function(response) {
    // MiniMax返回格式示例: { code: 0, msg: "success", data: { balance: "100.00", ... } }
    var isValid = response.code === 0;
    var data = response.data || {};
    var remaining = parseFloat(data.balance) || 0;

    return {
      isValid: isValid,
      invalidMessage: isValid ? "" : (response.msg || "请求失败"),
      remaining: remaining,
      unit: "USD",
      extra: data.plan_name ? "套餐: " + data.plan_name : ""
    };
  }
})
