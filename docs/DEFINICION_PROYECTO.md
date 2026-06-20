# PuntoVenta - Definicion inicial del sistema

## Vision

Construir un sistema web de punto de venta para negocios tipo cafeteria, despacho o comercio de mostrador, sin manejo de mesas estilo restaurante.

El sistema debe permitir vender rapido, controlar caja, manejar cuentas abiertas, registrar compras de materia prima, transformar insumos en articulos de venta, controlar inventario y generar reportes de ventas.

La primera version se enfoca en operacion diaria de caja y control basico del negocio. La impresion de ticket de caja se considera parte del alcance operativo. La facturacion electronica queda fuera del proyecto por ahora.

## Referencia de mercado: Alegra POS

Alegra POS se toma como referencia funcional, no como copia directa. Sus puntos relevantes para este proyecto son:

- POS web en la nube, usable desde tablet o computadora.
- Pantalla de venta rapida con productos seleccionables.
- Productos favoritos y categorias para ubicar articulos rapidamente.
- Tickets o comprobantes internos desde el punto de venta.
- Control de caja con apertura y cierre de turno.
- Gestion de efectivo: entradas, salidas, faltantes y sobrantes.
- Historial de ventas con opcion de ver, anular o reimprimir tickets.
- Inventario actualizado con cada venta.
- Terminales o puntos de venta asociados a bodegas/inventario.
- Reportes de venta en tiempo real y rendimiento por vendedor.
- Codigo de barras, impresora termica y cajon monedero como capacidades posibles.
- Modo offline como referencia deseable, no obligatorio para MVP.

## Tipo de negocio objetivo

Primera vertical: cafeteria / despacho.

Caracteristicas esperadas:

- Venta en mostrador.
- Flujo rapido: seleccionar articulos, cobrar e imprimir ticket de caja.
- Puede haber cuentas abiertas, pero no mesas.
- Puede haber varias cuentas abiertas visibles al mismo tiempo, en pestanas.
- Algunos articulos se compran y venden tal cual.
- Algunos articulos se producen o transforman desde materia prima.
- Algunos articulos pueden tener deposito/envase retornable.
- Se necesita control de inventario por articulo e insumo.
- Se necesitan reportes simples para saber que se vendio, cuanto ingreso y que queda en stock.

## Objetivos del MVP

1. Vender rapido desde una pantalla de caja.
2. Mantener varias cuentas abiertas en paralelo.
3. Controlar productos, categorias, precios e impuestos.
4. Registrar pagos y generar ticket de caja.
5. Controlar apertura, movimientos y cierre de caja.
6. Descontar inventario por venta.
7. Registrar compras de materia prima o productos terminados.
8. Soportar recetas o transformaciones basicas para productos fabricados.
9. Consultar reportes basicos de ventas, caja e inventario.

## Modulos funcionales

### 1. Pantalla de venta

La pantalla principal del sistema debe estar optimizada para caja.

Funciones:

- Busqueda de articulos por nombre, codigo o codigo de barras.
- Seleccion visual por categorias.
- Articulos favoritos o frecuentes.
- Carrito de venta.
- Ajuste de cantidad.
- Cambio de precio autorizado.
- Descuento autorizado.
- Eliminacion de lineas.
- Seleccion de cliente opcional.
- Venta rapida a consumidor final.
- Pago por efectivo, tarjeta, transferencia u otro metodo.
- Pago mixto en una misma venta.
- Generacion de ticket de caja.

### 2. Cuentas abiertas

Las cuentas abiertas permiten dejar ventas en proceso sin cerrarlas.

Funciones:

- Crear cuenta abierta.
- Nombrar cuenta: cliente, referencia o consecutivo.
- Ver varias cuentas abiertas en pestanas.
- Agregar, modificar o quitar articulos en una cuenta.
- Cambiar entre cuentas sin perder el carrito.
- Cerrar cuenta y cobrar.
- Cancelar cuenta con motivo.
- Registrar responsable/cajero.

Regla inicial:

- Una cuenta abierta no descuenta inventario definitivamente hasta ser cobrada, salvo que el PO decida reservar inventario desde el momento de agregar articulos.

### 3. Catalogo de articulos

Tipos de articulo:

- Producto terminado comprado: se compra y vende tal cual.
- Producto preparado: se vende como articulo, pero consume materia prima segun receta.
- Materia prima: se compra y se consume en recetas, normalmente no se vende directamente.
- Insumo operativo: se compra y controla, pero no siempre se vende.
- Deposito/envase: monto adicional asociado a un articulo, retornable o no retornable segun configuracion.

Datos base:

- Nombre.
- Categoria.
- Codigo interno.
- Codigo de barras opcional.
- Precio de venta.
- Costo.
- Impuesto.
- Unidad de medida.
- Controla inventario: si/no.
- Stock minimo.
- Activo/inactivo.

### 4. Inventario

El inventario debe permitir control por articulo y por insumo.

Movimientos:

- Compra.
- Venta.
- Consumo por receta.
- Ajuste manual.
- Merma.
- Devolucion.
- Transferencia futura entre bodegas/sucursales.

Reglas iniciales:

- Una venta de producto comprado descuenta unidades del producto.
- Una venta de producto preparado descuenta los insumos definidos en su receta.
- Una compra aumenta stock de materia prima o producto terminado.
- Todo ajuste manual debe tener motivo y usuario.

### 5. Compras y materia prima

Funciones:

- Registrar proveedor.
- Registrar factura de compra o compra simple.
- Agregar articulos/insumos comprados.
- Registrar costo unitario.
- Actualizar inventario.
- Guardar referencia de factura del proveedor.
- Consultar historial de compras.

### 6. Recetas / transformaciones

Para cafeterias, este modulo permite convertir insumos en productos vendibles.

Ejemplos:

- Cafe latte consume cafe, leche, vaso y tapa.
- Reposteria puede consumir harina, azucar, huevo, empaque.
- Producto empacado puede consumir materia prima y producir unidades terminadas.

### 6.1 Rendimiento variable de materia prima

El inventario no debe asumir que una compra de materia prima se transforma en una cantidad fija de articulos finales de un solo tipo.

Ejemplo del PO:

- Se compra 1 kilo de cafe.
- Ese kilo puede rendir aproximadamente 100 tazas.
- Pero esas 100 tazas pueden ser combinaciones distintas:
  - 20 americanos y 80 express.
  - 10 americanos, 10 capuchinos y 80 express.
  - Cualquier otra mezcla segun lo vendido.

Regla de diseno:

- El kilo de cafe se registra como materia prima en gramos: 1,000 g de cafe.
- Cada producto vendido tiene una receta que consume una cantidad especifica de cafe.
- El inventario se descuenta al vender segun la receta del producto vendido.
- El sistema no convierte anticipadamente el kilo en 100 productos finales.
- El rendimiento teorico sirve para estimar capacidad, costos y alertas, pero el consumo real depende del mix de ventas.

Ejemplo de recetas:

- Express: consume 10 g de cafe.
- Americano: consume 10 g de cafe y agua.
- Capuchino: consume 10 g de cafe, leche y vaso/tapa si aplica.

Con esta regla, el sistema puede responder:

- Cuanto cafe queda en gramos.
- Cuantos express podria vender si todo el cafe restante se usara en express.
- Cuantos capuchinos podria vender considerando tambien leche y otros insumos.
- Cual fue el consumo teorico de cafe segun ventas.
- Si hay diferencia entre consumo teorico y consumo real, registrarla como merma o ajuste.

Funciones MVP:

- Crear receta para producto preparado.
- Definir insumos y cantidades.
- Calcular costo estimado.
- Descontar insumos al vender.

Funciones posteriores:

- Ordenes de produccion.
- Produccion por lote.
- Rendimiento real vs teorico.
- Merma automatica.

### 7. Depositos / envases

Algunos productos pueden incluir deposito.

Casos:

- Envase retornable.
- Botella.
- Caja.
- Otro deposito asociado a producto.

Funciones:

- Configurar articulo con deposito.
- Agregar deposito automaticamente al vender el articulo.
- Registrar devolucion de deposito.
- Reportar saldo de depositos pendientes.

### 8. Caja y turnos

Funciones:

- Abrir caja con monto inicial.
- Registrar ventas del turno.
- Registrar entradas de efectivo.
- Registrar salidas de efectivo.
- Cerrar caja con conteo real.
- Calcular diferencia: esperado vs contado.
- Historial de cierres.
- Reporte por cajero/turno.

### 9. Reportes

Reportes MVP:

- Ventas por dia.
- Ventas por rango de fechas.
- Ventas por producto.
- Ventas por categoria.
- Ventas por metodo de pago.
- Cierre de caja.
- Productos mas vendidos.
- Stock actual.
- Productos bajo minimo.
- Margen estimado por producto.

Reportes posteriores:

- Utilidad por receta.
- Merma.
- Compras por proveedor.
- Depositos pendientes.
- Rendimiento por cajero.
- Comparativo por dia/hora.

## Tickets de caja

MVP:

- Generar ticket de caja.
- Numeracion interna.
- Reimpresion de ticket.
- Anulacion con motivo.
- Formato imprimible para impresora termica.

Fuera del alcance actual:

- Facturacion electronica.
- Integracion con Hacienda / proveedor autorizado.
- Comprobantes electronicos fiscales.

## Impresion

MVP tecnico diferido:

- Preparar formato de ticket.
- Definir plantilla de impresion.
- Imprimir ticket de caja.

Fase posterior:

- Conexion con impresora termica.
- Impresion desde navegador o agente local.
- Configuracion por terminal/caja.
- Apertura de cajon monedero si aplica.

## Roles iniciales

- Administrador: configuracion total.
- Cajero: ventas, cuentas abiertas, cobros, apertura/cierre de caja.
- Encargado: inventario, compras, ajustes, reportes operativos.
- Auditor/PO: consulta de reportes y trazabilidad.

## Entidades principales

- Empresa.
- Usuario.
- Rol.
- Caja/terminal.
- Turno de caja.
- Cliente.
- Proveedor.
- Categoria.
- Articulo.
- Receta.
- Ingrediente de receta.
- Compra.
- Detalle de compra.
- Venta.
- Detalle de venta.
- Pago.
- Cuenta abierta.
- Movimiento de inventario.
- Movimiento de caja.
- Deposito/envase.

## Fuera del MVP

- Manejo de mesas.
- Comandas de cocina.
- Reservas.
- Delivery avanzado.
- Programa de lealtad.
- Multi-sucursal completo.
- Contabilidad completa.
- Nomina.
- Modo offline.
- Facturacion electronica.
- Integracion inmediata con impresora termica.

## Decisiones pendientes con el PO

1. Si las cuentas abiertas reservan inventario o descuentan solo al cobrar.
2. Si el negocio requiere consumidor final por defecto o clientes obligatorios.
3. Si habra impuestos desde MVP o se manejan como campo configurable para futuro.
4. Si los depositos/envases son retornables con saldo pendiente por cliente.
5. Si se necesita codigo de barras desde la primera version.
6. Si las recetas descuentan insumos al vender o se produciran lotes antes de vender.
7. Si la caja sera una sola o varias terminales desde MVP.
8. Que reportes son indispensables para el primer piloto.

## Propuesta de fases

### Fase 1 - Definicion y prototipo

- Documento funcional.
- Wireframe de pantalla de venta.
- Modelo conceptual de datos.
- Flujos principales validados con PO.

### Fase 2 - MVP operativo

- Catalogo de articulos.
- Pantalla de venta.
- Cuentas abiertas.
- Caja y turnos.
- Inventario basico.
- Compras simples.
- Reportes basicos.
- Ticket interno.

### Fase 3 - Control avanzado

- Recetas completas.
- Depositos/envases.
- Mermas.
- Kardex.
- Margenes.
- Permisos finos.

### Fase 4 - Integraciones

- Impresora termica.
- Cajon monedero.
- Codigo de barras.
- Azure SQL y despliegue productivo.

## Principio de producto

El sistema debe sentirse como una caja rapida, no como un ERP pesado. La operacion diaria debe resolverse desde una pantalla principal clara, con los modulos administrativos disponibles sin estorbar al cajero.

