/**
 * Innova — Pedidos
 *
 * Panel de carga de pedidos dentro de la planilla. Agrega el menú "Innova" con:
 *   - Nuevo pedido: carga los productos, guarda el pedido y arma el mensaje de WhatsApp con el link
 *     que el cliente usa para completar sus datos en innova54.com/pedido/<clave>.
 *   - Recontactar pedido seleccionado: arma un recordatorio según el estado del pedido.
 *   - Configurar planilla: crea las pestañas, encabezados, desplegables y la lista de precios.
 *
 * El sitio lee y completa estas mismas columnas (app/lib/orderSchema.ts). Si se cambia el orden de
 * COLUMNAS_PEDIDOS o COLUMNAS_ITEMS hay que cambiarlo también allá.
 *
 * Instalación: ver apps-script/README.md.
 */

const SITE_URL = 'https://innova54.com';
const HOJA_PEDIDOS = 'Pedidos';
const HOJA_ITEMS = 'Items';
const HOJA_PRECIOS = 'Precios';

const COLUMNAS_PEDIDOS = [
  'ID', 'Clave', 'Estado', 'Fecha', 'Semana de entrega', 'Cant. productos', 'Total',
  'Monto a transferir', 'Requiere envío', 'Tel. WhatsApp', 'Nombre', 'DNI', 'Mail', 'Teléfono',
  'Empresa de envío', 'Calle y número', 'Dpto', 'Ciudad', 'Provincia', 'Código postal',
  'Sucursal/Domicilio', 'Link generado', 'Datos completados', 'Link',
];

const COLUMNAS_ITEMS = [
  'ID pedido', 'Producto', 'Modelo', 'Medidas', 'Precio unitario', 'Cantidad', 'Subtotal',
  'Diseño de piso',
];

const ESTADOS = ['Esperando datos', 'Esperando pago', 'Pagado', 'En producción', 'Entregado', 'Cancelado'];

const COLORES_ESTADO = {
  'Esperando datos': '#fde68a',
  'Esperando pago': '#fed7aa',
  'Pagado': '#bbf7d0',
  'En producción': '#bfdbfe',
  'Entregado': '#e5e7eb',
  'Cancelado': '#fecaca',
};

/** Lista de precios inicial (copiada de app/data/pricesData.ts). Después se edita en la pestaña Precios. */
const PRECIOS_INICIALES = [
  ['Fondo 1.50m Color Vivo HD', '1,5 x 2 m', 39000],
  ['Fondo 1.50m Neón (Fluo)', '1,5 x 2 m', 46000],
  ['Fondo 1.50m Color Vivo HD', '1,5 x 2,5 m', 44000],
  ['Fondo 1.50m Neón (Fluo)', '1,5 x 2,5 m', 52000],
  ['Fondo 1.50m Color Vivo HD', '1,5 x 3 m', 54000],
  ['Fondo 1.50m Neón (Fluo)', '1,5 x 3 m', 64000],
  ['Fondo 1.50m Color Vivo HD', '1,5 x 3,5 m', 60000],
  ['Fondo 1.50m Neón (Fluo)', '1,5 x 3,5 m', 69000],
  ['Fondo 1.50m Color Vivo HD', '1,5 x 4 m', 65000],
  ['Fondo 1.50m Neón (Fluo)', '1,5 x 4 m', 76000],
  ['Fondo 1.50m Color Vivo HD', '1,5 x 4,5 m', 70000],
  ['Fondo 1.50m Neón (Fluo)', '1,5 x 4,5 m', 82000],
  ['Fondo 1.50m Color Vivo HD', '1,5 x 5 m', 75000],
  ['Fondo 1.50m Neón (Fluo)', '1,5 x 5 m', 88000],
  ['Fondo 2.90m Color Vivo HD', '2,9 x 2 m', 61000],
  ['Fondo 2.90m Neón (Fluo)', '2,9 x 2 m', 73000],
  ['Fondo 2.90m Color Vivo HD', '2,9 x 2,5 m', 72000],
  ['Fondo 2.90m Neón (Fluo)', '2,9 x 2,5 m', 85000],
  ['Fondo 2.90m Color Vivo HD', '2,9 x 3 m', 87000],
  ['Fondo 2.90m Neón (Fluo)', '2,9 x 3 m', 103000],
  ['Fondo 2.90m Color Vivo HD', '2,9 x 3,5 m', 97000],
  ['Fondo 2.90m Neón (Fluo)', '2,9 x 3,5 m', 115000],
  ['Fondo 2.90m Color Vivo HD', '2,9 x 4 m', 108000],
  ['Fondo 2.90m Neón (Fluo)', '2,9 x 4 m', 127000],
  ['Fondo 2.90m Color Vivo HD', '2,9 x 4,5 m', 118000],
  ['Fondo 2.90m Neón (Fluo)', '2,9 x 4,5 m', 139000],
  ['Fondo 2.90m Color Vivo HD', '2,9 x 5 m', 128000],
  ['Fondo 2.90m Neón (Fluo)', '2,9 x 5 m', 151000],
  ['Fondo 2.90m Color Vivo HD', '2,9 x 6 m', 152000],
  ['Fondo 2.90m Neón (Fluo)', '2,9 x 6 m', 180000],
  ['Fondo 2.90m Color Vivo HD', '2,9 x 7 m', 173000],
  ['Fondo 2.90m Neón (Fluo)', '2,9 x 7 m', 205000],
  ['Fondo 2.90m Color Vivo HD', '2,9 x 8 m', 194000],
  ['Fondo 2.90m Neón (Fluo)', '2,9 x 8 m', 230000],
  ['Híbrido', '1,5 x 3 m', 85000],
  ['Híbrido', '2 x 3 m', 100000],
  ['Híbrido', '2,9 x 3,5 m', 146000],
  ['Híbrido', '2,9 x 4 m', 157000],
  ['Piso Neoprene', '1,5 x 1,5 m', 51000],
  ['Piso Neoprene', '2 x 1,5 m', 68000],
  ['Piso Neoprene', '3 x 1,5 m', 85000],
  ['Piso Neoprene', '3,5 x 1,5 m', 95000],
  ['Piso Neoprene', '4 x 1,5 m', 105000],
  ['Piso Neoprene', '5 x 1,5 m', 125000],
  ['Fundas para Paneles', '0,7 x 2 m', 39000],
  ['Fundas para Paneles', '1 x 2 m', 65000],
  ['Fundas para Paneles', '1,5 x 2 m', 69000],
];

// ─── Menú ────────────────────────────────────────────────────────────────────

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Innova')
    .addItem('Nuevo pedido', 'nuevoPedido')
    .addItem('Recontactar pedido seleccionado', 'recontactar')
    .addSeparator()
    .addItem('Configurar planilla (una sola vez)', 'configurarPlanilla')
    .addToUi();
}

function nuevoPedido() {
  const html = HtmlService.createHtmlOutputFromFile('PanelPedido').setTitle('Nuevo pedido');
  SpreadsheetApp.getUi().showSidebar(html);
}

// ─── Llamadas desde el panel ─────────────────────────────────────────────────

/** Lista de precios para el selector del panel: [{ producto, medidas, precio }]. */
function obtenerPrecios() {
  const hoja = SpreadsheetApp.getActive().getSheetByName(HOJA_PRECIOS);
  if (!hoja || hoja.getLastRow() < 2) return [];
  return hoja
    .getRange(2, 1, hoja.getLastRow() - 1, 3)
    .getValues()
    .filter(function (r) { return r[0] && r[1]; })
    .map(function (r) { return { producto: String(r[0]), medidas: String(r[1]), precio: Number(r[2]) || 0 }; });
}

/**
 * Guarda el pedido y devuelve el link y el mensaje para el cliente.
 * datos = { fecha: 'aaaa-mm-dd', semanaEntrega, requiereEnvio, telefono, montoTransferir,
 *           items: [{ producto, modelo, medidas, precio, cantidad, piso }] }
 */
function crearPedido(datos) {
  const items = (datos.items || [])
    .map(function (it) {
      const precio = Math.max(0, Math.round(Number(it.precio) || 0));
      const cantidad = Math.max(1, Math.round(Number(it.cantidad) || 1));
      return {
        producto: String(it.producto || '').trim(),
        modelo: String(it.modelo || '').trim(),
        medidas: String(it.medidas || '').trim(),
        precio: precio,
        cantidad: cantidad,
        subtotal: precio * cantidad,
        piso: String(it.piso || '').trim(),
      };
    })
    .filter(function (it) { return it.producto || it.modelo; });

  if (items.length === 0) throw new Error('Agregá al menos un producto.');

  const total = items.reduce(function (s, it) { return s + it.subtotal; }, 0);
  const montoIngresado = Math.round(Number(datos.montoTransferir) || 0);
  const montoTransferir = montoIngresado > 0 ? montoIngresado : total;
  const cantidadProductos = items.reduce(function (s, it) { return s + it.cantidad; }, 0);
  const telefono = normalizarTelefono(datos.telefono);
  const fecha = datos.fecha ? new Date(datos.fecha + 'T12:00:00') : new Date();

  const ss = SpreadsheetApp.getActive();
  const hojaPedidos = ss.getSheetByName(HOJA_PEDIDOS);
  const hojaItems = ss.getSheetByName(HOJA_ITEMS);
  if (!hojaPedidos || !hojaItems) throw new Error('Falta configurar la planilla: menú Innova → Configurar planilla.');

  // El lock evita que dos personas cargando a la vez obtengan el mismo número de pedido.
  const lock = LockService.getDocumentLock();
  lock.waitLock(20000);
  try {
    const id = siguienteId(hojaPedidos);
    const clave = Utilities.getUuid().replace(/-/g, '').slice(0, 16);
    const link = SITE_URL + '/pedido/' + clave;

    const fila = COLUMNAS_PEDIDOS.map(function () { return ''; });
    const poner = function (columna, valor) { fila[COLUMNAS_PEDIDOS.indexOf(columna)] = valor; };
    poner('ID', id);
    poner('Clave', clave);
    poner('Estado', 'Esperando datos');
    poner('Fecha', fecha);
    poner('Semana de entrega', String(datos.semanaEntrega || '').trim());
    poner('Cant. productos', cantidadProductos);
    poner('Total', total);
    poner('Monto a transferir', montoTransferir);
    poner('Requiere envío', datos.requiereEnvio ? 'Sí' : 'No');
    poner('Tel. WhatsApp', telefono);
    poner('Link generado', new Date());
    poner('Link', link);
    hojaPedidos.appendRow(fila);

    const filasItems = items.map(function (it) {
      return [id, it.producto, it.modelo, it.medidas, it.precio, it.cantidad, it.subtotal, it.piso];
    });
    hojaItems
      .getRange(hojaItems.getLastRow() + 1, 1, filasItems.length, COLUMNAS_ITEMS.length)
      .setValues(filasItems);

    SpreadsheetApp.flush();

    const mensaje = mensajePedido(id, items, total, montoTransferir, datos.semanaEntrega, link);
    return { id: id, link: link, mensaje: mensaje, whatsapp: linkWhatsApp(telefono, mensaje) };
  } finally {
    lock.releaseLock();
  }
}

// ─── Recontactar ─────────────────────────────────────────────────────────────

function recontactar() {
  const ui = SpreadsheetApp.getUi();
  const hoja = SpreadsheetApp.getActiveSheet();
  if (hoja.getName() !== HOJA_PEDIDOS) {
    ui.alert('Seleccioná una fila de la pestaña "' + HOJA_PEDIDOS + '".');
    return;
  }
  const filaActiva = hoja.getActiveRange().getRow();
  if (filaActiva < 2) {
    ui.alert('Seleccioná la fila de un pedido.');
    return;
  }

  const valores = hoja.getRange(filaActiva, 1, 1, COLUMNAS_PEDIDOS.length).getValues()[0];
  const v = function (columna) { return valores[COLUMNAS_PEDIDOS.indexOf(columna)]; };
  const id = v('ID');
  const estado = v('Estado');
  const nombre = String(v('Nombre') || '').split(' ')[0];
  const saludo = nombre ? '¡Hola ' + nombre + '!' : '¡Hola!';
  const telefono = normalizarTelefono(v('Tel. WhatsApp') || v('Teléfono'));

  let mensaje;
  if (estado === 'Esperando datos') {
    mensaje = saludo + ' Te escribimos de Innova por tu pedido ' + id + ' 😊\n\n' +
      'Te dejamos de nuevo el link para completar tus datos y avanzar con la producción:\n' + v('Link');
  } else if (estado === 'Esperando pago') {
    mensaje = saludo + ' Te escribimos de Innova por tu pedido ' + id + ' 😊\n\n' +
      'Para confirmarlo nos falta la transferencia de *' + pesos(v('Monto a transferir')) + '*. ' +
      'En este link tenés los datos para transferir:\n' + v('Link') + '\n\n' +
      'Cuando la hagas, envianos el comprobante por acá. ¡Gracias!';
  } else {
    ui.alert('El pedido ' + id + ' está "' + estado + '": no hace falta recontactar.');
    return;
  }

  mostrarLink('Recontactar ' + id, mensaje, linkWhatsApp(telefono, mensaje), Boolean(telefono));
}

// ─── Configuración inicial ───────────────────────────────────────────────────

function configurarPlanilla() {
  const ss = SpreadsheetApp.getActive();

  const pedidos = obtenerHoja(ss, HOJA_PEDIDOS, COLUMNAS_PEDIDOS);
  const items = obtenerHoja(ss, HOJA_ITEMS, COLUMNAS_ITEMS);
  const precios = obtenerHoja(ss, HOJA_PRECIOS, ['Producto', 'Medidas', 'Precio']);

  if (precios.getLastRow() < 2 && PRECIOS_INICIALES.length) {
    precios.getRange(2, 1, PRECIOS_INICIALES.length, 3).setValues(PRECIOS_INICIALES);
  }

  const col = function (columna) { return COLUMNAS_PEDIDOS.indexOf(columna) + 1; };
  const filas = pedidos.getMaxRows() - 1;

  // Desplegable de Estado + un color por estado.
  const rangoEstado = pedidos.getRange(2, col('Estado'), filas, 1);
  rangoEstado.setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).setAllowInvalid(false).build()
  );
  const reglas = ESTADOS.map(function (estado) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(estado)
      .setBackground(COLORES_ESTADO[estado])
      .setRanges([rangoEstado])
      .build();
  });
  pedidos.setConditionalFormatRules(reglas);

  // DNI, teléfonos y código postal como texto, para no perder ceros ni formatearlos como número.
  ['DNI', 'Teléfono', 'Tel. WhatsApp', 'Código postal', 'Clave'].forEach(function (c) {
    pedidos.getRange(2, col(c), filas, 1).setNumberFormat('@');
  });
  pedidos.getRange(2, col('Fecha'), filas, 1).setNumberFormat('dd/mm/yyyy');
  ['Link generado', 'Datos completados'].forEach(function (c) {
    pedidos.getRange(2, col(c), filas, 1).setNumberFormat('dd/mm/yyyy hh:mm');
  });
  ['Total', 'Monto a transferir'].forEach(function (c) {
    pedidos.getRange(2, col(c), filas, 1).setNumberFormat('$#,##0');
  });
  items.getRange(2, 5, items.getMaxRows() - 1, 1).setNumberFormat('$#,##0');
  items.getRange(2, 7, items.getMaxRows() - 1, 1).setNumberFormat('$#,##0');
  precios.getRange(2, 3, precios.getMaxRows() - 1, 1).setNumberFormat('$#,##0');

  // La clave es técnica: se oculta para que nadie la edite sin querer.
  pedidos.hideColumns(col('Clave'));

  SpreadsheetApp.getUi().alert(
    'Listo. Recordá compartir la planilla (como Editor) con el mail de la cuenta de servicio.'
  );
}

function obtenerHoja(ss, nombre, encabezados) {
  const hoja = ss.getSheetByName(nombre) || ss.insertSheet(nombre);
  hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]).setFontWeight('bold');
  hoja.setFrozenRows(1);
  return hoja;
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

function siguienteId(hoja) {
  let max = 0;
  if (hoja.getLastRow() >= 2) {
    hoja.getRange(2, 1, hoja.getLastRow() - 1, 1).getValues().forEach(function (r) {
      const n = parseInt(String(r[0]).replace(/\D/g, ''), 10);
      if (n > max) max = n;
    });
  }
  return 'INN-' + String(max + 1).padStart(4, '0');
}

/**
 * Deja el número en el formato que espera wa.me (549 + área + número). Acepta lo que se suele
 * copiar de WhatsApp: "+54 9 11 1234-5678", "011 15 1234 5678", "1112345678".
 */
function normalizarTelefono(valor) {
  let d = String(valor || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.indexOf('549') === 0) return d;
  if (d.indexOf('54') === 0) return '549' + d.slice(2);
  if (d.charAt(0) === '0') d = d.slice(1);
  // "11 15 1234 5678" → se quita el 15 que va después del código de área.
  const m = d.match(/^(\d{2,4})15(\d{6,8})$/);
  if (m && (m[1] + m[2]).length === 10) d = m[1] + m[2];
  return '549' + d;
}

function linkWhatsApp(telefono, mensaje) {
  return 'https://wa.me/' + (telefono || '') + '?text=' + encodeURIComponent(mensaje);
}

function pesos(n) {
  return '$' + Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function mensajePedido(id, items, total, montoTransferir, semanaEntrega, link) {
  const lineas = items.map(function (it) {
    const partes = [(it.cantidad > 1 ? it.cantidad + ' × ' : '') + (it.modelo || it.producto)];
    if (it.modelo && it.producto) partes.push(it.producto);
    if (it.medidas) partes.push(it.medidas);
    if (it.piso) partes.push('Piso: ' + it.piso);
    return '• ' + partes.join(' — ') + ' — ' + pesos(it.subtotal);
  });

  let texto = '¡Gracias por tu compra en Innova! ✨\n\n' +
    '*Pedido ' + id + '*\n' + lineas.join('\n') + '\n\n' +
    '*Total: ' + pesos(total) + '*';
  if (montoTransferir < total) texto += '\nSeña a transferir: ' + pesos(montoTransferir);
  if (semanaEntrega) texto += '\nEntrega estimada: ' + semanaEntrega;
  texto += '\n\nPara avanzar, completá tus datos acá 👇\n' + link +
    '\n\nAl terminar vas a ver los datos para hacer la transferencia.';
  return texto;
}

function mostrarLink(titulo, mensaje, url, conTelefono) {
  const html = HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;font-size:13px">' +
      '<textarea style="width:100%;height:170px;font-size:12px" readonly>' + escaparHtml(mensaje) + '</textarea>' +
      '<p><a href="' + escaparHtml(url) + '" target="_blank" ' +
      'style="display:inline-block;background:#25D366;color:#fff;padding:8px 14px;border-radius:8px;text-decoration:none;font-weight:bold">' +
      'Abrir WhatsApp</a></p>' +
      (conTelefono ? '' : '<p style="color:#b45309">Este pedido no tiene teléfono: WhatsApp te va a pedir elegir el contacto.</p>') +
    '</div>'
  ).setWidth(420).setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, titulo);
}

function escaparHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
