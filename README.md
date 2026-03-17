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
    url: "{{baseUrl}}/v1/api/openplatform/coding_plan/remains",
    method: "POST",
    headers: {
      "Authorization": "Bearer {{apiKey}}",
      "Content-Type": "application/json"
    }
  },
  extractor: function(response) {
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
```

#### MiniMax 配置说明

| 变量 | 值 |
|------|-----|
| `{{baseUrl}}` | `https://www.minimaxi.com` |
| `{{apiKey}}` | 你的MiniMax API Key |

## 贡献

欢迎提交PR添加更多模型的提取器！请确保：
1. 每个模型一个独立的提取器文件
2. 提取器代码符合CC Switch的格式要求
3. 更新本README的支持模型列表
