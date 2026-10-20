# Apps Script de pedidos

Código del panel de pedidos de la planilla. No corre en el sitio: se pega en
*Extensiones → Apps Script* de la planilla.

- `Pedidos.gs` — menú "Innova", App web para el celular (`doGet`), alta de pedidos, pendientes,
  recontacto y configuración de las pestañas.
- `PanelPedido.html` — la pantalla "Nuevo pedido / Pendientes". Se usa como ventana desde la
  planilla y como App web desde el celular (en el editor se crea como archivo HTML llamado
  `PanelPedido`).

Instalación y circuito completo: [`docs/pedidos-google-sheets.md`](../docs/pedidos-google-sheets.md).

Si cambiás algo acá, volvé a pegarlo en el editor de Apps Script (no se sincroniza solo), ejecutá
`configurarPlanilla` y publicá una nueva versión de la App web.
