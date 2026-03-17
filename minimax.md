脚本编写说明：
配置格式：
({
  request: {
    url: "{{baseUrl}}/api/usage",
    method: "POST",
    headers: {
      "Authorization": "Bearer {{apiKey}}",
      "User-Agent": "cc-switch/1.0"
    }
  },
  extractor: function(response) {
    return {
      isValid: !response.error,
      remaining: response.balance,
      unit: "USD"
    };
  }
})
extractor 返回格式（所有字段均为可选）：
• isValid: 布尔值，套餐是否有效
• invalidMessage: 字符串，失效原因说明（当 isValid 为 false 时显示）
• remaining: 数字，剩余额度
• unit: 字符串，单位（如 "USD"）
• planName: 字符串，套餐名称
• total: 数字，总额度
• used: 数字，已用额度
• extra: 字符串，扩展字段，可自由补充需要展示的文本
💡 提示：
• 变量 {{apiKey}} 和 {{baseUrl}} 会自动替换
• extractor 函数在沙箱环境中执行，支持 ES2020+ 语法
```
curl --location 'https://www.minimaxi.com/v1/api/openplatform/coding_plan/remains' \
--header 'Authorization: Bearer <API Key>' \
--header 'Content-Type: application/json'
```