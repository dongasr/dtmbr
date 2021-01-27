{{- range $i, $r := getCSV "," "data/test.csv" -}}
{{- $id := index $r 0 -}}
{{- if eq (getenv "METHOD") $id }}
---
title: "{{ index $r 0 | title }}"
date: {{ .Date }}
---
{{ end -}}
{{- end -}}