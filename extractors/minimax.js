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

    // 当前时间窗口（5小时）的用量
    var intervalTotal = firstModel.current_interval_total_count || 0;
    var intervalUsed = firstModel.current_interval_usage_count || 0;
    var remaining = intervalTotal - intervalUsed;
    var usagePercent = intervalTotal > 0 ? Math.round(intervalUsed / intervalTotal * 100) : 0;

    // 每周总量（供参考）
    var weeklyTotal = firstModel.current_weekly_total_count || 0;
    var weeklyUsed = firstModel.current_weekly_usage_count || 0;

    var modelNames = modelRemains.map(function(m) { return m.model_name; }).join(", ");

    return {
      isValid: isValid,
      invalidMessage: isValid ? "" : (baseResp.status_msg || "请求失败"),
      remaining: remaining,
      unit: "次",
      extra: "模型: " + modelNames + " | 本周: " + weeklyUsed + "/" + weeklyTotal + " | 窗口: " + usagePercent + "%"
    };
  }
})
