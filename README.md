# Resolvedor de reCaptcha - Integración con CapSolver

Ejemplos en Python y Node.js que demuestran cómo resolver desafíos de reCaptcha V2 y V3 usando la API de CapSolver.

## 📁 Estructura del Proyecto

```
reCaptchaV2/
├── python/                             # Ejemplos en Python
│   ├── v2-normal/
│   ├── v2-normal-pageaction/
│   ├── v2-enterprise-invisible-session/
│   ├── v3-normal/
│   └── README.md
├── nodejs/                             # Ejemplos en Node.js
│   ├── v2-normal/
│   ├── v2-normal-pageaction/
│   ├── v2-enterprise-invisible-session/
│   ├── v3-normal/
│   └── README.md
├── .env.example                        # Ejemplo de configuración
└── README.md
```

## 🚀 Requisitos Previos

1. **Clave API de CapSolver**: Regístrate en [CapSolver](https://www.capsolver.com/) para obtener tu clave API
2. **Python 3.7+** o **Node.js 14+** instalado en tu sistema

## 🔧 Configuración

Configura tu clave API de CapSolver como variable de entorno:

**Windows PowerShell:**
```powershell
$env:CAPSOLVER_API_KEY="TU_API_KEY_AQUI"
```

**Windows Command Prompt:**
```cmd
set CAPSOLVER_API_KEY=TU_API_KEY_AQUI
```

**Linux/Mac:**
```bash
export CAPSOLVER_API_KEY="TU_API_KEY_AQUI"
```

## 📋 Ejemplos Disponibles

### reCaptcha V2

| Ejemplo | Descripción | Parámetros |
|---------|-------------|------------|
| **v2-normal** | reCaptcha V2 básico | websiteKey, websiteURL |
| **v2-normal-pageaction** | reCaptcha V2 con pageAction | websiteKey, websiteURL, pageAction |
| **v2-enterprise-invisible-session** | reCaptcha V2 Enterprise Invisible con Session | websiteKey, websiteURL, isInvisible, isSession |

### reCaptcha V3

| Ejemplo | Descripción | Parámetros |
|---------|-------------|------------|
| **v3-normal** | reCaptcha V3 con pageAction | websiteKey, websiteURL, pageAction |

## 📖 Uso

### Python

```bash
cd python/v2-normal
pip install -r requirements.txt
python recaptcha_v2_normal.py
```

### Node.js

```bash
cd nodejs/v2-normal
npm install
npm start
```

## 🔧 Tipos de Tareas Disponibles

| Tipo de Tarea | Descripción |
|---------------|-------------|
| `ReCaptchaV2TaskProxyLess` | reCaptcha V2 sin proxy (usa el de CapSolver) |
| `ReCaptchaV2EnterpriseTaskProxyLess` | reCaptcha V2 Enterprise sin proxy |
| `ReCaptchaV3TaskProxyLess` | reCaptcha V3 sin proxy |

## 📊 Parámetros Comunes

### Para V2:
- `websiteKey` (requerido) - La clave del sitio de reCaptcha
- `websiteURL` (requerido) - URL completa de la página
- `pageAction` (opcional) - Parámetro 'sa' del endpoint /anchor
- `isInvisible` (opcional) - Si es captcha invisible
- `isSession` (opcional) - Para obtener cookies de sesión

### Para V3:
- `websiteKey` (requerido) - La clave del sitio de reCaptcha
- `websiteURL` (requerido) - URL completa de la página
- `pageAction` (requerido) - La acción de la página

## 📚 Información de la API

- **Documentación de CapSolver**: https://docs.capsolver.com/guide/captcha/ReCaptchaV2.html
- **Panel de Control**: https://dashboard.capsolver.com/

## 📝 Notas

- Todos los scripts incluyen manejo de errores completo
- Los mensajes están en español
- Incluyen función opcional para enviar el token al sitio demo
- Usan polling automático hasta obtener resultado
