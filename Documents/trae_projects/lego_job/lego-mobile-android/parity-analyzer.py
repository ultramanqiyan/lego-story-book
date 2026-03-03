#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Android 与 React Native 一致性对比分析工具
用于对比 React Native 和 Android 原生实现的差异
"""

import os
import re
import json
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Optional, Any
from datetime import datetime

# 项目路径配置
RN_PROJECT_PATH = Path(r"c:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile")
ANDROID_PROJECT_PATH = Path(r"c:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile-android")
OUTPUT_DIR = ANDROID_PROJECT_PATH / "parity-reports"

@dataclass
class ComparisonItem:
    name: str
    rn_status: str  # "exists", "missing", "partial"
    android_status: str
    rn_file: Optional[str] = None
    android_file: Optional[str] = None
    differences: List[str] = field(default_factory=list)
    priority: str = "P2"  # P0, P1, P2, P3

@dataclass 
class ComparisonResult:
    category: str
    items: List[ComparisonItem] = field(default_factory=list)
    total: int = 0
    matching: int = 0
    missing: int = 0
    partial: int = 0

def ensure_output_dir():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def find_rn_screens() -> Dict[str, Path]:
    screens = {}
    screens_dir = RN_PROJECT_PATH / "src" / "screens"
    if screens_dir.exists():
        for js_file in screens_dir.rglob("*.js"):
            name = js_file.stem
            screens[name] = js_file
    return screens

def find_android_screens() -> Dict[str, Path]:
    screens = {}
    screens_dir = ANDROID_PROJECT_PATH / "app" / "src" / "main" / "java" / "com" / "legostory" / "mobile" / "ui" / "screens"
    if screens_dir.exists():
        for kt_file in screens_dir.rglob("*.kt"):
            name = kt_file.stem
            screens[name] = kt_file
    return screens

def find_rn_components() -> Dict[str, Path]:
    components = {}
    components_dir = RN_PROJECT_PATH / "src" / "components"
    if components_dir.exists():
        for js_file in components_dir.rglob("*.js"):
            name = js_file.stem
            components[name] = js_file
    return components

def find_android_components() -> Dict[str, Path]:
    components = {}
    components_dir = ANDROID_PROJECT_PATH / "app" / "src" / "main" / "java" / "com" / "legostory" / "mobile" / "ui" / "components"
    if components_dir.exists():
        for kt_file in components_dir.rglob("*.kt"):
            name = kt_file.stem
            components[name] = kt_file
    return components

def compare_screens() -> ComparisonResult:
    result = ComparisonResult(category="屏幕/页面")
    
    rn_screens = find_rn_screens()
    android_screens = find_android_screens()
    
    screen_mapping = {
        "LoginScreen": "LoginScreen",
        "HomeScreen": "HomeScreen", 
        "BookshelfScreen": "BookshelfScreen",
        "CharactersScreen": "CharactersScreen",
        "SettingsScreen": "SettingsScreen",
        "BookDetailScreen": "BookDetailScreen",
        "ChapterScreen": "ChapterScreen",
        "StoryCreateScreen": "StoryCreateScreen",
        "ThemeSettingsScreen": "ThemeSettingsScreen",
        "ParentControlScreen": "ParentControlScreen",
        "AdventureScreen": "AdventureScreen",
        "LoadingScreen": None,
        "StoryDirectorScreen": None,
        "ShareScreen": None,
        "DemoScreen": "DemoScreen",
        "Card3DDemoScreen": None,
        "Demo6Grid2D": None,
        "Demo7Flip3D": None,
        "Demo8FanSpread": None,
        "Demo9HorizontalStack": None,
        "Demo10VerticalStack": None,
    }
    
    for rn_name, android_name in screen_mapping.items():
        rn_exists = rn_name in rn_screens
        android_exists = android_name and android_name in android_screens
        
        if rn_exists and android_exists:
            status = "exists"
            result.matching += 1
            priority = "P2"
        elif rn_exists and not android_exists:
            status = "missing"
            result.missing += 1
            priority = "P0" if rn_name in ["LoadingScreen", "StoryDirectorScreen"] else "P1"
        else:
            continue
            
        item = ComparisonItem(
            name=rn_name,
            rn_status="exists" if rn_exists else "missing",
            android_status="exists" if android_exists else "missing",
            rn_file=str(rn_screens.get(rn_name, "")) if rn_exists else None,
            android_file=str(android_screens.get(android_name, "")) if android_exists else None,
            priority=priority
        )
        result.items.append(item)
        result.total += 1
    
    return result

def compare_components() -> ComparisonResult:
    result = ComparisonResult(category="组件")
    
    rn_components = find_rn_components()
    android_components = find_android_components()
    
    component_mapping = {
        "Button": "Button",
        "Card": "Card",
        "Loading": "Loading",
        "Modal": "Modal",
        "Toast": "Toast",
        "EmptyState": "EmptyState",
        "Header": None,
        "StepIndicator": None,
        "Card3D": None,
        "Card3DVariant": None,
        "CardDeck3D": None,
        "CardDeckVariants": None,
        "Card2D": None,
        "CardSelector2D": None,
        "StagePreview": None,
        "CardDeck": None,
        "WeatherEffect": None,
        "KeywordHighlight": None,
        "PromptPanel": None,
        "CharacterForm": None,
        "MagicParticles": None,
        "ParticleBackground": "ParticleBackground",
        "GlowOrbBackground": None,
    }
    
    for rn_name, android_name in component_mapping.items():
        rn_exists = rn_name in rn_components
        android_exists = android_name and android_name in android_components
        
        if rn_exists and android_exists:
            status = "exists"
            result.matching += 1
            priority = "P2"
        elif rn_exists and not android_exists:
            status = "missing"
            result.missing += 1
            if rn_name in ["Card3D", "CardDeck3D", "Card2D", "CardSelector2D"]:
                priority = "P0"
            elif rn_name in ["StagePreview", "WeatherEffect", "CharacterForm"]:
                priority = "P1"
            else:
                priority = "P2"
        else:
            continue
            
        item = ComparisonItem(
            name=rn_name,
            rn_status="exists" if rn_exists else "missing",
            android_status="exists" if android_exists else "missing",
            rn_file=str(rn_components.get(rn_name, "")) if rn_exists else None,
            android_file=str(android_components.get(android_name, "")) if android_exists else None,
            priority=priority
        )
        result.items.append(item)
        result.total += 1
    
    return result

def compare_animations() -> ComparisonResult:
    result = ComparisonResult(category="动画")
    
    rn_animations_file = RN_PROJECT_PATH / "src" / "utils" / "animations.js"
    android_animations_file = ANDROID_PROJECT_PATH / "app" / "src" / "main" / "java" / "com" / "legostory" / "mobile" / "ui" / "animation" / "AnimationUtils.kt"
    
    animation_items = [
        ("fadeIn", "fadeIn", "P2"),
        ("fadeOut", "fadeOut", "P2"),
        ("slideIn", "slideIn", "P2"),
        ("slideOut", "slideOut", "P2"),
        ("scale", "scale", "P2"),
        ("shake", "shake", "P2"),
        ("pulse", "pulse", "P2"),
        ("bounce", "bounce", "P2"),
        ("cardFlip", "cardFlip", "P1"),
        ("3D卡牌倾斜", None, "P0"),
        ("扇形卡牌布局", None, "P0"),
        ("粒子系统", None, "P1"),
        ("天气特效", None, "P1"),
        ("微交互配置", None, "P2"),
    ]
    
    for rn_name, android_name, priority in animation_items:
        item = ComparisonItem(
            name=rn_name,
            rn_status="exists",
            android_status="exists" if android_name else "missing",
            priority=priority
        )
        if android_name:
            result.matching += 1
        else:
            result.missing += 1
        result.items.append(item)
        result.total += 1
    
    return result

def compare_theme() -> ComparisonResult:
    result = ComparisonResult(category="主题配置")
    
    theme_items = [
        ("基础颜色", "exists", "P2"),
        ("排版系统", "missing", "P0"),
        ("间距系统", "missing", "P0"),
        ("阴影配置", "missing", "P1"),
        ("稀有度颜色", "missing", "P1"),
        ("角色类型颜色", "missing", "P1"),
        ("渐变预设", "missing", "P2"),
        ("主题管理器", "exists", "P2"),
        ("主题切换", "exists", "P2"),
    ]
    
    for name, status, priority in theme_items:
        item = ComparisonItem(
            name=name,
            rn_status="exists",
            android_status=status,
            priority=priority
        )
        if status == "exists":
            result.matching += 1
        else:
            result.missing += 1
        result.items.append(item)
        result.total += 1
    
    return result

def generate_report(results: List[ComparisonResult]) -> Dict:
    report = {
        "generated_at": datetime.now().isoformat(),
        "summary": {
            "total_items": sum(r.total for r in results),
            "matching": sum(r.matching for r in results),
            "missing": sum(r.missing for r in results),
            "partial": sum(r.partial for r in results),
        },
        "categories": {}
    }
    
    for result in results:
        report["categories"][result.category] = {
            "total": result.total,
            "matching": result.matching,
            "missing": result.missing,
            "partial": result.partial,
            "completion_rate": f"{(result.matching / result.total * 100):.1f}%" if result.total > 0 else "0%",
            "items": [asdict(item) for item in result.items]
        }
    
    return report

def save_json_report(report: Dict):
    json_path = OUTPUT_DIR / "parity-report.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(f"JSON报告已保存: {json_path}")

def save_html_report(report: Dict):
    html = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Android vs React Native 一致性对比报告</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .summary { display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; }
        .stat { padding: 15px 25px; border-radius: 8px; font-size: 18px; font-weight: bold; }
        .stat.total { background: #2196F3; color: white; }
        .stat.matching { background: #4CAF50; color: white; }
        .stat.missing { background: #f44336; color: white; }
        .stat.partial { background: #FF9800; color: white; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #4CAF50; color: white; }
        tr:hover { background: #f5f5f5; }
        .status-exists { color: #4CAF50; font-weight: bold; }
        .status-missing { color: #f44336; font-weight: bold; }
        .status-partial { color: #FF9800; font-weight: bold; }
        .priority-P0 { background: #ffebee; }
        .priority-P1 { background: #fff3e0; }
        .timestamp { color: #666; font-size: 12px; }
        .category-header { display: flex; justify-content: space-between; align-items: center; }
        .completion-rate { font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Android vs React Native 一致性对比报告</h1>
        <p class="timestamp">生成时间: """ + report["generated_at"] + """</p>
        
        <div class="summary">
            <div class="stat total">总计: """ + str(report["summary"]["total_items"]) + """</div>
            <div class="stat matching">匹配: """ + str(report["summary"]["matching"]) + """</div>
            <div class="stat missing">缺失: """ + str(report["summary"]["missing"]) + """</div>
        </div>
"""
    
    for category, data in report["categories"].items():
        html += f"""
        <h2>{category} <span class="completion-rate">完成率: {data['completion_rate']}</span></h2>
        <table>
            <tr>
                <th>名称</th>
                <th>RN状态</th>
                <th>Android状态</th>
                <th>优先级</th>
            </tr>
"""
        for item in data["items"]:
            rn_status_class = f"status-{item['rn_status']}"
            android_status_class = f"status-{item['android_status']}"
            priority_class = f"priority-{item['priority']}"
            html += f"""
            <tr class="{priority_class}">
                <td>{item['name']}</td>
                <td class="{rn_status_class}">{item['rn_status']}</td>
                <td class="{android_status_class}">{item['android_status']}</td>
                <td>{item['priority']}</td>
            </tr>
"""
        html += "        </table>\n"
    
    html += """
    </div>
</body>
</html>
"""
    
    html_path = OUTPUT_DIR / "parity-report.html"
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"HTML报告已保存: {html_path}")

def main():
    print("=" * 60)
    print("Android vs React Native 一致性对比分析")
    print("=" * 60)
    
    ensure_output_dir()
    
    print("\n正在分析...")
    
    results = [
        compare_screens(),
        compare_components(),
        compare_animations(),
        compare_theme(),
    ]
    
    report = generate_report(results)
    
    print("\n分析结果:")
    print(f"  总计项目: {report['summary']['total_items']}")
    print(f"  匹配项目: {report['summary']['matching']}")
    print(f"  缺失项目: {report['summary']['missing']}")
    
    for category, data in report["categories"].items():
        print(f"\n  {category}: {data['completion_rate']}")
    
    save_json_report(report)
    save_html_report(report)
    
    print("\n" + "=" * 60)
    print("分析完成!")
    print("=" * 60)

if __name__ == "__main__":
    main()
