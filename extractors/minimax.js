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
    // remains_time 单位是毫秒，转换为Tokens显示（估算）
    var remainsTime = firstModel.remains_time || 0;

    var modelNames = modelRemains.map(function(m) { return m.model_name; }).join(", ");

    return {
      isValid: isValid,
      invalidMessage: isValid ? "" : (baseResp.status_msg || "请求失败"),
      remaining: remainsTime,
      unit: "ms",
      extra: "模型: " + modelNames
    };
  }
})
