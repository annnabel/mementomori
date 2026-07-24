# Graph filtering by people

_Started 2026-07-24 00:59 UTC_

---

## User

make the graph filterable by people 
update Life expectancy at birth in Australia is 81.1 years for males and 85.1 years for females,

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_set_props]_

_[tool: ready_for_verification]_

Done pending review. The chart legend is now tap-to-filter (each person toggles their line and tooltip row), and the hero has a Female / Male / Average life-expectancy selector using the Australian figures (85.1 / 81.1 / 83.1 years) — the weeks grid and caption update accordingly. The old fixed-lifespan tweak was replaced by this selector.

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Fixed — the sex buttons no longer wrap their labels.

