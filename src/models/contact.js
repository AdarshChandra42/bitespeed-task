import db from '../config/db.js';

class Contact {
  static async findByEmailOrPhone(email, phoneNumber) {
    // First, find all contacts that match either email or phone
    const query = `
      SELECT * FROM contact 
      WHERE (email = $1 OR phone_number = $2) 
      AND deleted_at IS NULL
      ORDER BY created_at ASC
    `;
    const { rows } = await db.query(query, [email, phoneNumber]);
    console.log("rows");
    console.log(rows);

    if (rows.length === 0) {console.log("no contact found"); return null;}

    //checking if the input email or phone number is already in the database
    let emailExists = false;
    let phoneExists = false;
    
    for (const row of rows) {
      if (row.email === email) emailExists = true;
      if (row.phone_number === phoneNumber) phoneExists = true;
      if (emailExists && phoneExists) break; //connect the two chains
    }
    
      // If one doesn't exist but we have some matching contacts, create a new secondary contact
      if((emailExists && phoneNumber === undefined || phoneNumber === null)||(phoneExists && email === undefined || email === null)) {
        console.log("one is null/undefined");
        // Find the primary contact to link to
        let primaryContact;
        if(rows[0].linked_id === null) {primaryContact = rows[0]}
        else {primaryContact = await this.findById(rows[0].linked_id)}
        return primaryContact;
      }
      else if(!emailExists || !phoneExists) {
        // Find the primary contact to link to
        let primaryContact;
        if(rows[0].linked_id === null) {primaryContact = rows[0]}
        else {primaryContact = await this.findById(rows[0].linked_id)}
        
        // Create new contact with the missing information
        const newContact = await this.create({
          email: email,
          phoneNumber: phoneNumber,
          linkedId: primaryContact.id,
          linkPrecedence: 'secondary'
        });
        
        // Add to rows array
        rows.push(newContact);
      }

    // Find all primary contacts in the results
    const primaryContacts = [];
    for (const contact of rows) {
      if (contact.linked_id === null) {
        // This is a primary contact
        primaryContacts.push(contact);
      } else {
        // This is a secondary contact, find its primary
        const primaryContact = await this.findById(contact.linked_id);
        if (primaryContact && !primaryContacts.some(p => p.id === primaryContact.id)) {
          primaryContacts.push(primaryContact);
        }
      }
    }
    console.log("primaryContacts");
    console.log(primaryContacts);



    // Find all secondary contacts in the results
    const secondaryContacts = [];
    for (const primaryContact of primaryContacts) {
      const linkedId = primaryContact.id;
      // Query the database to find all contacts linked to this primary contact
      const query = `
        SELECT * FROM contact 
        WHERE linked_id = $1 
        AND deleted_at IS NULL
        ORDER BY created_at ASC
      `;
      const { rows: linkedRows } = await db.query(query, [linkedId]);
      secondaryContacts.push(...linkedRows);
    }
    
    console.log("secondaryContacts");
    console.log(secondaryContacts);
    
    // If we have multiple primary contacts, we need to merge chains
    if (primaryContacts.length > 1) {
      // Sort by created_at to find the oldest primary contact
      //there can only be two primary contacts but here i have used "multiple" just to be more robust
      primaryContacts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      const oldestPrimary = primaryContacts[0];

      oldestPrimary.linkedId = null; //just in case
      console.log("oldestPrimary");
      console.log(oldestPrimary);
      
      // Update all other primary contacts to be secondary
      for (let i = 1; i < primaryContacts.length; i++) {
        const updatedContact = await this.update(primaryContacts[i].id, {
          linkedId: oldestPrimary.id,
          linkPrecedence: 'secondary'
        });
        secondaryContacts.push(updatedContact);
      }
      
      // Update all secondary contacts to point to the new primary
      for (const contact of secondaryContacts) {
        if (contact.linkedId !== oldestPrimary.id) {
          await this.update(contact.id, {
            linkedId: oldestPrimary.id,
            linkPrecedence: 'secondary'
          });
        }
      }
      
      // Return the oldest primary contact
      return oldestPrimary;
    }
    
      return primaryContacts[0];
  }

  static async findById(id) {
    const query = `
      SELECT * FROM contact 
      WHERE id = $1 
      AND deleted_at IS NULL
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async findAllLinkedContacts(primaryId) {
    const query = `
      SELECT * FROM contact 
      WHERE (id = $1 OR linked_id = $1) 
      AND deleted_at IS NULL
      ORDER BY created_at ASC
    `;
    const { rows } = await db.query(query, [primaryId]);
    return rows;
  }

  static async create(contact) {
    const query = `
      INSERT INTO contact (phone_number, email, linked_id, link_precedence, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
      RETURNING *
    `;
    const { rows } = await db.query(query, [
      contact.phoneNumber, 
      contact.email, 
      contact.linkedId,
      contact.linkPrecedence
    ]);
    return rows[0];
  }

  static async update(id, updates) {
    const query = `
      UPDATE contact 
      SET linked_id = $1, link_precedence = $2, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $3 
      RETURNING * 
    `;
    const { rows } = await db.query(query, [updates.linkedId, updates.linkPrecedence, id]);
    return rows[0];
  }
}

export default Contact;
