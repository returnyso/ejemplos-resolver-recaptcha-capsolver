/**
 * Resolver de reCaptcha V2 con pageAction usando la API de CapSolver
 */

require('dotenv').config({ path: '../../.env.example' });
const axios = require('axios');

// Parámetros de reCaptcha V2 con pageAction
const SITE_KEY = '6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-';
const PAGE_URL = 'https://www.google.com/recaptcha/api2/demo';
const PAGE_ACTION = 'action';
const CAPSOLVER_API_KEY = process.env.CAPSOLVER_API_KEY;

async function crearTarea(siteKey, pageUrl, pageAction) {
    console.log('[*] Iniciando resolución de reCaptcha V2 con pageAction...');
    console.log(`[*] Site Key: ${siteKey}`);
    console.log(`[*] URL de Página: ${pageUrl}`);
    console.log(`[*] Page Action: ${pageAction}`);

    const payload = {
        clientKey: CAPSOLVER_API_KEY,
        task: {
            type: 'ReCaptchaV2TaskProxyLess',
            websiteKey: siteKey,
            websiteURL: pageUrl,
            pageAction: pageAction
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

async function obtenerResultado(taskId) {
    const payload = {
        clientKey: CAPSOLVER_API_KEY,
        taskId: taskId
    };

    let intentos = 0;
    const maxIntentos = 60;

    while (intentos < maxIntentos) {
        try {
            const response = await axios.post('https://api.capsolver.com/getTaskResult', payload);
            
            if (response.data.status === 'ready') {
                return response.data.solution.gRecaptchaResponse;
            } else if (response.data.status === 'failed') {
                throw new Error(`Tarea falló: ${response.data.errorDescription}`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            intentos++;
        } catch (error) {
            throw new Error(`Error obteniendo resultado: ${error.message}`);
        }
    }

    throw new Error('Tiempo de espera agotado');
}

async function main() {
    console.log('='.repeat(70));
    console.log('Resolver de reCaptcha V2 con pageAction - Integración con CapSolver');
    console.log('='.repeat(70));

    if (!CAPSOLVER_API_KEY) {
        console.error('[-] La variable de entorno CAPSOLVER_API_KEY no está configurada');
        process.exit(1);
    }

    try {
        const taskId = await crearTarea(SITE_KEY, PAGE_URL, PAGE_ACTION);
        console.log(`[*] Task ID recibido: ${taskId}`);
        console.log('[*] Esperando resultado...');
        
        const token = await obtenerResultado(taskId);
        console.log('[+] ¡Captcha resuelto exitosamente!');
        console.log(`[+] Token recibido (longitud: ${token.length} caracteres)`);
        
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

if (require.main === module) {
    main();
}

module.exports = { crearTarea, obtenerResultado };
