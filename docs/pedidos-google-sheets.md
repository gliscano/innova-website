# Pedidos con Google Sheets

Cómo funciona el circuito de venta y cómo dejarlo andando. Se configura **una sola vez**.

## Cómo funciona

1. **La vendedora carga el pedido** desde la computadora (menú **Innova → Nuevo pedido** de la
   planilla) o desde el celular (App web, ver paso 1b). La pantalla pide:
   - vendedora (Daniela o Daimary: su botón de WhatsApp es el que ve el cliente);
   - teléfono del cliente (opcional; si ya compró, avisa "Cliente: …", el pedido queda atado a ese
     cliente y el link llega con sus datos);
   - fecha y entrega estimada (precargada: hoy + 12 días hábiles, editable);
   - uno o más productos: producto y medida de la lista de precios (o medida especial con ancho y
     alto), modelo, precio, **precio de diseño**, cantidad y, si **incluye piso**, largo de pared,
     largo de piso y diseño de piso;
   - seña (vacío = se cobra el total). Total y resta se calculan solos.

   Al guardar se crea una fila en **Pedidos** (estado `Esperando datos`) y una fila por producto en
   **Items**. El mensaje para el cliente lista los productos **sin precios**: sólo total, seña y
   resta. "Enviar por WhatsApp" sólo se habilita si se cargó el teléfono; si no, se copia el mensaje.
2. **El cliente abre el link** (`innova54.com/pedido/…`): ve su pedido, completa sus datos y elige
   cómo recibirlo (Andreani, Correo Argentino, Viacargo o Retiro en tienda; sólo Correo Argentino y
   Viacargo piden dirección). Si ya compró antes, el formulario llega precargado y lo puede corregir.
   El DNI y el mail guardados **no se muestran enteros** (sólo "•••456" / "a•••@gmail.com"): si el
   teléfono estaba mal cargado y el link le llega a otra persona, no ve esos datos. Si el cliente los
   deja vacíos, se mantienen los guardados.
3. **Al confirmar**, la fila se completa sola, pasa a `Esperando pago` y el cliente ve los datos para
   transferir y el botón para mandarle el comprobante **a su vendedora**. Además se actualizan
   **Clientes** (una fila por cliente, con su **ID cliente**) y **Envíos** (una fila por dirección
   usada). Se actualiza siempre el cliente del pedido, nunca el del teléfono que se escriba en el
   formulario: escribir el teléfono de otra persona no pisa sus datos.
4. **Seguimiento:** pestaña **Pendientes** del panel (también en el celular), o seleccioná una fila y
   usá **Innova → Recontactar pedido seleccionado**. Arma el recordatorio que corresponde.
5. **Cobros:** cuando veas la plata **acreditada en el banco** (no alcanza con el comprobante, que
   es una imagen y se puede editar), cargá el monto en la columna **Cobrado** (lo acumulado: si
   entró la seña y después el resto, poné la suma). La planilla sola:
   - recalcula **Resta** = Total − Cobrado;
   - pasa el pedido de `Esperando pago` a `Seña recibida` si cubre la seña, o a `Pagado` si cubre
     el total;
   - y el cliente ve en su link cuánto recibimos y cuánto resta.

   Cargá Cobrado después de que el cliente completó sus datos: un pedido en `Esperando datos` no
   avanza solo (si avanzara, el cliente ya no podría completar el formulario).
6. Después cambiá el estado a mano: `En producción` → `Entregado` (o `Cancelado`, que desactiva el
   link).

### Pestañas
- **Pedidos**: ID · Estado · Nombre · Teléfono · ID cliente · Total · Seña · Cobrado · Resta ·
  Vendedora · … (la clave del link va oculta al final).
- **Items**: un producto por fila, con ancho, alto, piso (pared/piso), precio y precio de diseño.
- **Clientes** y **Envíos**: los completa el sitio; sirven para precargar la próxima compra. Cada
  cliente tiene un **ID cliente** único (no lo edites): el teléfono es sólo para encontrarlo.
- **Precios**: la lista del selector. Editala ahí cuando cambien los precios.

Las columnas se buscan **por nombre**: podés reordenarlas o agregar columnas propias. Lo que no hay
que hacer es **renombrar** las existentes.

> **Actualizar el script:** cuando cambien `Pedidos.gs` o `PanelPedido.html`, volvé a pegarlos en
> el editor de Apps Script y ejecutá `configurarPlanilla` otra vez. Si una pestaña tiene el formato
> de una versión anterior, la guarda como "Pedidos (anterior)" (o el nombre que corresponda) y crea
> una nueva vacía: los links de esos pedidos viejos dejan de funcionar. Si ya está al día, no toca
> nada.

> El link no tiene datos adentro, sólo una clave aleatoria: el sitio siempre lee el pedido de la
> planilla. Si corregís un precio en la planilla, el cliente ve el precio corregido.

> No ordenes la pestaña **Pedidos** mientras un cliente está completando el formulario (el sitio
> escribe en la fila donde encontró el pedido). Para mirar, usá **filtros**, que no mueven filas.

## 1. Planilla y script

1. Creá una planilla nueva en Google Sheets (por ejemplo "Innova — Pedidos").
2. **Extensiones → Apps Script.** Borrá el contenido de `Código.gs` y pegá
   [`apps-script/Pedidos.gs`](../apps-script/Pedidos.gs). Tiene que empezar con `/**`.
3. En el editor: **+ → HTML**, llamalo `PanelPedido` (sin `.html`) y pegá
   [`apps-script/PanelPedido.html`](../apps-script/PanelPedido.html). Tiene que empezar con
   `<!DOCTYPE html>`.
4. Guardá, elegí la función `configurarPlanilla` y tocá **Ejecutar**. Google va a pedir permisos (es
   tu propio script): aceptalos.
5. Volvé a la planilla y recargala: aparece el menú **Innova** y las pestañas *Pedidos*, *Items*,
   *Clientes*, *Envíos* y *Precios*.

## 1b. App web (para cargar pedidos desde el celular)

El menú de la planilla no existe en la app de Sheets del celular, así que la misma pantalla se
publica como página web privada de Google.

1. En el editor de Apps Script: **Implementar → Nueva implementación**.
2. Tipo (engranaje): **App web**. Ejecutar como: **Yo**. Quién tiene acceso: **Solo usuarios de
   innova54.com** → **Implementar** (pide permisos la primera vez).
3. Copiá la URL que termina en `/exec` (también la muestra **Innova → Abrir en el celular**).
4. En el celular, abrila con la cuenta de Innova y usá **Agregar a pantalla de inicio**: queda como
   una app.

Cada vez que pegues una versión nueva del script: **Implementar → Administrar implementaciones →
editar (lápiz) → Versión: Nueva versión → Implementar**. Así la URL no cambia.

## 2. Cuenta de servicio (para que el sitio lea y escriba)

Es gratis y no requiere tarjeta.

1. Entrá a <https://console.cloud.google.com/> y creá un proyecto (ej. `innova-pedidos`).
2. **APIs y servicios → Biblioteca →** buscá **Google Sheets API** → **Habilitar**.
3. **APIs y servicios → Credenciales → Crear credenciales → Cuenta de servicio.** Nombre
   `innova-web`, sin roles. Crear.
4. Abrí la cuenta creada → **Claves → Agregar clave → JSON.** Se descarga un archivo: guardalo en
   un lugar seguro y **no lo subas al repo ni lo mandes por chat**.
5. Copiá el mail de la cuenta (`innova-web@….iam.gserviceaccount.com`) y **compartí la planilla
   con ese mail como Editor** (botón *Compartir* de la planilla).

## 3. Variables en Vercel

Proyecto → **Settings → Environment Variables** (entorno *Production*):

| Variable | Valor |
| --- | --- |
| `GOOGLE_SA_EMAIL` | `client_email` del JSON |
| `GOOGLE_SA_PRIVATE_KEY` | `private_key` del JSON, entero, incluyendo `-----BEGIN PRIVATE KEY-----` |
| `GOOGLE_SHEET_ID` | el ID de la planilla: lo que está entre `/d/` y `/edit` en su URL |
| `TRANSFER_ALIAS` | alias para transferir |
| `TRANSFER_CBU` | CBU / CVU |
| `TRANSFER_TITULAR` | titular de la cuenta |
| `TRANSFER_BANCO` | banco o billetera (opcional) |

Redeployá para que tomen efecto.

## 4. Probar

1. **Innova → Nuevo pedido** (o la App web), cargá dos productos, uno con piso y precio de diseño,
   con tu teléfono, y guardá.
2. Abrí el link del mensaje y completá el formulario: la fila pasa a `Esperando pago` y aparecés en
   **Clientes** (y en **Envíos** si elegiste Correo Argentino o Viacargo).
3. Cargá otro pedido con el mismo teléfono: el panel avisa "Cliente: …" y el link llega precargado.
4. Borrá las filas de prueba.

## Para desarrollo

`ORDERS_MOCK=1 npm run dev` muestra pedidos de ejemplo sin credenciales de Google (nunca en
producción):

- `/pedido/00000000000000a1` — esperando datos, cliente nuevo (vendedora Daniela)
- `/pedido/00000000000000a2` — esperando datos, cliente que ya compró: datos precargados (Daimary)
- `/pedido/00000000000000a3` — pagado
- `/pedido/00000000000000a4` — cancelado
- `/pedido/00000000000000a5` — seña recibida (Cobrado cargado)

Los nombres de columnas que comparten el sitio y el script están en `app/lib/orderSchema.ts` y al
principio de `apps-script/Pedidos.gs`: si se renombra una, hay que cambiarla en los dos.
