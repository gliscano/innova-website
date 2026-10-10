# Pedidos con Google Sheets

Cómo funciona el circuito de venta y cómo dejarlo andando. Se configura **una sola vez**.

## Cómo funciona

1. **Innova carga el pedido en la planilla.** Menú **Innova → Nuevo pedido** abre un panel a la derecha:
   - fecha, semana de entrega y si va por encomienda;
   - uno o más productos (producto y medida de la lista de precios, modelo, cantidad, piso);
   - monto a transferir (vacío = el total; o la seña).

   Al guardar se crea una fila en **Pedidos** (estado `Esperando datos`) y una fila por producto en
   **Items**, y aparece el mensaje de WhatsApp listo para copiar con el link del cliente.
2. **El cliente abre el link** (`innova54.com/pedido/…`): ve su pedido, completa sus datos personales
   y, si corresponde, los de envío.
3. **Al confirmar**, la fila se completa sola, pasa a `Esperando pago` y el cliente ve los datos para
   transferir y un botón para mandar el comprobante por WhatsApp.
4. **Seguimiento:** filtrá la columna *Estado*. Para un cliente que no terminó, seleccioná su fila y
   usá **Innova → Recontactar pedido seleccionado**: arma el recordatorio que corresponde (completar
   datos o transferir).
5. Cuando llega el pago, cambiá el estado a mano: `Pagado` → `En producción` → `Entregado` (o
   `Cancelado`, que desactiva el link).

> El link no tiene datos adentro, sólo una clave aleatoria: el sitio siempre lee el pedido de la
> planilla. Si corregís un precio en la planilla, el cliente ve el precio corregido.

> No ordenes la pestaña **Pedidos** mientras un cliente está completando el formulario (el sitio
> escribe en la fila donde encontró el pedido). Para mirar, usá **filtros**, que no mueven filas.

## 1. Planilla y script

1. Creá una planilla nueva en Google Sheets (por ejemplo "Innova — Pedidos").
2. **Extensiones → Apps Script.** Borrá el contenido de `Código.gs` y pegá
   [`apps-script/Pedidos.gs`](../apps-script/Pedidos.gs).
3. En el editor: **+ → HTML**, llamalo `PanelPedido` (sin `.html`) y pegá
   [`apps-script/PanelPedido.html`](../apps-script/PanelPedido.html).
4. Guardá, elegí la función `configurarPlanilla` y tocá **Ejecutar**. Google va a pedir permisos (es
   tu propio script): aceptalos.
5. Volvé a la planilla y recargala: aparece el menú **Innova**. Se crearon las pestañas *Pedidos*,
   *Items* y *Precios* (con la lista de precios actual del sitio; editala ahí cuando cambien).

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

1. **Innova → Nuevo pedido**, cargá dos productos y guardá.
2. Abrí el link del mensaje, completá el formulario: la fila tiene que pasar a `Esperando pago` con
   tus datos.
3. Volvé a abrir el link: muestra los datos de transferencia. Borrá esa fila de prueba (y sus Items).

## Para desarrollo

`ORDERS_MOCK=1 npm run dev` muestra pedidos de ejemplo sin credenciales de Google (nunca en
producción):

- `/pedido/00000000000000a1` — esperando datos, con envío
- `/pedido/00000000000000a2` — esperando datos, sin envío
- `/pedido/00000000000000a3` — pagado
- `/pedido/00000000000000a4` — cancelado

Las columnas que comparten el sitio y el script están en `app/lib/orderSchema.ts` y al principio de
`apps-script/Pedidos.gs`: si se cambia una, hay que cambiar la otra.
