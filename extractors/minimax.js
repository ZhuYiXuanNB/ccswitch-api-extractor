({
  request: {
    url: "https://www.minimaxi.com/v1/api/openplatform/coding_plan/remains",
    method: "GET",
    headers: {
      "Authorization": "Bearer {{apiKey}}"
    }
  },
  extractor: function(response) {
    // MiniMax 返回格式: { base_resp: { status_code: 0, status_msg: "success" }, model_remains: [...] }
    var baseResp = response.base_resp || {};
    var isValid = baseResp.status_code === 0;
    var modelRemains = response.model_remains || [];
    var firstModel = modelRemains[0] || {};

    // 每周总次数 - 每周已用次数 = 剩余次数
    var weeklyTotal = firstModel.current_weekly_total_count || 0;
    var weeklyUsed = firstModel.current_weekly_usage_count || 0;
    var remaining = weeklyTotal - weeklyUsed;

    var modelNames = modelRemains.map(function(m) { return m.model_name; }).join(", ");
    var usagePercent = weeklyTotal > 0 ? Math.round(weeklyUsed / weeklyTotal * 100) : 0;

    return {
      isValid: isValid,
      invalidMessage: isValid ? "" : (baseResp.status_msg || "请求失败"),
      remaining: remaining,
      unit: "次",
      extra: "模型: " + modelNames + " | 已用: " + weeklyUsed + "/" + weeklyTotal + " (" + usagePercent + "%)"
    };
  }
})
