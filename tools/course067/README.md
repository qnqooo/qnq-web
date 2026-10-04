# Curso 067 — ejecución gratuita en GitHub Actions

El workflow revisa el calendario diariamente a las 13:00 UTC (08:00 Bogotá). GitHub puede retrasar la ejecución. Usa un runner estándar y no instala servicios pagados. También ejecuta pruebas al subir cambios o iniciarlo manualmente.

No subir tarjetas, nombres, chats ni credenciales al repositorio público. El calendario se recibe mediante el secreto `COURSE067_CALENDAR_JSON`, con el contenido de `data/birthdays-course-067.json` del paquete privado entregado al usuario. Nunca imprime nombres o mensajes en los registros ni en resúmenes públicos. Sin ese secreto, informa `pending_private_calendar`.

Esta etapa solo evalúa reciprocidad y prepara mensajes; no envía mensajes a WhatsApp. La vinculación y un registro persistente de entregas deben completarse antes de habilitar envíos. No hay sesión de WhatsApp Web ni publicación directa al grupo en este workflow.
