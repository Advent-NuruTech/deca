export const DEFAULT_WHATSAPP_PHONE = "254701836849";
export const DEFAULT_CHAT_SETTINGS = {
  directPhone: DEFAULT_WHATSAPP_PHONE,
  categories: [
    { id: "revision-books", label: "Revision books", phone: DEFAULT_WHATSAPP_PHONE },
    { id: "bulk-orders", label: "Bulk orders", phone: DEFAULT_WHATSAPP_PHONE },
    { id: "delivery", label: "Delivery", phone: DEFAULT_WHATSAPP_PHONE },
    { id: "author-enquiries", label: "Author enquiries", phone: DEFAULT_WHATSAPP_PHONE },
  ],
};

export function whatsappUrl(phone: string, topic?: string) {
  const message = topic
    ? `Hello Dennis, I'm from the Deca Bookstore website and would like to enquire about ${topic}.`
    : "Hello Dennis, I'm from your website and I would like to enquire about Deca Bookstore's revision materials.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
