# 单元测试覆盖率优化 Spec

## Why
lego-mobile项目的单元测试需要达到90%以上的行覆盖率，当前部分测试文件存在失败问题需要修复，并且需要补充测试用例以达到覆盖率目标。

## What Changes
- 修复所有失败的单元测试文件
- 解决Jest环境teardown后的定时器问题
- 运行全量单元测试并生成覆盖率报告
- 补充测试用例使每个文件行覆盖率>=90%

## Impact
- Affected specs: 无
- Affected code: 所有测试文件(*.test.js)和jest.setup.js

## ADDED Requirements
### Requirement: 单元测试执行
系统应能够逐个运行所有单元测试文件，每个测试文件必须全部通过后才能运行下一个。

#### Scenario: 测试文件执行
- **WHEN** 运行单个测试文件
- **THEN** 所有测试用例必须通过
- **AND** 如果有失败，必须修复后再运行下一个

### Requirement: 覆盖率报告
系统应生成行覆盖率报告，每个源文件的行覆盖率必须>=90%。

#### Scenario: 覆盖率检查
- **WHEN** 运行全量测试并生成覆盖率报告
- **THEN** 检查每个文件的行覆盖率
- **AND** 如果覆盖率<90%，补充测试用例

## MODIFIED Requirements
无

## REMOVED Requirements
无
