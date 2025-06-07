**USER**
Representa a una persona que puede acceder al sistema (dueño, vendedor, etc.).
| Campo                          | Descripción                               |
| ------------------------------ | ----------------------------------------- |
| `id`                           | ID único del usuario                      |
| `name`, `lastName`             | Nombre y apellido                         |
| `email`                        | Correo electrónico único                  |
| `phone`, `dni`, `cuil`, `cuit` | Datos personales                          |
| `role`                         | Rol del usuario (`ADMIN`, `SELLER`)       |
| `address`, `city`, `country`   | Domicilio                                 |
| `birthdate`                    | Fecha de nacimiento                       |
| `createdAt`                    | Cuándo fue creado                         |
| `deletedAt`                    | Eliminación lógica (no se borra de la DB) |
| `accounts`                     | Relaciones con `Account` para login       |
| `sales`, `cashRegisters`       | Ventas realizadas y cajas manejadas       |


**ACCOUNT**
Controla el acceso de los usuarios al sistema.
| Campo          | Descripción                                              |
| -------------- | -------------------------------------------------------- |
| `provider`     | Tipo de autenticación (`credentials`, `google`, etc.)    |
| `providerId`   | ID de usuario según proveedor (ej: email o ID de Google) |
| `passwordHash` | Hash de la contraseña (si `provider = credentials`)      |
| `userId`       | Relación al usuario dueño de la cuenta                   |

**CATEGORY**
Agrupa productos por tipo.
| Campo         | Descripción                      |
| ------------- | -------------------------------- |
| `name`        | Nombre único de la categoría     |
| `description` | Descripción opcional             |
| `deletedAt`   | Eliminación lógica               |
| `products`    | Relación con productos asociados |

**PRODUCT**
Producto disponible para vender.
| Campo                 | Descripción                       |
| --------------------- | --------------------------------- |
| `name`, `description` | Nombre y descripción del producto |
| `price`               | Precio unitario                   |
| `discount`            | Descuento opcional (%)            |
| `stock`               | Cantidad disponible               |
| `categoryId`          | Relación con su categoría         |
| `saleItems`           | Items de venta donde fue incluido |
| `deletedAt`           | Eliminación lógica                |

**SALE**
Representa una venta realizada por un usuario.
| Campo         | Descripción                          |
| ------------- | ------------------------------------ |
| `userId`      | Usuario que hizo la venta            |
| `totalAmount` | Monto total de la venta              |
| `createdAt`   | Fecha de la venta                    |
| `deletedAt`   | Eliminación lógica                   |
| `items`       | Detalles de productos vendidos       |
| `payments`    | Métodos de pago usados en esta venta |

**SALEITEM**
Detalle de un producto dentro de una venta.
| Campo       | Descripción                      |
| ----------- | -------------------------------- |
| `saleId`    | ID de la venta                   |
| `productId` | Producto vendido                 |
| `quantity`  | Cantidad vendida                 |
| `unitPrice` | Precio por unidad en ese momento |

**PAYMENTMETHOD**
Tipos de pago disponibles.
| Campo          | Descripción                   |
| -------------- | ----------------------------- |
| `name`         | Nombre (ej: CASH, CARD, QR)   |
| `description`  | Descripción opcional          |
| `deletedAt`    | Eliminación lógica            |
| `salePayments` | Relación con pagos efectuados |

**SALEPAYMENT**
Registra cuánto se pagó y con qué método.
| Campo             | Descripción                 |
| ----------------- | --------------------------- |
| `saleId`          | Venta asociada              |
| `paymentMethodId` | Método de pago usado        |
| `amount`          | Monto pagado con ese método |

**CASHREGISTER**
Controla la apertura y cierre de caja.
| Campo           | Descripción                      |
| --------------- | -------------------------------- |
| `userId`        | Usuario que abrió la caja        |
| `openTime`      | Hora de apertura                 |
| `closeTime`     | Hora de cierre (si cerrada)      |
| `openingAmount` | Dinero inicial                   |
| `closingAmount` | Dinero final declarado           |
| `totalSales`    | Total registrado automáticamente |
| `notes`         | Comentarios opcionales           |
| `deletedAt`     | Eliminación lógica               |
