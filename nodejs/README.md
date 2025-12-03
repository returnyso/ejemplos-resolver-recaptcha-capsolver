# Ejemplos de reCaptcha con Node.js - CapSolver

Esta carpeta contiene ejemplos de implementación en Node.js para resolver diferentes tipos de reCaptcha usando CapSolver.

## 📁 Estructura de Carpetas

```
nodejs/
├── v2-normal/                          # reCaptcha V2 básico
│   ├── package.json
│   └── recaptcha_v2_normal.js
├── v2-normal-pageaction/               # reCaptcha V2 con pageAction
│   ├── package.json
│   └── recaptcha_v2_pageaction.js
├── v2-enterprise-invisible-session/    # reCaptcha V2 Enterprise con Session
│   ├── package.json
│   └── recaptcha_v2_enterprise_invisible_session.js
├── v3-normal/                          # reCaptcha V3
│   ├── package.json
│   └── recaptcha_v3_normal.js
└── README.md
```

## 🚀 Instalación

Cada carpeta tiene su propio `package.json`. Para instalar las dependencias en cada ejemplo:

```bash
cd v2-normal
npm install
```

## 🔧 Configuración

Asegúrate de tener configurada tu API key de CapSolver en el archivo `.env.example` en la raíz del proyecto:

```
CAPSOLVER_API_KEY=tu_api_key_aqui
```

O configura la variable de entorno directamente:

```powershell
$env:CAPSOLVER_API_KEY="tu_api_key_aqui"
```

## 📖 Uso

Para ejecutar cualquier ejemplo:

```bash
cd [nombre-de-carpeta]
npm start
```

O directamente:

```bash
node recaptcha_v2_normal.js
```

## 📋 Ejemplos Disponibles

### 1. V2 Normal (`v2-normal/`)
**Archivo:** `recaptcha_v2_normal.js`
- **Site Key**: `6LfW6wATAAAAAHLqO2pb8bDBahxlMxNdo9g947u9`
- **URL**: `https://recaptcha-demo.appspot.com/`
- **Tipo**: ReCaptchaV2TaskProxyLess
- **Parámetros**: websiteKey, websiteURL

### 2. V2 con pageAction (`v2-normal-pageaction/`)
**Archivo:** `recaptcha_v2_pageaction.js`
- **Site Key**: `6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-`
- **URL**: `https://www.google.com/recaptcha/api2/demo`
- **pageAction**: `action`
- **Tipo**: ReCaptchaV2TaskProxyLess
- **Parámetros**: websiteKey, websiteURL, pageAction

### 3. V2 Enterprise Invisible con Session (`v2-enterprise-invisible-session/`)
**Archivo:** `recaptcha_v2_enterprise_invisible_session.js`
- **Site Key**: `6LdYITIqAAAAAKdiVvAtqQKtaH1KtHsZZrFBeCyB`
- **URL**: `https://www.coats.com`
- **isInvisible**: `true`
- **isSession**: `true`
- **Tipo**: ReCaptchaV2EnterpriseTaskProxyLess
- **Retorna**: Token + cookies de sesión (`recaptcha-ca-t`, `recaptcha-ca-e`)
- **Parámetros**: websiteKey, websiteURL, isInvisible, isSession

### 4. V3 Normal (`v3-normal/`)
**Archivo:** `recaptcha_v3_normal.js`
- **Site Key**: `6LdKlZEpAAAAAAOQjzC2v_d36tWxCl6dWsozdSy9`
- **URL**: `https://recaptcha-demo.appspot.com/recaptcha-v3-request-scores.php`
- **pageAction**: `examples/v3scores`
- **Tipo**: ReCaptchaV3TaskProxyLess
- **Parámetros**: websiteKey, websiteURL, pageAction

## 🔧 Tipos de tareas disponibles

| Tipo de Tarea | Descripción |
|---------------|-------------|
| `ReCaptchaV2TaskProxyLess` | reCaptcha V2 sin proxy (usa el de CapSolver) |
| `ReCaptchaV2EnterpriseTaskProxyLess` | reCaptcha V2 Enterprise sin proxy |
| `ReCaptchaV3TaskProxyLess` | reCaptcha V3 sin proxy |

## 📊 Parámetros comunes

### Para V2:
- `websiteKey` (requerido) - La clave del sitio
- `websiteURL` (requerido) - URL completa de la página
- `pageAction` (opcional) - Parámetro 'sa' del endpoint /anchor
- `isInvisible` (opcional) - Si es captcha invisible
- `isSession` (opcional) - Para obtener cookies de sesión

### Para V3:
- `websiteKey` (requerido) - La clave del sitio
- `websiteURL` (requerido) - URL completa de la página
- `pageAction` (requerido) - La acción de la página

## 📝 Notas

- Todos los scripts incluyen manejo de errores completo
- Los mensajes están en español
- Incluyen función opcional para enviar el token al sitio demo
- Usan polling automático hasta obtener resultado
