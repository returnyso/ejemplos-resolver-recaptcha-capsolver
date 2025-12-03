/**
 * Resolver de reCaptcha V2 Normal usando la API de CapSolver
 * Resuelve desafíos de reCaptcha V2 con parámetros de site key y page URL únicamente
 */

require('dotenv').config({ path: '../../.env.example' });
const axios = require('axios');

// Parámetros de reCaptcha V2
const SITE_KEY = '6LfW6wATAAAAAHLqO2pb8bDBahxlMxNdo9g947u9';
const PAGE_URL = 'https://recaptcha-demo.appspot.com/';
const CAPSOLVER_API_KEY = process.env.CAPSOLVER_API_KEY;

/**
 * Crear tarea en CapSolver
 */
async function crearTarea(siteKey, pageUrl) {
    console.log('[*] Iniciando resolución de reCaptcha V2...');
    console.log(`[*] Site Key: ${siteKey}`);
    console.log(`[*] URL de Página: ${pageUrl}`);

    const payload = {
        clientKey: CAPSOLVER_API_KEY,
        task: {
            type: 'ReCaptchaV2TaskProxyLess',
            websiteKey: siteKey,
            websiteURL: pageUrl
        }
    };

    try {
        console.log('[*] Enviando tarea a CapSolver...');
        const response = await axios.post('https://api.capsolver.com/createTask', payload);
        
        if (response.data.errorId === 0) {
            return response.data.taskId;
        } else {
            throw new Error(`Error al crear tarea: ${response.data.errorDescription}`);
        }
    } catch (error) {
        throw new Error(`Error en la petición: ${error.message}`);
    }
}

/**
 * Obtener resultado de la tarea
 */
async function obtenerResultado(taskId) {
    const payload = {
        clientKey: CAPSOLVER_API_KEY,
        taskId: taskId
    };

    let intentos = 0;
    const maxIntentos = 60; // 60 segundos máximo

    while (intentos < maxIntentos) {
        try {
            const response = await axios.post('https://api.capsolver.com/getTaskResult', payload);
            
            if (response.data.status === 'ready') {
                return response.data.solution.gRecaptchaResponse;
            } else if (response.data.status === 'failed') {
                throw new Error(`Tarea falló: ${response.data.errorDescription}`);
            }
            
            // Esperar 1 segundo antes de reintentar
            await new Promise(resolve => setTimeout(resolve, 1000));
            intentos++;
        } catch (error) {
            throw new Error(`Error obteniendo resultado: ${error.message}`);
        }
    }

    throw new Error('Tiempo de espera agotado');
}

/**
 * Resolver reCaptcha V2
 */
async function resolverRecaptchaV2(siteKey, pageUrl) {
    if (!CAPSOLVER_API_KEY) {
        throw new Error('La variable de entorno CAPSOLVER_API_KEY no está configurada');
    }

    try {
        const taskId = await crearTarea(siteKey, pageUrl);
        console.log(`[*] Task ID recibido: ${taskId}`);
        console.log('[*] Esperando resultado...');
        
        const token = await obtenerResultado(taskId);
        console.log('[+] ¡Captcha resuelto exitosamente!');
        console.log(`[+] Token recibido (longitud: ${token.length} caracteres)`);
        
        return token;
    } catch (error) {
        console.error(`[-] Error al resolver reCaptcha: ${error.message}`);
        throw error;
    }
}

/**
 * Función principal
 */
async function main() {
    console.log('='.repeat(70));
    console.log('Resolver de reCaptcha V2 - Integración con CapSolver');
    console.log('='.repeat(70));

    try {
        const token = await resolverRecaptchaV2(SITE_KEY, PAGE_URL);
        
        console.log('\n' + '='.repeat(70));
        console.log('RESULTADO DEL TOKEN');
        console.log('='.repeat(70));
        console.log(`\ng-recaptcha-response:\n${token}\n`);
        
        console.log('[+] ¡Proceso completado exitosamente!');
        process.exit(0);
    } catch (error) {
        console.error(`\n[-] El proceso falló: ${error.message}`);
        process.exit(1);
    }
}

// Ejecutar si es el módulo principal
if (require.main === module) {
    main();
}

module.exports = { resolverRecaptchaV2 };
