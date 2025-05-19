import Contact from '../models/contact.js';
import { formatIdentifyResponse } from '../utils/responseFormatter.js';

class IdentifyService {
  async identifyPrimaryContact(email, phoneNumber) {
    // Find contacts that match either email or phone

    const primaryContact = await Contact.findByEmailOrPhone(email, phoneNumber);
    
    // If no contact found, create a new primary contact
    if (!primaryContact) {
      const newContact = await Contact.create({
        phoneNumber,
        email,
        linkedId: null,
        linkPrecedence: 'primary'
      });
      
      return formatIdentifyResponse(newContact.id, [newContact]);
    }

    const linkedContacts = await Contact.findAllLinkedContacts(primaryContact.id);

    return formatIdentifyResponse(primaryContact.id, linkedContacts);

  }
}

export default new IdentifyService();
