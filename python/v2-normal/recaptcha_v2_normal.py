"""
Resolvedor de reCaptcha V2 usando la API de CapSolver
Resuelve desafíos de reCaptcha V2 con parámetros de site key y page URL únicamente
"""

import capsolver
import os
import time

# Parámetros de reCaptcha V2
SITE_KEY = "6LfW6wATAAAAAHLqO2pb8bDBahxlMxNdo9g947u9"
PAGE_URL = "https://recaptcha-demo.appspot.com/"


def resolver_recaptcha_v2(site_key, page_url):
    """
    Resolver reCaptcha V2 usando la API de CapSolver
    
    Args:
        site_key (str): La clave del sitio de reCaptcha
        page_url (str): La URL donde se encuentra el reCaptcha
    
    Returns:
        str: El token g-recaptcha-response
    """
    print(f"[*] Iniciando resolución de reCaptcha V2...")
    print(f"[*] Site Key: {site_key}")
    print(f"[*] URL de Página: {page_url}")
    
    try:
        # Configurar la clave API de CapSolver desde variable de entorno
        capsolver.api_key = os.getenv("CAPSOLVER_API_KEY")
        
        if not capsolver.api_key:
            raise ValueError("La variable de entorno CAPSOLVER_API_KEY no está configurada")
        
        print("[*] Enviando tarea a CapSolver...")
        
        # Resolver el reCaptcha
        solucion = capsolver.solve({
            "type": "ReCaptchaV2TaskProxyLess",
            "websiteKey": site_key,
            "websiteURL": page_url
        })
        
        print("[+] ¡Captcha resuelto exitosamente!")
        
        # Extraer el token g-recaptcha-response
        g_recaptcha_response = solucion.get("gRecaptchaResponse")
        
        if g_recaptcha_response:
            print(f"[+] Token recibido (longitud: {len(g_recaptcha_response)} caracteres)")
            return g_recaptcha_response
        else:
            raise Exception("No se encontró gRecaptchaResponse en la solución")
            
    except Exception as e:
        print(f"[-] Error al resolver reCaptcha: {e}")
        raise


def enviar_solucion(g_recaptcha_response):
    """
    Función de ejemplo que muestra cómo enviar el token al sitio objetivo
    
    Args:
        g_recaptcha_response (str): El token del captcha resuelto
    """
    import requests
    
    print("\n[*] Enviando solución al sitio de demostración...")
    
    try:
        # Enviar el token al sitio de demostración
        respuesta = requests.post(
            PAGE_URL,
            data={
                "g-recaptcha-response": g_recaptcha_response
            },
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        )
        
        if respuesta.status_code == 200:
            print("[+] ¡Solución enviada exitosamente!")
            print(f"[+] Estado de respuesta: {respuesta.status_code}")
            
            # Verificar si el envío fue exitoso
            if "Verification Success" in respuesta.text or "Success" in respuesta.text:
                print("[+] ✓ ¡Verificación de reCaptcha exitosa!")
            else:
                print("[*] Respuesta recibida, verifica manualmente")
                
            return True
        else:
            print(f"[-] El envío falló con estado: {respuesta.status_code}")
            return False
            
    except Exception as e:
        print(f"[-] Error al enviar la solución: {e}")
        return False


def main():
    """
    Función principal de ejecución
    """
    print("=" * 60)
    print("Resolvedor de reCaptcha V2 - Integración con CapSolver")
    print("=" * 60)
    
    try:
        # Paso 1: Resolver el reCaptcha
        token = resolver_recaptcha_v2(SITE_KEY, PAGE_URL)
        
        print("\n" + "=" * 60)
        print("RESULTADO DEL TOKEN")
        print("=" * 60)
        print(f"\ng-recaptcha-response:\n{token}\n")
        
        # Paso 2: Enviar la solución (demostración opcional)
        entrada_usuario = input("\n¿Deseas enviar este token al sitio de demostración? (s/n): ")
        if entrada_usuario.lower() == 's':
            enviar_solucion(token)
        else:
            print("[*] Token listo para usar. Omitiendo envío.")
        
        print("\n[+] ¡Proceso completado exitosamente!")
        
    except Exception as e:
        print(f"\n[-] El proceso falló: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
