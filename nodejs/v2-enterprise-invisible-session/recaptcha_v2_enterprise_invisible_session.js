/**
 * Resolver de reCaptcha V2 Enterprise Invisible con Session usando la API de CapSolver
 */

require('dotenv').config({ path: '../../.env.example' });
const axios = require('axios');

// Parámetros de reCaptcha V2 Enterprise - Invisible con Session
const SITE_KEY = '6LdYITIqAAAAAKdiVvAtqQKtaH1KtHsZZrFBeCyB';
const PAGE_URL = 'https://www.coats.com';
const CAPSOLVER_API_KEY = process.env.CAPSOLVER_API_KEY;

async function crearTarea(siteKey, pageUrl) {
    console.log('[*] Iniciando resolución de reCaptcha V2 Enterprise (Invisible con Session)...');
    console.log(`[*] Site Key: ${siteKey}`);
    console.log(`[*] URL de Página: ${pageUrl}`);
    console.log('[*] isInvisible: true');
    console.log('[*] isSession: true');

    const payload = {
        clientKey: CAPSOLVER_API_KEY,
        task: {
            type: 'ReCaptchaV2EnterpriseTaskProxyLess',
            websiteKey: siteKey,
            websiteURL: pageUrl,
            isInvisible: true,
            isSession: true
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
                const resultado = {
                    gRecaptchaResponse: response.data.solution.gRecaptchaResponse,
                    'recaptcha-ca-t': response.data.solution['recaptcha-ca-t'],
                    'recaptcha-ca-e': response.data.solution['recaptcha-ca-e']
                };
                return resultado;
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
    console.log('Resolver de reCaptcha V2 Enterprise - Integración con CapSolver');
    console.log('Modo: Invisible con Session (Cookies)');
    console.log('='.repeat(70));

    if (!CAPSOLVER_API_KEY) {
        console.error('[-] La variable de entorno CAPSOLVER_API_KEY no está configurada');
        process.exit(1);
    }

    try {
        const taskId = await crearTarea(SITE_KEY, PAGE_URL);
        console.log(`[*] Task ID recibido: ${taskId}`);
        console.log('[*] Esperando resultado...');
        
        const resultado = await obtenerResultado(taskId);
        console.log('[+] ¡Captcha resuelto exitosamente!');
        console.log(`[+] Token recibido (longitud: ${resultado.gRecaptchaResponse.length} caracteres)`);
        
        if (resultado['recaptcha-ca-t']) {
            console.log(`[+] Cookie recaptcha-ca-t recibida (longitud: ${resultado['recaptcha-ca-t'].length} caracteres)`);
        }
        
        if (resultado['recaptcha-ca-e']) {
            console.log(`[+] Cookie recaptcha-ca-e recibida (longitud: ${resultado['recaptcha-ca-e'].length} caracteres)`);
        }
        
        console.log('\n' + '='.repeat(70));
        console.log('RESULTADO');
        console.log('='.repeat(70));
        console.log(`\ng-recaptcha-response:\n${resultado.gRecaptchaResponse}\n`);
        
        if (resultado['recaptcha-ca-t']) {
            console.log(`recaptcha-ca-t (cookie):\n${resultado['recaptcha-ca-t']}\n`);
        }
        
        if (resultado['recaptcha-ca-e']) {
            console.log(`recaptcha-ca-e (cookie):\n${resultado['recaptcha-ca-e']}\n`);
        }
        
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
