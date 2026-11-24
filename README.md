# Awesome Skills

面向 AI 编程工具的精选技能（Skills）合集，由 EdgeOne 团队维护。每个子目录是一个独立 Skill，围绕真实交付场景打磨，而不是泛泛的能力清单。

## Skills 目录

| Skill | 说明 |
|---|---|
| [frontend-design](frontend-design/) | 界面设计交付 · 中文增强版：把一句话 brief 变成有立场的方向提案、可复用的设计令牌和可运行的前端代码，内置中文排版与反模板化设计规则 |

## 使用方式

每个 Skill 目录内含 `SKILL.md`（完整行为说明）与 `README.md`（介绍与用法）。进入对应目录阅读文档，按你所用 AI 编程工具的 Skill 安装方式接入即可。

以 `frontend-design` 为例：

```bash
npx skills add TencentEdgeOne/awesome-skills/frontend-design
```

安装后，在支持 Skill 的 AI 编程工具中直接描述你的需求即可触发。

## 贡献

欢迎通过 Pull Request 提交新的 Skill 或改进建议。提交前请确保：

- 每个Skill独立一个子目录，目录名即 Skill 名；
- 包含 `SKILL.md`（带 frontmatter 元数据）与 `README.md`；
- 附带许可证信息，默认推荐 Apache-2.0。

## 许可证

本仓库内容遵循各子目录内声明的许可证，默认为 [Apache License 2.0](frontend-design/LICENSE.txt)。
