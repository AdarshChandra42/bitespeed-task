/**
 * Formats the API response for the identify endpoint
 * @param {number} primaryContactId - ID of the primary contact
 * @param {Array} contacts - Array of contact objects
 * @returns {Object} Formatted response object
 */
export const formatIdentifyResponse = (primaryContactId, contacts) => {
  const primaryContact = contacts.find(c => c.id === primaryContactId);
  const secondaryContacts = contacts.filter(c => c.linked_id === primaryContactId);
  
  // Collect all unique emails and phone numbers
  const emails = Array.from(new Set(contacts
    .filter(c => c.email)
    .map(c => c.email)
  ));
  
  const phoneNumbers = Array.from(new Set(contacts
    .filter(c => c.phone_number)
    .map(c => c.phone_number)
  ));
  
  // Ensure primary contact's email and phone are first in the arrays
  if (primaryContact.email && emails.includes(primaryContact.email)) {
    emails.splice(emails.indexOf(primaryContact.email), 1);
    emails.unshift(primaryContact.email);
  }
  
  if (primaryContact.phone_number && phoneNumbers.includes(primaryContact.phone_number)) {
    phoneNumbers.splice(phoneNumbers.indexOf(primaryContact.phone_number), 1);
    phoneNumbers.unshift(primaryContact.phone_number);
  }
  
  return {
    contact: {
      primaryContactId: primaryContactId,
      emails,
      phoneNumbers,
      secondaryContactIds: secondaryContacts.map(c => c.id)
    }
  };
};

export default {
  formatIdentifyResponse
};
