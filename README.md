# CC Switch API 用量查询脚本集合

为 [CC Switch](https://ccswitch.com) 设计的API用量查询提取器集合。

## 支持的模型

| 模型 | 提取器文件 | API文档 |
|------|-----------|---------|
| DeepSeek | [deepseek.js](extractors/deepseek.js) | [DeepSeek Docs](https://platform.deepseek.com/docs) |
| MiniMax | [minimax.js](extractors/minimax.js) | [MiniMax Docs](https://platform.minimaxi.com) |

## 快速开始

在CC Switch中配置对应的提取器代码。

### DeepSeek

```javascript
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
```

#### 配置说明

| 变量 | 值 |
|------|-----|
| `{{baseUrl}}` | `https://api.deepseek.com` |
| `{{apiKey}}` | 你的DeepSeek API Key |

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
    var baseResp = response.base_resp || {};
    var isValid = baseResp.status_code === 0;
    var modelRemains = response.model_remains || [];
    var firstModel = modelRemains[0] || {};
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
```

#### MiniMax 配置说明

| 变量 | 值 |
|------|-----|
| `{{apiKey}}` | 你的MiniMax API Key |

## 贡献

欢迎提交PR添加更多模型的提取器！请确保：
1. 每个模型一个独立的提取器文件
2. 提取器代码符合CC Switch的格式要求
3. 更新本README的支持模型列表
