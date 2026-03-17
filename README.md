# CC Switch API 用量查询脚本集合

为 [CC Switch](https://github.com/farion1231/cc-switch) 设计的API用量查询提取器集合。

## 支持的模型

| 模型 | 提取器文件 | API文档 |
|------|-----------|---------|
| DeepSeek | [deepseek.js](extractors/deepseek.js) | [DeepSeek Docs](https://platform.deepseek.com/docs) |
| MiniMax | [minimax.js](extractors/minimax.js) | [MiniMax Docs](https://platform.minimaxi.com) |

## 快速开始

复制对应代码到 CC Switch 配置用量查询面自定义脚本

### DeepSeek

```javascript
({
  request: {
    url: "https://api.deepseek.com/user/balance",
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer {{apiKey}}"
    }
  },
  extractor: function(response) {
    // DeepSeek 返回格式 : { is_available: true, balance_infos: [{ currency, total_balance, granted_balance, topped_up_balance }] }
    var isValid = response.is_available === true;
    var balanceInfo = response.balance_infos && response.balance_infos[0];
    var remaining = balanceInfo ? parseFloat(balanceInfo.total_balance) : 0;
    var unit = balanceInfo ? balanceInfo.currency : "CNY";

    return {
      isValid: isValid,
      remaining: remaining,
      unit: unit,
      extra: balanceInfo ? " 赠送 :" + balanceInfo.granted_balance + " | 充值 :" + balanceInfo.topped_up_balance : ""
    };
  }
})
```

### MiniMax

```javascript
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
    // 注意: usage_count 字段实际表示剩余次数，而非已用次数
    var intervalTotal = firstModel.current_interval_total_count || 0;
    var intervalRemaining = firstModel.current_interval_usage_count || 0;
    var intervalUsed = intervalTotal - intervalRemaining;
    var usagePercent = intervalTotal > 0 ? Math.round(intervalUsed / intervalTotal * 100) : 0;

    // 每周总量（供参考）
    var weeklyTotal = firstModel.current_weekly_total_count || 0;
    var weeklyRemaining = firstModel.current_weekly_usage_count || 0;
    var weeklyUsed = weeklyTotal - weeklyRemaining;

    // 剩余时间（毫秒转换为小时分钟）
    var remainsTimeMs = firstModel.remains_time || 0;
    var hours = Math.floor(remainsTimeMs / (1000 * 60 * 60));
    var minutes = Math.floor((remainsTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    var remainTimeStr = hours > 0 ? hours + "小时" + minutes + "分钟" : minutes + "分钟";

    var modelNames = modelRemains.map(function(m) { return m.model_name; }).join(", ");

    return {
      isValid: isValid,
      invalidMessage: isValid ? "" : (baseResp.status_msg || "请求失败"),
      remaining: intervalRemaining,
      unit: "次",
      extra: "模型: " + modelNames + " | 重置: " + remainTimeStr + " | 本周: " + weeklyUsed + "/" + weeklyTotal + " | 窗口: " + usagePercent + "%"
    };
  }
})

```

> 注意: MiniMax 采用动态速率限制，5小时时间窗口用完后会重置。

## 贡献

欢迎提交PR添加更多模型的提取器！请确保：
1. 每个模型一个独立的提取器文件
2. 提取器代码符合CC Switch的格式要求
3. 更新本README的支持模型列表
