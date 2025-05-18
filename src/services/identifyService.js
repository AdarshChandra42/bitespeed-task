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

    // Check if we need to create a new secondary contact
    const allLinkedContacts = await Contact.findAllLinkedContacts(primaryContact.id);


    // Extract emails and phone numbers, removing duplicates and null values
    const emails = [...new Set(allLinkedContacts
      .map(contact => contact.email)
      .filter(email => email !== null))];
    
    const phoneNumbers = [...new Set(allLinkedContacts
      .map(contact => contact.phone_number)
      .filter(phone => phone !== null))];
    
    // Find primary and secondary contact IDs
    const primaryContactId = primaryContact.id;
    const secondaryContactIds = allLinkedContacts
      .filter(contact => contact.linkedId !== null)
      .map(contact => contact.id);

    // Check if input email/phone exists in linked contacts
    const emailExists = emails.includes(email);
    const phoneExists = phoneNumbers.includes(phoneNumber);

    // Create new secondary contacts for missing email/phone
    if (!emailExists || !phoneExists) {
      if (!emailExists && email) {
        await Contact.create({
          email,
          phoneNumber: null,
          linkedId: primaryContactId,
          linkPrecedence: 'secondary'
        });
      }
      
      if (!phoneExists && phoneNumber) {
        await Contact.create({
          email: null,
          phoneNumber,
          linkedId: primaryContactId,
          linkPrecedence: 'secondary'
        });
      }
    }

    const LinkedContacts = await Contact.findAllLinkedContacts(primaryContactId);

    return formatIdentifyResponse(primaryContactId, LinkedContacts);

  }
}

export default new IdentifyService();
