# Bank

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 18.2.0.

## Arquitectura del Proyecto

Este proyecto sigue un patrón de **Arquitectura Feature-First**, organizando el código por características de negocio en lugar de capas técnicas. Este enfoque mejora la mantenibilidad, escalabilidad y colaboración del equipo.

### Estructura de Carpetas

```
src/
├── app/
│   ├── core/                          # Servicios singleton, guards, interceptors
│   │   ├── interfaces/                # Interfaces y tipos compartidos
│   │   ├── services/                  # Servicios core singleton
│   │   ├── types/                     # Definiciones de tipos globales
│   │   └── utils/                     # Funciones utilitarias y validadores
│   │
│   ├── features/                      # Módulos de características 
│   │   └── products/                  # Módulo de productos 
│   │   │   ├── components/            # Componentes reutilizables del modulo de productos
│   │   │   ├── models/                # Modelos del modulo de productos
│   │   │   ├── pages/                 # Páginas del modulo de productos
│   │   │   │   ├── product-create/    # Modulo para crear un producto
│   │   │   │   ├── product-edit/      # Modulo para editar un producto
│   │   │   │   ├── product-list/      # Modulo para listar un producto
│   │   │   │   └── product-view/      # Modulo de vista de un producto
│   │   │   └── services/              # Servicios del modulo de productos
│   ├── layout/                        # Componentes de layout de interfaz
│   │   └── menu/                      # Menu principal de la aplicación
│   │                   
│   ├── shared/                        # Componentes y utilidades compartidas
│   │   ├── components/                # Componentes UI reutilizables
│   │   │   ├── loader/
│   │   │   ├── modal/
│   │   │   ├── notification/
│   │   │   └── tooltip/
│   │   └── services/                  # Servicios utilitarios compartidos
│   │
├── assets/                            # Recursos estáticos
│   └── styles/                        # Estilos globales
│       ├── components/
│       └── globals/
│
├── environments/                      # Configuraciones de entorno
```

## Guía de Estilos CSS - Metodología BEM

### Estructura de Estilos

El proyecto utiliza una arquitectura de estilos modular basada en **SCSS** con **variables CSS personalizadas** y sigue la metodología **BEM (Block, Element, Modifier)** para el naming de clases.

```
src/assets/styles/
├── _globals.scss                      # Importaciones principales
├── globals/                           # Estilos base y variables
│   ├── _variables.scss                # Variables CSS personalizadas
│   ├── _reset.scss                    # Reset de estilos CSS
│   ├── _base.scss                     # Estilos base
│   └── _spacing.scss                  # Clases utilitarias de espaciado
└── components/                        # Componentes siguiendo BEM
    ├── _alert.scss                    # Componente de alertas
    ├── _button.scss                   # Componente de botones
    ├── _container.scss                # Contenedores de layout
    ├── _float-button.scss             # Botón flotante con menú
    ├── _form.scss                     # Formularios
    ├── _input.scss                    # Controles de entrada
    ├── _loader.scss                   # Indicador de carga
    ├── _modal.scss                    # Ventanas modales
    ├── _table.scss                    # Tablas de datos
    └── _tooltip.scss                  # Tooltips informativos
```

### Metodología BEM

#### Convenciones de Naming

```scss
// Bloque (Block)
.block { }

// Elemento (Element)
.block__element { }

// Modificador (Modifier)
.block--modifier { }
.block__element--modifier { }
```

### Componentes BEM Implementados

#### 1. Botones (`.btn`)
```scss
// Bloque base
.btn { }

// Modificadores
.btn--primary { }            // Botón primario (amarillo)
.btn--secondary { }          // Botón secundario (azul claro)
```

**Uso:**
```html
<button class="btn btn--primary">Guardar</button>
<button class="btn btn--secondary">Cancelar</button>
```

#### 2. Formularios (`.form`)
```scss
// Bloque principal
.form { }

// Elementos
.form__content { }           // Contenedor del formulario
.form__title { }             // Título del formulario
.form__button { }            // Contenedor de botones
.form__button-container { }  // Agrupación de botones
```

**Uso:**
```html
<form class="form">
  <h2 class="form__title">Crear Producto</h2>
  <div class="form__content">
    <!-- Campos del formulario -->
  </div>
  <div class="form__button">
    <div class="form__button-container">
      <!-- Botones -->
    </div>
  </div>
</form>
```

#### 3. Controles de Entrada (`.control`)
```scss
// Bloque principal
.control { }

// Modificadores
.control--invalid { }        // Estado de error
```

**Uso:**
```html
<div class="control">
  <input type="text" placeholder="Nombre del producto">
  <span>Mensaje de ayuda</span>
</div>

<div class="control control--invalid">
  <input type="text" placeholder="Campo requerido">
  <span>Este campo es obligatorio</span>
</div>
```

#### 4. Modales (`.modal`)
```scss
// Bloque principal
.modal { }

// Elementos
.modal__content { }          // Contenedor del modal
.modal__close { }            // Botón de cierre
.modal__footer { }           // Pie del modal
.modal__body { }             // Cuerpo del modal
.modal__button-container { } // Contenedor de botones
```

#### 5. Tablas (`.table`)
```scss
// Bloque principal
.table { }

// Elementos
.table__cell { }             // Celda común
.table__header-cell { }      // Celda de encabezado
.table__header { }           // Encabezado de tabla
.table__content { }          // Contenido con scroll
```

#### 6. Alertas/Notificaciones (`.alert`)
```scss
// Bloque principal
.alert { }

// Elementos
.alert__container { }        // Contenedor de alertas
.alert__toast { }            // Notificación individual
.alert__text { }             // Texto de la alerta
```

#### 7. Loader (`.loader`)
```scss
// Bloque principal
.loader { }

// Elementos
.loader__container { }       // Contenedor overlay
.loader__spinner { }         // Spinner animado
```

#### 8. Botón Flotante (`.float-btn`)
```scss
// Bloque principal
.float-btn { }

// Elementos
.float-btn__container { }    // Contenedor principal
.float-btn__button { }       // Botón disparador
.float-btn__menu { }         // Menú desplegable
.float-btn__menu-item { }    // Elemento del menú

// Modificadores
.float-btn__menu--show { }   // Menú visible
```

#### 9. Tooltip (`.tooltip`)
```scss
// Bloque principal
.tooltip { }

// Elementos
.tooltip__icon { }           // Icono con tooltip
```

### Clases Utilitarias

#### Espaciado
```scss
// Márgenes
.ml-1, .ml-2, .ml-3, .ml-4  // Margin left
.mr-1, .mr-2, .mr-3, .mr-4  // Margin right
.mt-1, .mt-2, .mt-3, .mt-4  // Margin top
.mb-0                        // Margin bottom 0

// Padding
.p-1, .p-2, .p-3, .p-4      // Padding uniforme

// Ancho
.wf                          // Width 100%
```

#### Flexbox
```scss
.d-flex                      // Display flex
.d-flex-column              // Flex column
.d-flex-justify-center      // Justify center
.d-flex-align-center        // Align center
.d-flex-space-between       // Space between
```

### Breakpoints Responsivos

```scss
$breakpoint-mobile: 768px;
$breakpoint-tablet: 1024px;
$breakpoint-desktop: 1200px;
```

## Servidor de desarrollo

Ejecuta `ng serve` para un servidor de desarrollo. Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

## Scaffolding de código

Ejecuta `ng generate component component-name` para generar un nuevo componente. También puedes usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Ejecuta `ng build` para construir el proyecto. Los artefactos de construcción se almacenarán en el directorio `dist/`.

## Ejecución de pruebas unitarias

Ejecuta `ng test` para ejecutar las pruebas unitarias via [Karma](https://karma-runner.github.io).

## Ejecución de pruebas end-to-end

Ejecuta `ng e2e` para ejecutar las pruebas end-to-end via una plataforma de tu elección. Para usar este comando, necesitas primero agregar un paquete que implemente capacidades de pruebas end-to-end.

## Ayuda adicional

Para obtener más ayuda sobre Angular CLI usa `ng help` o visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
