import identifyService from '../services/identifyService.js';

class IdentifyController {
  async identify(req, res) {
    try {
      let { email, phoneNumber } = req.body;

      // Convert empty strings to null
      email = (!email || email.trim() === '') ? null : email;
      phoneNumber = (!phoneNumber || phoneNumber.trim() === '') ? null : phoneNumber;
      
      // Basic validation
      if (email === null && phoneNumber === null) {
        return res.status(400).json({ 
          error: 'At least one of email or phoneNumber must be provided' 
        });
      }
      
      const result = await identifyService.identifyPrimaryContact(email, phoneNumber);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in identify controller:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new IdentifyController();