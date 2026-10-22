import { WhatsappIcon } from "@/components/site/brand_icons";
import { site_config } from "@/lib/site_config";

/**
 * El boton flotante de WhatsApp, abajo a la derecha en todas las paginas.
 *
 * Reemplaza al «Contacto» que tenia el navbar hasta el 2026-10-12: el bloque
 * de contacto sigue en el pie, y esto deja el canal mas directo a un toque sin
 * ocupar lugar en la barra. **El enlace es el mismo que el boton del pie**
 * (`site_config.whatsapp_url` con `footer_contact_whatsapp_message`): si el
 * mensaje cambia, cambia en los dos.
 *
 * `z-40`, uno por debajo de la isla y del banner de cookies (`z-50`): el banner
 * tambien vive abajo a la derecha, y mientras esta abierto tiene que quedar
 * encima. Va despues del contenido en el DOM, asi que no es lo primero que
 * recorre el teclado.
 *
 * **El verde de WhatsApp va literal, y es la excepcion a «nunca colores
 * literales»** (decision del usuario, 2026-10-12): es el color por el que se
 * reconoce el boton, y es el mismo en los dos temas. Primero se probo en
 * `bg-foreground` y se pidio verde.
 */
export function WhatsappFloat({ dict }) {
  return (
    <a
      href={site_config.whatsapp_url(dict.footer_contact_whatsapp_message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.a11y_whatsapp_float}
      title={dict.a11y_whatsapp_float}
      data-track="whatsapp_float"
      data-track-location="whatsapp_float"
      className="fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white hover:bg-[#1ebe5b] shadow-lg transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:right-6 sm:bottom-6"
    >
      <WhatsappIcon class_name="size-7" />
    </a>
  );
}
