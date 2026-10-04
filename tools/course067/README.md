# Curso 067 — ejecución gratuita en GitHub Actions

El workflow revisa el calendario diariamente a las 13:00 UTC (08:00 Bogotá). GitHub puede retrasar la ejecución. Usa un runner estándar y no instala servicios pagados. También ejecuta pruebas al subir cambios o iniciarlo manualmente.

No subir tarjetas, nombres, chats ni credenciales al repositorio público. El calendario se recibe mediante el secreto `COURSE067_CALENDAR_JSON`, con el contenido de `data/birthdays-course-067.json` del paquete privado entregado al usuario. Nunca imprime nombres o mensajes en los registros ni en resúmenes públicos. Sin ese secreto, informa `pending_private_calendar`.

Esta etapa solo evalúa reciprocidad y prepara mensajes; no envía mensajes a WhatsApp. La vinculación y un registro persistente de entregas deben completarse antes de habilitar envíos. No hay sesión de WhatsApp Web ni publicación directa al grupo en este workflow.

## Preparación segura de activación

La revisión usa el calendario en memoria, valida su estructura y solo imprime estados genéricos. `daily.mjs`, `sendDueBirthdayMessages` y `sendWhatsAppText` no permiten envíos reales; ninguna variable de entorno elimina este bloqueo. Prueba reproducible: `node --test tools/course067/*.test.mjs`. No usa red, calendarios reales ni registro de producción.

### Registro persistente preparado

`DeliveryLedger` requiere un directorio absoluto en un volumen POSIX **privado y persistente fuera del checkout**, con permisos 0700, y una clave secreta estable de al menos 32 bytes. No usar cache, artifacts, commits, ramas, issues o logs de este repositorio público para guardar el registro. Los runners estándar de Actions son efímeros: este workflow no tiene todavía un volumen persistente y no declara entregas registradas.

La clave de cada entrega es HMAC-SHA256(grupo, fecha local completa, destino); no incluye nombres, tarjetas, mensajes ni teléfonos en claro. No depende de la lista de cumpleañeros, para impedir duplicados si se corrige el calendario. Cada destinatario tiene una reserva exclusiva, sincronizada a disco antes del futuro envío; procesos concurrentes y reinicios conservan el bloqueo. Tras la aceptación del proveedor se puede escribir un marcador aparte. `provider_accepted` no demuestra entrega ni lectura ni publicación en el grupo.

Una reserva sin aceptación se trata como resultado incierto: **no reintentar automáticamente**. Antes de recuperar una reserva, reconciliar privadamente con el proveedor. El fallo de disco bloquea el envío. Probar persistencia al reemplazar/reiniciar el ejecutor y conservar backups privados; no rotar la clave HMAC sin migración, pues cambiaría las claves de deduplicación. Esta implementación está preparada y probada, pero no conectada a un transporte real.

### Entradas privadas pendientes

- `COURSE067_CALENDAR_JSON`: objeto con `members`; cada miembro necesita `id` único estable, `firstName`, `birthDate` MM-DD válido, `reciprocity` (`confirmed`, `unresolved`, `not_confirmed`) e `isOwner` booleano opcional. Verificar contra la fuente privada; no convertir incertidumbre en reciprocidad confirmada. No se requieren tarjetas ni el chat completo.
- WhatsApp: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, versión de API vigente verificada y `BIRTHDAY_ADMIN_NUMBERS` con destinatarios confirmados y permiso de contacto. El diseño heredado prepara avisos a administradores individuales para publicación; no acredita conexión ni publicación directa al grupo. Verificar identidad del número, permisos del token y requisitos del tipo de mensaje mediante comprobaciones de lectura antes de diseñar el transporte. Si se incorporan webhooks: también `WHATSAPP_VERIFY_TOKEN`, `META_APP_SECRET` y un endpoint privado con firma obligatoria.
- Registro: `COURSE067_LEDGER_DIR` en almacenamiento privado persistente y `COURSE067_LEDGER_HMAC_KEY` secreto estable aleatorio (32 bytes o más). En el ejecutor futuro estos valores deben pasarse al constructor; no están conectados al workflow de revisión. Para almacenamiento remoto, harán falta su endpoint y credenciales privadas y un adaptador con reserva atómica equivalente.

No se requiere OpenAI API key para esta revisión ni para el saludo basado en plantilla. Tras configurar estas entradas, falta verificar el almacenamiento y la cuenta sin enviar, integrar el transporte con reserva previa y reconciliación, y revisar un cambio explícito de activación. No habilitar envíos por el mero hecho de que las pruebas o Actions estén verdes.
