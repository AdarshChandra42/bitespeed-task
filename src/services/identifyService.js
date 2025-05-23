import Contact from '../models/contact.js';
import { formatIdentifyResponse } from '../utils/responseFormatter.js';

class IdentifyService {
  async identifyPrimaryContact(email, phoneNumber) {
    try {
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

      // Get all linked contacts
      const linkedContacts = await Contact.findAllLinkedContacts(primaryContact.id);
      
      if (!linkedContacts || linkedContacts.length === 0) {
        return formatIdentifyResponse(primaryContact.id, [primaryContact]);
      }

      return formatIdentifyResponse(primaryContact.id, linkedContacts);
    } catch (error) {
      console.error('Error in identifyPrimaryContact:', error);
      throw error;
    }
  }
}

export default new IdentifyService();