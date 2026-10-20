/**
 * Innova — Pedidos
 *
 * Panel de carga de pedidos de la planilla. Se usa de dos formas:
 *   - En la computadora, desde el menú "Innova" de la planilla (ventana flotante).
 *   - En el celular, como App web (doGet): la misma pantalla en el navegador. Ver README.
 *
 * El menú agrega:
 *   - Nuevo pedido: carga los productos, guarda el pedido y arma el mensaje de WhatsApp con el link
 *     que el cliente usa para completar sus datos en innova54.com/pedido/<clave>.
 *   - Recontactar pedido seleccionado: arma un recordatorio según el estado del pedido.
 *   - Abrir en el celular: muestra la dirección de la App web.
 *   - Configurar planilla: crea las pestañas, encabezados, desplegables y la lista de precios.
 *
 * Las columnas se buscan por el nombre del encabezado (fila 1), no por su posición: se pueden
 * reordenar a mano. El sitio usa los mismos nombres (app/lib/orderSchema.ts): si se renombra una
 * columna, hay que cambiarla en los dos lados.
 *
 * Instalación: ver docs/pedidos-google-sheets.md.
 */

const SITE_URL = 'https://innova54.com';
const HOJA_PEDIDOS = 'Pedidos';
const HOJA_ITEMS = 'Items';
const HOJA_CLIENTES = 'Clientes';
const HOJA_ENVIOS = 'Envíos';
const HOJA_PRECIOS = 'Precios';

/** Días hábiles (lunes a viernes) que se suman a hoy para precargar la entrega. */
const DIAS_HABILES_ENTREGA = 12;

/** Vendedoras: el nombre tiene que coincidir con el del sitio (botón "Escribir a …"). */
const VENDEDORAS = [
  { nombre: 'Daniela', telefono: '5491171419752' },
  { nombre: 'Daimary', telefono: '5491171142152' },
];

const COLUMNAS_PEDIDOS = [
  'ID', 'Estado', 'Nombre', 'Teléfono', 'Total', 'Seña', 'Resta', 'Vendedora', 'Fecha',
  'Semana de entrega', 'Cant. productos', 'Requiere envío', 'Logística', 'DNI', 'Mail',
  'Calle y número', 'Dpto', 'Ciudad', 'Provincia', 'Código postal', 'Sucursal/Domicilio', 'Link',
  'Link generado', 'Datos completados', 'Clave',
];

const COLUMNAS_ITEMS = [
  'ID pedido', 'Producto', 'Modelo', 'Ancho', 'Alto', 'Incluye piso', 'Largo pared', 'Largo piso',
  'Diseño de piso', 'Precio unitario', 'Precio diseño', 'Cantidad', 'Subtotal',
];

const COLUMNAS_CLIENTES = [
  'Teléfono', 'Nombre', 'DNI', 'Mail', 'Primera compra', 'Última compra', 'Cant. pedidos',
];

const COLUMNAS_ENVIOS = [
  'Teléfono', 'Logística', 'Sucursal/Domicilio', 'Calle y número', 'Dpto', 'Ciudad', 'Provincia',
  'Código postal', 'Última vez usada',
];

const COLUMNAS_PRECIOS = ['Producto', 'Medidas', 'Precio'];

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

// ─── Menú y App web ──────────────────────────────────────────────────────────

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Innova')
    .addItem('Nuevo pedido', 'nuevoPedido')
    .addItem('Recontactar pedido seleccionado', 'recontactar')
    .addItem('Abrir en el celular', 'abrirEnCelular')
    .addSeparator()
    .addItem('Configurar planilla', 'configurarPlanilla')
    .addToUi();
}

function panel(modo) {
  const template = HtmlService.createTemplateFromFile('PanelPedido');
  template.modo = modo;
  return template.evaluate();
}

/**
 * Ventana flotante y no un panel lateral: el lateral de Sheets tiene un ancho fijo de 300 px y no
 * entraban los productos. Es "modeless", así que se puede seguir mirando la planilla detrás.
 */
function nuevoPedido() {
  guardarIdPlanilla();
  SpreadsheetApp.getUi().showModelessDialog(panel('ventana').setWidth(1100).setHeight(700), 'Innova · Pedidos');
}

/**
 * App web: la misma pantalla para usar desde el celular. Se implementa con "Ejecutar como: yo" y
 * acceso "Solo usuarios de innova54.com", así que sólo entra quien tenga cuenta de Innova.
 */
function doGet() {
  return panel('web')
    .setTitle('Innova · Pedidos')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1');
}

function abrirEnCelular() {
  const url = ScriptApp.getService().getUrl();
  const ui = SpreadsheetApp.getUi();
  if (!url) {
    ui.alert(
      'Todavía no está publicada la App web.\n\n' +
      'En el editor de Apps Script: Implementar → Nueva implementación → tipo "App web", ' +
      'Ejecutar como "Yo" y Quién tiene acceso "Solo usuarios de innova54.com". Ver docs/pedidos-google-sheets.md.'
    );
    return;
  }
  const html = HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;font-size:13px;line-height:1.5">' +
      '<p>Abrí esta dirección en el celular (con la cuenta de Innova) y agregala a la pantalla de inicio:</p>' +
      '<textarea style="width:100%;height:70px" readonly onclick="this.select()">' + escaparHtml(url) + '</textarea>' +
      '<p><a href="' + escaparHtml(url) + '" target="_blank">Abrir</a></p>' +
    '</div>'
  ).setWidth(460).setHeight(220);
  ui.showModalDialog(html, 'Innova en el celular');
}

/**
 * La App web no tiene "planilla activa": se abre por ID. El ID se guarda cada vez que se usa el
 * menú desde la planilla (y en configurarPlanilla).
 */
function libro() {
  const activa = SpreadsheetApp.getActive();
  if (activa) return activa;
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Abrí la planilla y ejecutá una vez "Innova → Configurar planilla".');
  return SpreadsheetApp.openById(id);
}

function guardarIdPlanilla() {
  const activa = SpreadsheetApp.getActive();
  if (activa) PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', activa.getId());
}

// ─── Columnas por nombre ─────────────────────────────────────────────────────

/** { 'nombre de columna en minúsculas': número de columna (base 1) } según la fila 1. */
function columnas(hoja, requeridas) {
  const ultima = Math.max(hoja.getLastColumn(), 1);
  const mapa = {};
  hoja.getRange(1, 1, 1, ultima).getValues()[0].forEach(function (nombre, i) {
    if (nombre !== '') mapa[String(nombre).trim().toLowerCase()] = i + 1;
  });
  const faltan = (requeridas || []).filter(function (c) { return !mapa[c.toLowerCase()]; });
  if (faltan.length) {
    throw new Error('Faltan columnas en "' + hoja.getName() + '": ' + faltan.join(', ') + '. Ejecutá Innova → Configurar planilla.');
  }
  return {
    col: function (nombre) { return mapa[nombre.toLowerCase()]; },
    ancho: ultima,
  };
}

function hojaObligatoria(ss, nombre, requeridas) {
  const hoja = ss.getSheetByName(nombre);
  if (!hoja) throw new Error('Falta la pestaña "' + nombre + '": ejecutá Innova → Configurar planilla.');
  return { hoja: hoja, c: columnas(hoja, requeridas) };
}

/** Lee las filas de datos como objetos { columna: valor }. */
function leerFilas(hoja, c) {
  if (hoja.getLastRow() < 2) return [];
  const encabezados = hoja.getRange(1, 1, 1, c.ancho).getValues()[0];
  return hoja.getRange(2, 1, hoja.getLastRow() - 1, c.ancho).getValues().map(function (valores, i) {
    const fila = { _fila: i + 2 };
    encabezados.forEach(function (nombre, j) { if (nombre !== '') fila[String(nombre).trim()] = valores[j]; });
    return fila;
  });
}

/**
 * Agrega una fila poniendo cada valor en su columna. Las columnas de `comoTexto` se formatean como
 * texto antes de escribir: si no, Sheets convierte teléfonos en números o una clave como "12e45…"
 * en notación científica.
 */
function agregarFila(hoja, c, valores, comoTexto) {
  const fila = [];
  for (let i = 0; i < c.ancho; i++) fila.push('');
  Object.keys(valores).forEach(function (nombre) {
    const col = c.col(nombre);
    if (col) fila[col - 1] = valores[nombre];
  });
  const numero = hoja.getLastRow() + 1;
  if (numero > hoja.getMaxRows()) hoja.insertRowsAfter(hoja.getMaxRows(), 50);
  (comoTexto || []).forEach(function (nombre) {
    const col = c.col(nombre);
    if (col) hoja.getRange(numero, col).setNumberFormat('@');
  });
  hoja.getRange(numero, 1, 1, c.ancho).setValues([fila]);
  return numero;
}

// ─── Llamadas desde el panel ─────────────────────────────────────────────────

/** Lo que el panel necesita al abrir. */
function datosIniciales() {
  return { precios: obtenerPrecios(), vendedoras: VENDEDORAS.map(function (v) { return v.nombre; }), diasHabiles: DIAS_HABILES_ENTREGA };
}

/** Lista de precios para el selector: [{ producto, medidas, precio }]. */
function obtenerPrecios() {
  const hoja = libro().getSheetByName(HOJA_PRECIOS);
  if (!hoja || hoja.getLastRow() < 2) return [];
  return hoja
    .getRange(2, 1, hoja.getLastRow() - 1, 3)
    .getValues()
    .filter(function (r) { return r[0] && r[1]; })
    .map(function (r) { return { producto: String(r[0]), medidas: String(r[1]), precio: Number(r[2]) || 0 }; });
}

/** Cliente que ya compró, por teléfono. null si no está en Clientes. */
function buscarCliente(telefono) {
  const clave = normalizarTelefono(telefono);
  if (!clave) return null;
  const hoja = libro().getSheetByName(HOJA_CLIENTES);
  if (!hoja) return null;
  const c = columnas(hoja, ['Teléfono', 'Nombre']);
  const cliente = leerFilas(hoja, c).filter(function (f) { return normalizarTelefono(f['Teléfono']) === clave; })[0];
  if (!cliente) return null;
  return {
    nombre: String(cliente['Nombre'] || ''),
    pedidos: Number(cliente['Cant. pedidos']) || 0,
    ultimaCompra: String(cliente['Última compra'] || ''),
  };
}

function numero(valor, minimo) {
  const n = Number(String(valor === undefined ? '' : valor).replace(',', '.'));
  return Number.isFinite(n) ? Math.max(minimo, n) : minimo;
}

/**
 * Guarda el pedido y devuelve el link y el mensaje para el cliente.
 * La forma de entrega (logística) no se carga acá: la elige el cliente en el formulario.
 * datos = { fecha: 'aaaa-mm-dd', semanaEntrega: 'aaaa-mm-dd', telefono, vendedora, sena,
 *           items: [{ producto, modelo, ancho, alto, precio, precioDiseno, cantidad,
 *                     incluyePiso, largoPared, largoPiso, piso }] }
 */
function crearPedido(datos) {
  const items = (datos.items || [])
    .map(function (it) {
      const precio = Math.round(numero(it.precio, 0));
      const precioDiseno = Math.round(numero(it.precioDiseno, 0));
      const cantidad = Math.max(1, Math.round(numero(it.cantidad, 1)));
      const incluyePiso = Boolean(it.incluyePiso);
      return {
        producto: String(it.producto || '').trim(),
        modelo: String(it.modelo || '').trim(),
        ancho: numero(it.ancho, 0),
        alto: numero(it.alto, 0),
        precio: precio,
        precioDiseno: precioDiseno,
        cantidad: cantidad,
        subtotal: (precio + precioDiseno) * cantidad,
        incluyePiso: incluyePiso,
        largoPared: incluyePiso ? numero(it.largoPared, 0) : '',
        largoPiso: incluyePiso ? numero(it.largoPiso, 0) : '',
        piso: incluyePiso ? String(it.piso || '').trim() : '',
      };
    })
    .filter(function (it) { return it.producto || it.modelo; });

  if (items.length === 0) throw new Error('Agregá al menos un producto.');
  const vendedora = VENDEDORAS.filter(function (v) { return v.nombre === datos.vendedora; })[0];
  if (!vendedora) throw new Error('Elegí la vendedora.');

  const total = items.reduce(function (s, it) { return s + it.subtotal; }, 0);
  const senaIngresada = Math.round(numero(datos.sena, 0));
  const sena = senaIngresada > 0 ? Math.min(senaIngresada, total) : total;
  const cantidadProductos = items.reduce(function (s, it) { return s + it.cantidad; }, 0);
  const telefono = normalizarTelefono(datos.telefono);
  const fecha = datos.fecha ? new Date(datos.fecha + 'T12:00:00') : new Date();
  const entrega = datos.semanaEntrega ? new Date(datos.semanaEntrega + 'T12:00:00') : '';
  const cliente = telefono ? buscarCliente(telefono) : null;

  const ss = libro();
  const pedidos = hojaObligatoria(ss, HOJA_PEDIDOS, COLUMNAS_PEDIDOS);
  const itemsHoja = hojaObligatoria(ss, HOJA_ITEMS, COLUMNAS_ITEMS);

  // El lock evita que dos personas cargando a la vez obtengan el mismo número de pedido.
  const lock = LockService.getDocumentLock() || LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const id = siguienteId(pedidos.hoja, pedidos.c);
    const clave = Utilities.getUuid().replace(/-/g, '').slice(0, 16);
    const link = SITE_URL + '/pedido/' + clave;

    agregarFila(pedidos.hoja, pedidos.c, {
      'ID': id,
      'Estado': 'Esperando datos',
      'Nombre': cliente ? cliente.nombre : '',
      'Teléfono': telefono,
      'Total': total,
      'Seña': sena,
      'Resta': total - sena,
      'Vendedora': vendedora.nombre,
      'Fecha': fecha,
      'Semana de entrega': entrega,
      'Cant. productos': cantidadProductos,
      'Link': link,
      'Link generado': new Date(),
      'Clave': clave,
    }, ['Teléfono', 'Clave']);

    items.forEach(function (it) {
      agregarFila(itemsHoja.hoja, itemsHoja.c, {
        'ID pedido': id,
        'Producto': it.producto,
        'Modelo': it.modelo,
        'Ancho': it.ancho || '',
        'Alto': it.alto || '',
        'Incluye piso': it.incluyePiso ? 'Sí' : 'No',
        'Largo pared': it.largoPared,
        'Largo piso': it.largoPiso,
        'Diseño de piso': it.piso,
        'Precio unitario': it.precio,
        'Precio diseño': it.precioDiseno,
        'Cantidad': it.cantidad,
        'Subtotal': it.subtotal,
      });
    });

    SpreadsheetApp.flush();

    const mensaje = mensajePedido(id, items, total, sena, entrega, link);
    return {
      id: id,
      link: link,
      mensaje: mensaje,
      whatsapp: telefono ? linkWhatsApp(telefono, mensaje) : '',
      cliente: cliente ? cliente.nombre : '',
    };
  } finally {
    lock.releaseLock();
  }
}

/** Pedidos que esperan algo del cliente, para la pestaña "Pendientes" del panel. */
function listarPendientes() {
  const pedidos = hojaObligatoria(libro(), HOJA_PEDIDOS, ['ID', 'Estado', 'Link']);
  const hoy = new Date();
  return leerFilas(pedidos.hoja, pedidos.c)
    .filter(function (f) { return f['Estado'] === 'Esperando datos' || f['Estado'] === 'Esperando pago'; })
    .map(function (f) {
      const generado = f['Link generado'] instanceof Date ? f['Link generado'] : null;
      const telefono = normalizarTelefono(f['Teléfono']);
      const mensaje = mensajeRecordatorio(f);
      return {
        id: String(f['ID']),
        estado: f['Estado'],
        nombre: String(f['Nombre'] || ''),
        vendedora: String(f['Vendedora'] || ''),
        total: Number(f['Total']) || 0,
        dias: generado ? Math.floor((hoy - generado) / 86400000) : null,
        link: String(f['Link'] || ''),
        mensaje: mensaje,
        whatsapp: telefono ? linkWhatsApp(telefono, mensaje) : '',
      };
    })
    .reverse();
}

// ─── Recontactar ─────────────────────────────────────────────────────────────

function mensajeRecordatorio(f) {
  const nombre = String(f['Nombre'] || '').split(' ')[0];
  const saludo = (nombre ? '¡Hola ' + nombre + '!' : '¡Hola!') + ' Te escribimos de Innova por tu pedido ' + f['ID'] + ' 😊\n\n';
  if (f['Estado'] === 'Esperando datos') {
    return saludo + 'Te dejamos de nuevo el link para completar tus datos y avanzar con la producción:\n' + f['Link'];
  }
  return saludo +
    'Para confirmarlo nos falta la transferencia de *' + pesos(f['Seña'] || f['Total']) + '*. ' +
    'En este link tenés los datos para transferir:\n' + f['Link'] + '\n\n' +
    'Cuando la hagas, envianos el comprobante por acá. ¡Gracias!';
}

function recontactar() {
  const ui = SpreadsheetApp.getUi();
  const hoja = SpreadsheetApp.getActiveSheet();
  if (hoja.getName() !== HOJA_PEDIDOS) {
    ui.alert('Seleccioná una fila de la pestaña "' + HOJA_PEDIDOS + '".');
    return;
  }
  const numeroFila = hoja.getActiveRange().getRow();
  if (numeroFila < 2) {
    ui.alert('Seleccioná la fila de un pedido.');
    return;
  }

  const c = columnas(hoja, ['ID', 'Estado', 'Link']);
  const f = leerFilas(hoja, c)[numeroFila - 2];
  if (f['Estado'] !== 'Esperando datos' && f['Estado'] !== 'Esperando pago') {
    ui.alert('El pedido ' + f['ID'] + ' está "' + f['Estado'] + '": no hace falta recontactar.');
    return;
  }
  const telefono = normalizarTelefono(f['Teléfono']);
  const mensaje = mensajeRecordatorio(f);
  mostrarLink('Recontactar ' + f['ID'], mensaje, telefono ? linkWhatsApp(telefono, mensaje) : '');
}

// ─── Configuración ───────────────────────────────────────────────────────────

/**
 * Crea o actualiza las pestañas. Se puede ejecutar las veces que haga falta:
 *   - Si una pestaña ya tiene todas las columnas, se deja como está (aunque estén en otro orden).
 *   - Si está vacía, se le ponen los encabezados.
 *   - Si tiene datos con otro formato (versión anterior), se renombra a "<nombre> (anterior)" y se
 *     crea una nueva vacía. Los datos viejos quedan ahí para consultarlos.
 */
function configurarPlanilla() {
  const ss = SpreadsheetApp.getActive();
  guardarIdPlanilla();
  const renombradas = [];

  const pedidos = prepararHoja(ss, HOJA_PEDIDOS, COLUMNAS_PEDIDOS, renombradas);
  const items = prepararHoja(ss, HOJA_ITEMS, COLUMNAS_ITEMS, renombradas);
  const clientes = prepararHoja(ss, HOJA_CLIENTES, COLUMNAS_CLIENTES, renombradas);
  const envios = prepararHoja(ss, HOJA_ENVIOS, COLUMNAS_ENVIOS, renombradas);
  const precios = prepararHoja(ss, HOJA_PRECIOS, COLUMNAS_PRECIOS, renombradas);

  if (precios.getLastRow() < 2 && PRECIOS_INICIALES.length) {
    precios.getRange(2, 1, PRECIOS_INICIALES.length, 3).setValues(PRECIOS_INICIALES);
  }

  const cp = columnas(pedidos, COLUMNAS_PEDIDOS);
  const filas = pedidos.getMaxRows() - 1;
  const rango = function (hoja, c, nombre) { return hoja.getRange(2, c.col(nombre), hoja.getMaxRows() - 1, 1); };

  // Desplegables de Estado y Vendedora + un color por estado.
  const rangoEstado = rango(pedidos, cp, 'Estado');
  rangoEstado.setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).setAllowInvalid(false).build()
  );
  rango(pedidos, cp, 'Vendedora').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(VENDEDORAS.map(function (v) { return v.nombre; }), true)
      .setAllowInvalid(true)
      .build()
  );
  pedidos.setConditionalFormatRules(ESTADOS.map(function (estado) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(estado)
      .setBackground(COLORES_ESTADO[estado])
      .setRanges([rangoEstado])
      .build();
  }));

  // Texto para no perder ceros ni convertir en número; fechas y montos con su formato.
  ['DNI', 'Teléfono', 'Código postal', 'Clave'].forEach(function (n) { rango(pedidos, cp, n).setNumberFormat('@'); });
  ['Fecha', 'Semana de entrega'].forEach(function (n) { rango(pedidos, cp, n).setNumberFormat('dd/mm/yyyy'); });
  rango(pedidos, cp, 'Link generado').setNumberFormat('dd/mm/yyyy hh:mm');
  ['Total', 'Seña', 'Resta'].forEach(function (n) { rango(pedidos, cp, n).setNumberFormat('$#,##0'); });

  const ci = columnas(items, COLUMNAS_ITEMS);
  ['Precio unitario', 'Precio diseño', 'Subtotal'].forEach(function (n) { rango(items, ci, n).setNumberFormat('$#,##0'); });

  const cc = columnas(clientes, COLUMNAS_CLIENTES);
  ['Teléfono', 'DNI'].forEach(function (n) { rango(clientes, cc, n).setNumberFormat('@'); });
  const ce = columnas(envios, COLUMNAS_ENVIOS);
  ['Teléfono', 'Código postal'].forEach(function (n) { rango(envios, ce, n).setNumberFormat('@'); });
  precios.getRange(2, 3, precios.getMaxRows() - 1, 1).setNumberFormat('$#,##0');

  // La clave es técnica: se oculta para que nadie la edite sin querer.
  pedidos.hideColumns(cp.col('Clave'));
  if (filas > 0) pedidos.setFrozenColumns(1);

  SpreadsheetApp.getUi().alert(
    'Listo.' +
    (renombradas.length ? '\n\nPestañas viejas guardadas como: ' + renombradas.join(', ') + '.' : '') +
    '\n\nRecordá compartir la planilla (como Editor) con el mail de la cuenta de servicio.'
  );
}

function prepararHoja(ss, nombre, encabezados, renombradas) {
  let hoja = ss.getSheetByName(nombre);
  if (hoja) {
    const actuales = hoja.getRange(1, 1, 1, Math.max(hoja.getLastColumn(), 1)).getValues()[0]
      .map(function (h) { return String(h).trim().toLowerCase(); });
    const completa = encabezados.every(function (h) { return actuales.indexOf(h.toLowerCase()) !== -1; });
    if (completa) return hoja;
    if (hoja.getLastRow() > 1) {
      let viejo = nombre + ' (anterior)';
      for (let n = 2; ss.getSheetByName(viejo); n++) viejo = nombre + ' (anterior ' + n + ')';
      hoja.setName(viejo);
      renombradas.push(viejo);
      hoja = null;
    }
  }
  if (!hoja) hoja = ss.insertSheet(nombre);
  hoja.clear();
  hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]).setFontWeight('bold');
  hoja.setFrozenRows(1);
  return hoja;
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

function siguienteId(hoja, c) {
  let max = 0;
  if (hoja.getLastRow() >= 2) {
    hoja.getRange(2, c.col('ID'), hoja.getLastRow() - 1, 1).getValues().forEach(function (r) {
      const n = parseInt(String(r[0]).replace(/\D/g, ''), 10);
      if (n > max) max = n;
    });
  }
  return 'INN-' + String(max + 1).padStart(4, '0');
}

/**
 * Deja el número en el formato que espera wa.me (549 + área + número). Acepta lo que se suele
 * copiar de WhatsApp: "+54 9 11 1234-5678", "011 15 1234 5678", "1112345678".
 * Tiene que dar lo mismo que normalizePhone() de app/lib/phone.ts (es la clave de Clientes).
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

function metros(n) {
  return String(Math.round(Number(n) * 100) / 100).replace('.', ',');
}

function fechaCorta(fecha) {
  return fecha instanceof Date ? Utilities.formatDate(fecha, Session.getScriptTimeZone(), 'dd/MM/yyyy') : '';
}

/** Mensaje para el cliente. Sin precios por producto: al cliente sólo le llega el total. */
function mensajePedido(id, items, total, sena, entrega, link) {
  const lineas = items.map(function (it) {
    const partes = [(it.cantidad > 1 ? it.cantidad + ' × ' : '') + (it.modelo || it.producto)];
    if (it.modelo && it.producto) partes.push(it.producto);
    if (it.ancho && it.alto) partes.push(metros(it.ancho) + ' x ' + metros(it.alto) + ' m');
    if (it.incluyePiso) {
      let piso = 'Con piso';
      if (it.largoPared && it.largoPiso) piso += ' (pared ' + metros(it.largoPared) + ' m + piso ' + metros(it.largoPiso) + ' m)';
      if (it.piso) piso += ': ' + it.piso;
      partes.push(piso);
    }
    return '• ' + partes.join(' — ');
  });

  let texto = '¡Gracias por tu compra en Innova! ✨\n\n' +
    '*Pedido ' + id + '*\n' + lineas.join('\n') + '\n\n' +
    '*Total: ' + pesos(total) + '*';
  if (sena < total) texto += '\nSeña a transferir: ' + pesos(sena) + '\nResta: ' + pesos(total - sena);
  if (entrega) texto += '\nEntrega estimada: ' + fechaCorta(entrega);
  texto += '\n\nPara avanzar, completá tus datos acá 👇\n' + link +
    '\n\nAl terminar vas a ver los datos para hacer la transferencia.';
  return texto;
}

function mostrarLink(titulo, mensaje, url) {
  const html = HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;font-size:13px">' +
      '<textarea style="width:100%;height:170px;font-size:12px" readonly>' + escaparHtml(mensaje) + '</textarea>' +
      (url
        ? '<p><a href="' + escaparHtml(url) + '" target="_blank" ' +
          'style="display:inline-block;background:#25D366;color:#fff;padding:8px 14px;border-radius:8px;text-decoration:none;font-weight:bold">' +
          'Abrir WhatsApp</a></p>'
        : '<p style="color:#b45309">Este pedido no tiene teléfono: copiá el mensaje y pegalo en el chat.</p>') +
    '</div>'
  ).setWidth(420).setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, titulo);
}

function escaparHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
