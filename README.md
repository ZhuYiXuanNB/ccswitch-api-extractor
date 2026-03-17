# DeepSeek API 用量查询脚本

适用于 [CC Switch](https://ccswitch.com) 的DeepSeek API余额查询提取器。

## 使用方法

在CC Switch中配置以下提取器代码：

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

## 配置说明

| 变量 | 值 |
|------|-----|
| `{{baseUrl}}` | `https://api.deepseek.com` |
| `{{apiKey}}` | 你的DeepSeek API Key |

## 返回字段

| 字段 | 说明 |
|------|------|
| `isValid` | 账户是否可用 |
| `remaining` | 剩余余额 |
| `unit` | 货币单位 (CNY) |
| `extra` | 赠送/充值余额明细 |

## API 参考

- 官方文档: https://platform.deepseek.com/docs
- 余额查询接口: `GET /user/balance`

## 响应示例

```json
{
  "is_available": true,
  "balance_infos": [
    {
      "currency": "CNY",
      "total_balance": "27.66",
      "granted_balance": "0.00",
      "topped_up_balance": "27.66"
    }
  ]
}
```
