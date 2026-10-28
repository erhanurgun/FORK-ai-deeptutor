import test from "node:test";
import assert from "node:assert/strict";

import { catalogText, inlineCopy } from "../i18n/inline-copy";

const catalog: Record<string, string> = { "Built-in tools": "Yerleşik araçlar" };
const t = (key: string) => catalog[key] ?? key;
const copy = { en: "Built-in tools", zh: "内置工具" };

test("English and Chinese keep the inline copy", () => {
  assert.equal(inlineCopy(copy, "en", t), "Built-in tools");
  assert.equal(inlineCopy({ en: "Built-in tools", zh: "内置工具" }, "en-US", () => "changed"), "Built-in tools");
  assert.equal(inlineCopy(copy, "zh-CN", t), "内置工具");
});

test("other languages look the English text up and fall back to it", () => {
  assert.equal(inlineCopy(copy, "tr", t), "Yerleşik araçlar");
  assert.equal(inlineCopy({ en: "Untranslated", zh: "未翻译" }, "tr", t), "Untranslated");
});

test("server text follows the same rule", () => {
  assert.equal(catalogText("Built-in tools", "tr-TR", t), "Yerleşik araçlar");
  assert.equal(catalogText("Built-in tools", "zh", () => "changed"), "Built-in tools");
  assert.equal(catalogText("", "tr", () => "changed"), "");
});
