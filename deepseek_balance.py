#!/usr/bin/env python3
"""
DeepSeek API 用量查询脚本
用于CC Switch获取账户余额信息
"""

import requests
import json
import sys


def query_deepseek_balance(api_token: str) -> dict:
    """
    查询DeepSeek账户余额

    Args:
        api_token: DeepSeek API密钥

    Returns:
        包含余额信息的字典
    """
    url = "https://api.deepseek.com/user/balance"

    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {api_token}"
    }

    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"请求错误: {e}", file=sys.stderr)
        sys.exit(1)


def format_balance_info(data: dict) -> str:
    """
    格式化余额信息输出

    Args:
        data: API响应数据

    Returns:
        格式化的余额信息字符串
    """
    if not data.get("is_available"):
        return "❌ 账户不可用"

    balance_infos = data.get("balance_infos", [])
    if not balance_infos:
        return "⚠️ 未找到余额信息"

    lines = ["=" * 40]
    lines.append("DeepSeek API 账户余额查询")
    lines.append("=" * 40)

    for info in balance_infos:
        currency = info.get("currency", "N/A")
        total = info.get("total_balance", "0")
        granted = info.get("granted_balance", "0")
        topped_up = info.get("topped_up_balance", "0")

        lines.append(f"\n💰 货币: {currency}")
        lines.append(f"   总余额: {total}")
        lines.append(f"   赠送余额: {granted}")
        lines.append(f"   充值余额: {topped_up}")

    lines.append("\n" + "=" * 40)

    return "\n".join(lines)


def main():
    # DeepSeek API Token (从readme.txt中获取)
    API_TOKEN = "sk-a3cbf46275cd421faff571e6cd86904f"

    print("正在查询DeepSeek账户余额...\n")

    result = query_deepseek_balance(API_TOKEN)
    print(format_balance_info(result))

    # 输出JSON格式（供CC Switch解析）
    print("\n--- JSON格式 ---")
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
