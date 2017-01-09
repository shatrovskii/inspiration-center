Пример конфигурирования раздела inspiration-center
=

Cоздаем файл с названием раздела, например, example.yml.

Содержимое файла:
```
title: Create agile boards
description: User story maps, kanban boards and retrospectives.
image: agile.png
visible: false
demoBoards:
  # Kanban Demo Board
  - iXjVOf1y2y8=
templates:
  # User Story Map
  - 3074457345769008393
  # Template
  - 3074457345769008122
videos:
  # Video from Vimeo
  - https://vimeo.com/106236408
  # Video from Youtube
  - https://www.youtube.com/watch?v=Ti2g66b7MUo
caseStudies:
  - https://help.realtimeboard.com/solution/articles/11000008278-achieve-goals-with-distributed-agile-teams
articles:
  - https://realtimeboard.com/blog/building-product-roadmap-template/#.WFKSLXV97CI
```

- image - название файла с иконкой, которая будет отображаться для этого раздела inspiration-center.
- visible - необязательное поле. Если значение = `false`, то раздел не будет отображаться в списке основных use cases.
Но его можно будет открыть, каким-нибудь другим действием, например, попав в приложение с какой-нибудь страницы сайта.
- videos - ссылки на видео контент. Пока поддерживаются только видео с Youtube и Vimeo.
- символы `#` используются в качестве комментариев, для удобства и не влияют на конечную конфигурацию.
