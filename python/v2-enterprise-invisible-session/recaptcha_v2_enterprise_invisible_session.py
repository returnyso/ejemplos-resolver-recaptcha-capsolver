"""
Resolvedor de reCaptcha V2 Enterprise (Invisible con Session) usando la API de CapSolver
Resuelve desafíos de reCaptcha V2 Enterprise con modo de sesión activado
"""

import capsolver
import os
import time

# Parámetros de reCaptcha V2 Enterprise - Invisible con Session
SITE_KEY = "6LdYITIqAAAAAKdiVvAtqQKtaH1KtHsZZrFBeCyB"
PAGE_URL = "https://www.coats.com"


def resolver_recaptcha_v2_enterprise_invisible(site_key, page_url):
    """
    Resolver reCaptcha V2 Enterprise Invisible usando la API de CapSolver
    
    Args:
        site_key (str): La clave del sitio de reCaptcha
        page_url (str): La URL donde se encuentra el reCaptcha
    
    Returns:
        dict: Diccionario con el token y cookies de sesión
    """
    print(f"[*] Iniciando resolución de reCaptcha V2 Enterprise (Invisible con Session)...")
    print(f"[*] Site Key: {site_key}")
    print(f"[*] URL de Página: {page_url}")
    print(f"[*] isInvisible: True")
    print(f"[*] isSession: True")
    
    try:
        # Configurar la clave API de CapSolver desde variable de entorno
        capsolver.api_key = os.getenv("CAPSOLVER_API_KEY")
        
        if not capsolver.api_key:
            raise ValueError("La variable de entorno CAPSOLVER_API_KEY no está configurada")
        
        print("[*] Enviando tarea a CapSolver...")
        
        # Construir payload de la tarea con Enterprise, Invisible y Session
        tarea_payload = {
            "type": "ReCaptchaV2EnterpriseTaskProxyLess",
            "websiteKey": site_key,
            "websiteURL": page_url,
            "isInvisible": True,
            "isSession": True
        }
        
        # Resolver el reCaptcha
        solucion = capsolver.solve(tarea_payload)
        
        print("[+] ¡Captcha resuelto exitosamente!")
        
        # Extraer el token g-recaptcha-response
        g_recaptcha_response = solucion.get("gRecaptchaResponse")
        
        # Extraer cookies de sesión si están disponibles
        recaptcha_ca_t = solucion.get("recaptcha-ca-t")
        recaptcha_ca_e = solucion.get("recaptcha-ca-e")
        
        if g_recaptcha_response:
            print(f"[+] Token recibido (longitud: {len(g_recaptcha_response)} caracteres)")
            
            if recaptcha_ca_t:
                print(f"[+] Cookie recaptcha-ca-t recibida (longitud: {len(recaptcha_ca_t)} caracteres)")
            
            if recaptcha_ca_e:
                print(f"[+] Cookie recaptcha-ca-e recibida (longitud: {len(recaptcha_ca_e)} caracteres)")
            
            return {
                "gRecaptchaResponse": g_recaptcha_response,
                "recaptcha-ca-t": recaptcha_ca_t,
                "recaptcha-ca-e": recaptcha_ca_e
            }
        else:
            raise Exception("No se encontró gRecaptchaResponse en la solución")
            
    except Exception as e:
        print(f"[-] Error al resolver reCaptcha: {e}")
        raise


def enviar_solucion(resultado):
    """
    Función de ejemplo que muestra cómo enviar el token al sitio objetivo
    
    Args:
        resultado (dict): El resultado con token y cookies de sesión
    """
    import requests
    
    print("\n[*] Enviando solución al sitio...")
    
    try:
        # Preparar las cookies de sesión del captcha
        cookies = {}
        
        if resultado.get("recaptcha-ca-t"):
            cookies["recaptcha-ca-t"] = resultado["recaptcha-ca-t"]
        
        if resultado.get("recaptcha-ca-e"):
            cookies["recaptcha-ca-e"] = resultado["recaptcha-ca-e"]
        
        # Enviar el token al sitio con las cookies de sesión
        respuesta = requests.post(
            PAGE_URL,
            data={
                "g-recaptcha-response": resultado["gRecaptchaResponse"]
            },
            cookies=cookies,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        )
        
        if respuesta.status_code == 200:
            print("[+] ¡Solución enviada exitosamente!")
            print(f"[+] Estado de respuesta: {respuesta.status_code}")
            
            # Verificar si el envío fue exitoso
            if "Verification Success" in respuesta.text or "Success" in respuesta.text or "success" in respuesta.text:
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
    print("=" * 70)
    print("Resolvedor de reCaptcha V2 Enterprise - Integración con CapSolver")
    print("Modo: Invisible con Session (Cookies)")
    print("=" * 70)
    
    try:
        # Paso 1: Resolver el reCaptcha
        resultado = resolver_recaptcha_v2_enterprise_invisible(SITE_KEY, PAGE_URL)
        
        print("\n" + "=" * 70)
        print("RESULTADO")
        print("=" * 70)
        print(f"\ng-recaptcha-response:\n{resultado['gRecaptchaResponse']}\n")
        
        if resultado.get("recaptcha-ca-t"):
            print(f"recaptcha-ca-t (cookie):\n{resultado['recaptcha-ca-t']}\n")
        
        if resultado.get("recaptcha-ca-e"):
            print(f"recaptcha-ca-e (cookie):\n{resultado['recaptcha-ca-e']}\n")
        
        # Paso 2: Enviar la solución (demostración opcional)
        entrada_usuario = input("\n¿Deseas enviar este token al sitio? (s/n): ")
        if entrada_usuario.lower() == 's':
            enviar_solucion(resultado)
        else:
            print("[*] Token y cookies listos para usar. Omitiendo envío.")
        
        print("\n[+] ¡Proceso completado exitosamente!")
        
    except Exception as e:
        print(f"\n[-] El proceso falló: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
