{{- range $i, $r := getCSV "," "csv/test.csv" -}}
{{- $id := index $r 0 -}}
{{- $ImgLink := index $r 7 -}}

{{- if eq (getenv "METHOD") $id }}
---
title: "{{ index $r 1 }}"
description: ''
slug: "{{ index $r 2 }}"
image: "{{ index $r 3 }}"
credit:
  name: "{{ index $r 6 }}"
{{- if $ImgLink }}
  url: "{{ index $r 7 }}"
{{ else }}
{{ end -}}

keywords: ''
categories:
- ''
- ''
date: 20217-01-20 11:00:00 +1100
type: page
template_files: []
resource_files: []
slide_files:
- filepath: "/uploads/slides/"
  filename: "{{ index $r 1 }}"

---
# "{{ index $r 4 }}"

{{ index $r 5 }}

{{ end -}}
{{- end -}}